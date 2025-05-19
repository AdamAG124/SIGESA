const ConectarDB = require('./ConectarDB');
const ComprobantePago = require('../domain/ComprobantePago');
const CuentaBancaria = require('../domain/CuentaBancaria');

class ComprobantePagoDB {
    #table;
    #db;

    constructor() {
        this.#table = 'sigm_comprobante_pago';
        this.#db = new ConectarDB();
    }

    async listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria) {
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
                ef.ESTADO AS estadoEntidadFinanciera,
                -- Información de la cuenta bancaria
                cb.NUM_CUENTA_BANCARIA AS numeroCuentaBancaria
            FROM 
                ${this.#table} cp
            LEFT JOIN 
                sigm_entidad_financiera ef ON cp.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
            LEFT JOIN 
                sigm_cuenta_bancaria cb ON cp.ID_ENTIDAD_FINANCIERA = cb.ID_ENTIDAD_FINANCIERA
        `;

            // Bandera para rastrear si ya se agregó WHERE
            let whereClauseAdded = false;

            // Aplicar filtros dinámicamente
            if (idEntidadFinanciera !== null && idEntidadFinanciera !== "") {
                query += ` WHERE cp.ID_ENTIDAD_FINANCIERA = ${idEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (fechaInicio !== null && fechaInicio !== "" && fechaFin !== null && fechaFin !== "") {
                const fechaCondition = `cp.FEC_PAGO BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                query += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null && fechaInicio !== "") {
                query += whereClauseAdded ?
                    ` AND cp.FEC_PAGO >= '${fechaInicio}'` :
                    ` WHERE cp.FEC_PAGO >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null && fechaFin !== "") {
                query += whereClauseAdded ?
                    ` AND cp.FEC_PAGO <= '${fechaFin}'` :
                    ` WHERE cp.FEC_PAGO <= '${fechaFin}'`;
                whereClauseAdded = true;
            }

            if (estado !== null && estado !== "") {
                query += whereClauseAdded ?
                    ` AND cp.ESTADO = ${estado}` :
                    ` WHERE cp.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (searchValue !== null && searchValue !== "") {
                const searchCondition = `cp.NUM_COMPROBANTE_PAGO LIKE '%${searchValue}%'`;
                query += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
                whereClauseAdded = true;
            }

            if (idCuentaBancaria !== null && idCuentaBancaria !== "") {
                query += whereClauseAdded ?
                    ` AND cb.ID_CUENTA_BANCARIA = ${idCuentaBancaria}` :
                    ` WHERE cb.ID_CUENTA_BANCARIA = ${idCuentaBancaria}`;
                whereClauseAdded = true;
            }

            if (pageSize !== null && pageSize !== "" && currentPage !== null && currentPage !== "") {
                query += ` ORDER BY cp.ID_COMPROBANTE_PAGO ASC LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Consulta para contar el total de registros
            let countQuery = `
    SELECT COUNT(*) as total
    FROM ${this.#table} cp
    LEFT JOIN sigm_entidad_financiera ef ON cp.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
    LEFT JOIN sigm_cuenta_bancaria cb ON cp.ID_ENTIDAD_FINANCIERA = cb.ID_ENTIDAD_FINANCIERA
`;

            // Aplicar los mismos filtros al conteo
            whereClauseAdded = false;

            if (idEntidadFinanciera !== null && idEntidadFinanciera !== "") {
                countQuery += ` WHERE cp.ID_ENTIDAD_FINANCIERA = ${idEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (fechaInicio !== null && fechaInicio !== "" && fechaFin !== null && fechaFin !== "") {
                const fechaCondition = `cp.FEC_PAGO BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                countQuery += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null && fechaInicio !== "") {
                countQuery += whereClauseAdded ?
                    ` AND cp.FEC_PAGO >= '${fechaInicio}'` :
                    ` WHERE cp.FEC_PAGO >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null && fechaFin !== "") {
                countQuery += whereClauseAdded ?
                    ` AND cp.FEC_PAGO <= '${fechaFin}'` :
                    ` WHERE cp.FEC_PAGO <= '${fechaFin}'`;
                whereClauseAdded = true;
            }

            if (estado !== null && estado !== "") {
                countQuery += whereClauseAdded ?
                    ` AND cp.ESTADO = ${estado}` :
                    ` WHERE cp.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (searchValue !== null && searchValue !== "") {
                const searchCondition = `cp.NUM_COMPROBANTE_PAGO LIKE '%${searchValue}%'`;
                countQuery += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
                whereClauseAdded = true;
            }

            if (idCuentaBancaria !== null && idCuentaBancaria !== "") {
                countQuery += whereClauseAdded ?
                    ` AND cb.ID_CUENTA_BANCARIA = ${idCuentaBancaria}` :
                    ` WHERE cb.ID_CUENTA_BANCARIA = ${idCuentaBancaria}`;
                whereClauseAdded = true;
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

                comprobantePago.getIdEntidadFinanciera().setIdEntidadFinanciera(row.idEntidadFinanciera || 0);
                comprobantePago.getIdEntidadFinanciera().setNombre(row.nombreEntidadFinanciera || 'Sin entidad');
                comprobantePago.getIdEntidadFinanciera().setTipo(row.tipoEntidadFinanciera || '');
                comprobantePago.getIdEntidadFinanciera().setEstado(row.estadoEntidadFinanciera !== null ? row.estadoEntidadFinanciera : false);

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
                totalPages: totalPages,
                searchValue: searchValue,
                idEntidadFinanciera: idEntidadFinanciera,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                estado: estado
            };

        } catch (error) {
            console.error('Error al listar los comprobantes de pago:', error.message);
            throw new Error('Error al listar los comprobantes de pago: ' + error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async crearComprobantePago(comprobantePago) {
        let connection;

        try {
            // Conectar a la base de datos
            connection = await this.#db.conectar();

            // Paso 1: Obtener el ID_ENTIDAD_FINANCIERA de la tabla sigm_cuenta_bancaria
            const idCuentaBancaria = comprobantePago.getIdEntidadFinanciera().getIdEntidadFinanciera(); // Asumimos que esto devuelve el ID_CUENTA_BANCARIA
            const queryCuentaBancaria = `
            SELECT ID_ENTIDAD_FINANCIERA
            FROM sigm_cuenta_bancaria
            WHERE ID_CUENTA_BANCARIA = ?
        `;
            const [cuentaResult] = await connection.query(queryCuentaBancaria, [idCuentaBancaria]);

            // Verificar si se encontró la cuenta bancaria
            if (!cuentaResult || cuentaResult.length === 0) {
                return{
                    success: false,
                    message: "No se encontró una cuenta bancaria con el ID proporcionado."
                }
            }

            const idEntidadFinanciera = cuentaResult[0].ID_ENTIDAD_FINANCIERA;

            // Verificar que ID_ENTIDAD_FINANCIERA no sea null
            if (idEntidadFinanciera === null || idEntidadFinanciera === undefined) {
                return {
                    success: false,
                    message: "La cuenta bancaria no tiene una entidad financiera asociada."
                };
            }

            // Paso 2: Insertar el nuevo comprobante de pago en sigm_comprobante_pago
            const queryInsertComprobante = `
            INSERT INTO sigm_comprobante_pago (
                ID_ENTIDAD_FINANCIERA,
                FEC_PAGO,
                NUM_COMPROBANTE_PAGO,
                MONTO_COMPROBANTE_PAGO,
                ESTADO
            ) VALUES (?, ?, ?, ?, ?)
        `;
            const estadoDefault = 1; // Estado por defecto (activo)
            const params = [
                idEntidadFinanciera,
                comprobantePago.getFechaPago(),
                comprobantePago.getNumero(),
                comprobantePago.getMonto(),
                estadoDefault
            ];

            const [insertResult] = await connection.query(queryInsertComprobante, params);

            // Verificar si el comprobante fue insertado correctamente
            if (insertResult.affectedRows === 0) {
                return {
                    success: false,
                    message: "No se pudo insertar el comprobante de pago."
                };
            }

            // Retornar el ID del nuevo comprobante y un mensaje de éxito
            return {
                success: true,
                message: "Comprobante de pago creado exitosamente."
            };

        } catch (error) {
            console.error("Error al crear el comprobante de pago:", error.message);
            return{
                success: false,
                message: error.message
            }
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = ComprobantePagoDB;