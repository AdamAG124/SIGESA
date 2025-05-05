const Database = require('./ConectarDB');
const CuentaBancaria = require('../domain/CuentaBancaria');

class CuentaBancariaBD {

    #db;
    #table;

    constructor() {
        this.#db = new Database();
        this.#table = 'SIGM_CUENTA_BANCARIA';
    }

    async obtenerCuentasBancarias(pageSize, currentPage, searchValue, idEntidadFinanciera, tipoDivisa, estado) {
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

            // Filtro por ESTADO
            if (estado !== null && estado !== undefined) {
                query += ` AND cb.ESTADO = ?`;
                countQuery += ` AND cb.ESTADO = ?`;
                params.push(estado ? 1 : 0); // Convertir booleano a 1 o 0 para la base de datos
                countParams.push(estado ? 1 : 0);
            }

            // Obtener el total de registros (para paginación)
            const [[{ total }]] = await connection.query(countQuery, countParams);

            // Calcular detalles de paginación
            let paginationDetails = {
                pageSize: pageSize || 0,
                totalPages: 0,
                currentPage,
                totalRecords: total,
                firstPage: 1,
                lastPage: 1,
                searchValue,
                idEntidadFinanciera,
                tipoDivisa,
                estado
            };

            // Ejecutar la consulta principal
            let rows;
            if (pageSize && currentPage && pageSize > 0 && currentPage > 0) {
                const offset = (currentPage - 1) * pageSize;
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

    async crearCuentaBancaria(cuentaBancaria) {
        let connection;
        try {

            connection = await this.#db.conectar();

            // Construir la consulta INSERT
            const query = `
                INSERT INTO ${this.#table} (
                    ID_ENTIDAD_FINANCIERA,
                    DSC_BANCO,
                    NUM_CUENTA_BANCARIA,
                    TIPO_DIVISA,
                    ESTADO
                ) VALUES (?, ?, ?, ?, ?)
            `;
            const params = [
                cuentaBancaria.getIdEntidadFinanciera().getIdEntidadFinanciera(),
                cuentaBancaria.getBanco(),
                cuentaBancaria.getNumero(),
                cuentaBancaria.getDivisa(),
                1
            ];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            return {
                success: true,
                message: 'Cuenta bancaria creada exitosamente'
            };
        } catch (error) {
            console.error('Error en crearCuentaBancaria:', error.message);
            return {
                success: false,
                message: 'Error al crear la cuenta bancaria: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async actualizarCuentaBancaria(cuentaBancaria) {
        let connection;
        try {
            connection = await this.#db.conectar();

            // Construir la consulta UPDATE
            const query = `
                UPDATE ${this.#table} SET
                    ID_ENTIDAD_FINANCIERA = ?,
                    DSC_BANCO = ?,
                    NUM_CUENTA_BANCARIA = ?,
                    TIPO_DIVISA = ?,
                    ESTADO = ?
                WHERE ID_CUENTA_BANCARIA = ?
            `;
            const params = [
                cuentaBancaria.getIdEntidadFinanciera().getIdEntidadFinanciera(),
                cuentaBancaria.getBanco(),
                cuentaBancaria.getNumero(),
                cuentaBancaria.getDivisa(),
                1,
                cuentaBancaria.getIdCuentaBancaria()
            ];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            return {
                success: true,
                message: 'Cuenta bancaria actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error en actualizarCuentaBancaria:', error.message);
            return {
                success: false,
                message: 'Error al actualizar la cuenta bancaria: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async eliminarCuentaBancaria(idCuentaBancaria, estado) {
        let connection;
        try {
            connection = await this.#db.conectar();

            // Construir la consulta UPDATE para eliminar (cambiar estado)
            const query = `
                UPDATE ${this.#table} SET
                    ESTADO = ?
                WHERE ID_CUENTA_BANCARIA = ?
            `;
            const params = [
                estado,
                idCuentaBancaria
            ];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            return {
                success: true,
                message: estado ? 'Cuenta bancaria restaurada exitosamente' : 'Cuenta bancaria eliminada exitosamente'
            };
        } catch (error) {
            console.error('Error en eliminarCuentaBancaria:', error.message);
            return {
                success: false,
                message: 'Error al eliminar la cuenta bancaria: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = CuentaBancariaBD;