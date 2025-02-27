const ConectarDB = require('./ConectarDB');
const EntidadFinanciera = require('../domain/EntidadFinanciera'); // Importamos la clase Categoria

class EntidadFinancieraDB {
    #table;

    constructor() {
        this.#table = 'SIGM_ENTIDAD_FINANCIERA';
    }

    async listarEntidadesFinancieras(pageSize, currentPage, estadoEntidadFinanciera, valorBusqueda) {
        const db = new ConectarDB();
        let connection;
        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Consultar todos los proveedores
            let query = `
                SELECT
                    E.ID_ENTIDAD_FINANCIERA AS idEntidadFinanciera,
                    E.DSC_NOMBRE_ENTIDAD_FINANCIERA AS nombre,
                    E.TIPO_ENTIDAD_FINANCIERA AS tipo,
                    E.ESTADO AS estado
                FROM
                    ${this.#table} E
            `;

            let whereClauseAdded = false;

            if (estadoEntidadFinanciera !== null) {
                query += ` WHERE E.ESTADO = ${estadoEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(E.DSC_NOMBRE_ENTIDAD_FINANCIERA)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Agregar el orden y la paginación
            query += ` ORDER BY E.ID_ENTIDAD_FINANCIERA DESC`; // Ordenar por ID_ENTIDAD_FINANCIERA de forma descendente

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const [rows] = await connection.query(query);

            const entidadesFinancieras = rows.map(entidadFinancieraDB => {
                const entidadFinanciera = new EntidadFinanciera();
                entidadFinanciera.setIdEntidadFinanciera(entidadFinancieraDB.idEntidadFinanciera);
                entidadFinanciera.setNombre(entidadFinancieraDB.nombre);
                entidadFinanciera.setTipo(entidadFinancieraDB.tipo);
                entidadFinanciera.setEstado(entidadFinancieraDB.estado);
                return entidadFinanciera;
            });

            // Consulta para contar total de proveedores
            let countQuery = `SELECT COUNT(*) AS total FROM ${this.#table} E`;
            if (estadoEntidadFinanciera !== null) {
                countQuery += ` WHERE E.ESTADO = ${estadoEntidadFinanciera}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio (sin espacios en blanco)
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(E.DSC_NOMBRE_ENTIDAD_FINANCIERA)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            const [countResult] = await connection.query(countQuery);

            // Verificar que countResult tenga resultados
            const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;
            console.log(`Total pages ${totalPages}`);
            console.log(`Total Records ${totalRecords}`);
            console.log(`pageSize ${pageSize}`);
            // Retornar los proveedores y los datos de paginación
            return {
                entidadesFinancieras,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoEntidadFinanciera,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar las entidades financieras:', error);
            return {
                success: false,
                message: 'Error al listar las entidades financieras: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }


}
// Exportar la clase
module.exports = EntidadFinancieraDB;
