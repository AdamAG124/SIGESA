const Database = require('./ConectarDB');
const CuentaBancaria = require('../domain/CuentaBancaria');

class CuentaBancariaBD {

    #db;
    #table;

    constructor() {
        this.#db = new Database();
        this.#table = 'SIGM_CUENTA_BANCARIA';
    }

    async obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa) {
        let connection;
        try {
            connection = await this.#db.conectar();

            // Construir la consulta base con INNER JOIN, seleccionando solo ID y nombre de la entidad financiera
            let query = `
                SELECT 
                    cb.ID_CUENTA_BANCARIA,
                    cb.ID_ENTIDAD_FINANCIERA,
                    cb.DSC_BANCO,
                    cb.NUM_CUENTA_BANCARIA,
                    cb.TIPO_DIVISA,
                    cb.ESTADO,
                    ef.DSC_NOMBRE_ENTIDAD_FINANCIERA
                FROM ${this.#table} cb
                INNER JOIN sigm_entidad_financiera ef ON cb.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
                WHERE 1=1
            `;
            let countQuery = `
                SELECT COUNT(*) as total 
                FROM ${this.#table} cb
                INNER JOIN sigm_entidad_financiera ef ON cb.ID_ENTIDAD_FINANCIERA = ef.ID_ENTIDAD_FINANCIERA
                WHERE 1=1
            `;
            const params = [];
            const countParams = [];

            // Filtro por búsqueda (NUM_CUENTA_BANCARIA y DSC_BANCO)
            if (searchValue && searchValue.trim() !== '') {
                const searchTerm = `%${searchValue.trim()}%`;
                query += ` AND (cb.NUM_CUENTA_BANCARIA LIKE ? OR cb.DSC_BANCO LIKE ?)`;
                countQuery += ` AND (cb.NUM_CUENTA_BANCARIA LIKE ? OR cb.DSC_BANCO LIKE ?)`;
                params.push(searchTerm, searchTerm);
                countParams.push(searchTerm, searchTerm);
            }

            // Filtro por ID_ENTIDAD_FINANCIERA
            if (idEntidadFinanciera && idEntidadFinanciera !== 0) {
                query += ` AND cb.ID_ENTIDAD_FINANCIERA = ?`;
                countQuery += ` AND cb.ID_ENTIDAD_FINANCIERA = ?`;
                params.push(idEntidadFinanciera);
                countParams.push(idEntidadFinanciera);
            }

            // Filtro por TIPO_DIVISA
            if (tipoDivisa && tipoDivisa !== null) {
                query += ` AND cb.TIPO_DIVISA = ?`;
                countQuery += ` AND cb.TIPO_DIVISA = ?`;
                params.push(tipoDivisa);
                countParams.push(tipoDivisa);
            }

            // Obtener el total de registros (para paginación)
            const [[{ total }]] = await connection.query(countQuery, countParams);

            // Calcular detalles de paginación
            let paginationDetails = {
                pageSize: pageSize || 0,
                totalPages: 0,
                totalRecords: total,
                firstPage: 1,
                lastPage: 1
            };

            // Ejecutar la consulta principal
            let rows;
            if (pageSize && pageNumber && pageSize > 0 && pageNumber > 0) {
                const offset = (pageNumber - 1) * pageSize;
                query += ` LIMIT ? OFFSET ?`;
                params.push(pageSize, offset);
                [rows] = await connection.query(query, params);

                // Calcular totalPages y lastPage
                paginationDetails.pageSize = pageSize;
                paginationDetails.totalPages = Math.ceil(total / pageSize);
                paginationDetails.lastPage = paginationDetails.totalPages;
            } else {
                // Si no hay paginación, devolver todos los registros
                [rows] = await connection.query(query, params);
                paginationDetails.pageSize = total; // Todos los registros en una sola página
                paginationDetails.totalPages = 1;
                paginationDetails.lastPage = 1;
            }

            // Mapear los resultados a objetos de la clase CuentaBancaria
            const cuentasBancarias = rows.map(row => {
                const cuentaBancaria = new CuentaBancaria();
                cuentaBancaria.setIdCuentaBancaria(row.ID_CUENTA_BANCARIA);
                cuentaBancaria.setBanco(row.DSC_BANCO || '');
                cuentaBancaria.setNumero(row.NUM_CUENTA_BANCARIA || '');
                cuentaBancaria.setDivisa(row.TIPO_DIVISA || '');
                cuentaBancaria.setEstado(row.ESTADO === 1);

                // Usar el objeto EntidadFinanciera existente dentro de CuentaBancaria
                const entidadFinanciera = cuentaBancaria.getIdEntidadFinanciera();
                entidadFinanciera.setIdEntidadFinanciera(row.ID_ENTIDAD_FINANCIERA);
                entidadFinanciera.setNombre(row.DSC_NOMBRE_ENTIDAD_FINANCIERA || '');

                return cuentaBancaria;
            });

            return {
                success: true,
                data: cuentasBancarias,
                total: total,
                pagination: paginationDetails,
                message: 'Cuentas bancarias obtenidas correctamente'
            };
        } catch (error) {
            console.error('Error en obtenerCuentasBancarias:', error.message);
            return {
                success: false,
                data: [],
                total: 0,
                pagination: {
                    pageSize: 0,
                    totalPages: 0,
                    totalRecords: 0,
                    firstPage: 1,
                    lastPage: 1
                },
                message: 'Error al obtener las cuentas bancarias: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = CuentaBancariaBD;