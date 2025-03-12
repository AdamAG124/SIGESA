const ConectarDB = require('./ConectarDB');
const SalidaProducto = require('../domain/SalidaProducto');

class SalidaProductoDB {
    #table;

    constructor() {
        this.#table = 'sigt_salida_producto';
    }

    async listarSalidaProductos(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;
        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Consultar todas las salidas de productos
            let query = `
                SELECT
                    SP.ID_SALIDA_PRODUCTO AS idSalidaProducto,
                    SP.ID_PRODUCTO AS idProducto,
                    SP.ID_SALIDA AS idSalida,
                    SP.CANTIDAD_ANTERIOR AS cantidadAnterior,
                    SP.CANTIDAD_SALIENDO AS cantidadSaliendo,
                    SP.CANTIDAD_NUEVA AS cantidadNueva,
                    SP.ESTADO AS estado
                FROM
                    ${this.#table} SP
            `;

            let whereClauseAdded = false;

            if (estado !== null) {
                query += ` WHERE SP.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(SP.ID_PRODUCTO)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Agregar el orden y la paginación
            query += ` ORDER BY SP.ID_SALIDA_PRODUCTO DESC`; // Ordenar por ID_SALIDA_PRODUCTO de forma descendente

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const [rows] = await connection.query(query);

            const salidaProductos = rows.map(salidaProductoDB => {
                const salidaProducto = new SalidaProducto();
                salidaProducto.setIdSalidaProducto(salidaProductoDB.idSalidaProducto);
                salidaProducto.setIdProducto(salidaProductoDB.idProducto);
                salidaProducto.setIdSalida(salidaProductoDB.idSalida);
                salidaProducto.setCantidadAnterior(salidaProductoDB.cantidadAnterior);
                salidaProducto.setCantidadSaliendo(salidaProductoDB.cantidadSaliendo);
                salidaProducto.setCantidadNueva(salidaProductoDB.cantidadNueva);
                salidaProducto.setEstado(salidaProductoDB.estado);
                return salidaProducto;
            });

            // Consulta para contar total de salidas de productos
            let countQuery = `SELECT COUNT(*) AS total FROM ${this.#table} SP`;
            if (estado !== null) {
                countQuery += ` WHERE SP.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio (sin espacios en blanco)
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(SP.ID_PRODUCTO)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            const [countResult] = await connection.query(countQuery);

            // Verificar que countResult tenga resultados
            const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar las salidas de productos y los datos de paginación
            return {
                salidaProductos,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar salidas de productos:', error);
            return {
                success: false,
                message: 'Error al listar salidas de productos: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = SalidaProductoDB;