const ConectarDB = require('./ConectarDB');
const ComprobantePago = require('../domain/ComprobantePago');

class ComprobantePagoDB {
    #table;
    #db;

    constructor() {
        this.#table = 'sigm_comprobante_pago';
        this.#db = new ConectarDB();
    }

    async listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Calcular el offset para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta base
            let query = `
                SELECT 
                    cp.ID_COMPROBANTE_PAGO AS idComprobantePago,
                    cp.ID_ENTIDAD_FINANCIERA AS idEntidadFinanciera,
                    cp.FEC_PAGO AS fechaPago,
                    cp.NUM_COMPROBANTE_PAGO AS numeroComprobantePago,
                    cp.MONTO_COMPROBANTE_PAGO AS montoComprobantePago,
                    cp.ESTADO AS estadoComprobantePago,
                    -- Información de la entidad financiera
                    ef.DSC_NOMBRE_ENTIDAD_FINANCIERA AS nombreEntidadFinanciera,
                    ef.TIPO_ENTIDAD_FINANCIERA AS tipoEntidadFinanciera,
                    ef.ESTADO AS estadoEntidadFinanciera
                FROM 
                    ${this.#table} cp
                INNER JOIN 
                    sigm_entidad_financiera ef ON cp.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
            `;

            // Bandera para rastrear si ya se agregó WHERE
            let whereClauseAdded = false;

            // Aplicar filtros dinámicamente
            if (idEntidadFinanciera !== null) {
                query += ` WHERE cp.ID_ENTIDAD_FINANCIERA = ${idEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `cp.FEC_PAGO BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                query += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                query += whereClauseAdded ?
                    ` AND cp.FEC_PAGO >= '${fechaInicio}'` :
                    ` WHERE cp.FEC_PAGO >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                query += whereClauseAdded ?
                    ` AND cp.FEC_PAGO <= '${fechaFin}'` :
                    ` WHERE cp.FEC_PAGO <= '${fechaFin}'`;
                whereClauseAdded = true;
            }

            if (estado !== null) {
                query += whereClauseAdded ?
                    ` AND cp.ESTADO = ${estado}` :
                    ` WHERE cp.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (searchValue !== null) {
                const searchCondition = `cp.NUM_COMPROBANTE_PAGO LIKE '%${searchValue}%'`;
                query += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
                whereClauseAdded = true;
            }

            if (pageSize !== null && currentPage !== null) {
                // Agregar ordenamiento y paginación
                query += ` ORDER BY cp.ID_COMPROBANTE_PAGO ASC LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Consulta para contar el total de registros
            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} cp
                INNER JOIN sigm_entidad_financiera ef ON cp.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
            `;

            // Aplicar los mismos filtros al conteo
            whereClauseAdded = false;

            if (idEntidadFinanciera !== null) {
                countQuery += ` WHERE cp.ID_ENTIDAD_FINANCIERA = ${idEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `cp.FEC_PAGO BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                countQuery += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                countQuery += whereClauseAdded ?
                    ` AND cp.FEC_PAGO >= '${fechaInicio}'` :
                    ` WHERE cp.FEC_PAGO >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                countQuery += whereClauseAdded ?
                    ` AND cp.FEC_PAGO <= '${fechaFin}'` :
                    ` WHERE cp.FEC_PAGO <= '${fechaFin}'`;
                whereClauseAdded = true;
            }

            if (estado !== null) {
                countQuery += whereClauseAdded ?
                    ` AND cp.ESTADO = ${estado}` :
                    ` WHERE cp.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (searchValue !== null) {
                const searchCondition = `cp.NUM_COMPROBANTE_PAGO LIKE '%${searchValue}%'`;
                countQuery += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
            }

            // Ejecutar ambas consultas
            const [rows] = await connection.query(query);
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Mapear los resultados a objetos ComprobantePago
            const comprobantesPago = rows.map(row => {
                const comprobantePago = new ComprobantePago();

                comprobantePago.setIdComprobantePago(row.idComprobantePago);
                comprobantePago.setFechaPago(row.fechaPago);
                comprobantePago.setNumero(row.numeroComprobantePago);
                comprobantePago.setMonto(row.montoComprobantePago);
                comprobantePago.setEstado(row.estadoComprobantePago);

                comprobantePago.getIdEntidadFinanciera().setIdEntidadFinanciera(row.idEntidadFinanciera);
                comprobantePago.getIdEntidadFinanciera().setNombre(row.nombreEntidadFinanciera);
                comprobantePago.getIdEntidadFinanciera().setTipo(row.tipoEntidadFinanciera);
                comprobantePago.getIdEntidadFinanciera().setEstado(row.estadoEntidadFinanciera);

                return comprobantePago;
            });

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalRecords / pageSize);

            // Devolver los resultados con metadatos de paginación
            return {
                comprobantes: comprobantesPago,
                total: totalRecords,
                pageSize: pageSize,
                currentPage: currentPage,
                totalPages: totalPages
            };

        } catch (error) {
            console.error('Error al listar los comprobantes de pago:', error.message);
            throw new Error('Error al listar los comprobantes de pago: ' + error.message);
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }

    async actualizarComprobantePago(comprobantePago) { 

        let connection;

        try {
            connection = await this.#db.conectar();

            const query = `
                UPDATE ${this.#table}
                SET 
                    ID_ENTIDAD_FINANCIERA = ?,
                    FEC_PAGO = ?,
                    NUM_COMPROBANTE_PAGO = ?,
                    MONTO_COMPROBANTE_PAGO = ?,
                    ESTADO = ?
                WHERE 
                    ID_COMPROBANTE_PAGO = ?
            `;

            const params = [
                comprobantePago.getIdEntidadFinanciera().getIdEntidadFinanciera(),
                comprobantePago.getFechaPago(),
                comprobantePago.getNumero(),
                comprobantePago.getMonto(),
                comprobantePago.getEstado(),
                comprobantePago.getIdComprobantePago()
            ];

            await connection.query(query, params);
        } catch (error) {
            console.error('Error al actualizar el comprobante de pago:', error.message);
            throw new Error('Error al actualizar el comprobante de pago: ' + error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = ComprobantePagoDB;