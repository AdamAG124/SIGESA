const ConectarDB = require('./ConectarDB');
const Producto = require('../domain/Producto');

class ProductoDB {
    #table;

    constructor() {
        this.#table = 'SIGM_PRODUCTO';
    }

    // Método para recuperar la lista de productos con sus categorías
    async listarProductos(pageSize = 10, currentPage = 1, estadoProducto = null, idCategoriaFiltro = null, valorBusqueda = null) {
        const db = new ConectarDB();
        let connection;
        // console.log('estado: ' + estadoProducto, idCategoriaFiltro, valorBusqueda);
        try {
            connection = await db.conectar();
        
            const offset = (currentPage - 1) * pageSize;

            // Base SQL query para listado y conteo
            const baseQuery = `
                FROM ${this.#table} P
                INNER JOIN SIGM_CATEGORIA_PRODUCTO C ON P.ID_CATEGORIA_PRODUCTO = C.ID_CATEGORIA_PRODUCTO
            `;

            // Inicializar condiciones del filtro
            let conditions = [];
            let params = [];

            // Agregar filtros a las condiciones
            if (estadoProducto !== null) {
                conditions.push('P.ESTADO = ?');
                params.push(estadoProducto);
            }

            if (idCategoriaFiltro !== null) {
                conditions.push('C.ID_CATEGORIA_PRODUCTO = ?');
                params.push(idCategoriaFiltro);
            }

            if (valorBusqueda !== null) {
                conditions.push(`
                    (
                        P.DSC_NOMBRE LIKE ? OR
                        P.DSC_PRODUCTO LIKE ? OR
                        P.NUM_CANTIDAD LIKE ?
                    )
                `);
                const searchParam = `%${valorBusqueda}%`;
                params.push(searchParam, searchParam, searchParam);
            }

            // Construir cláusula WHERE
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Inicializar limitOffsetClause para paginación
            let limitOffsetClause = '';
            if (pageSize) {
                limitOffsetClause = ' LIMIT ? OFFSET ?';
                params.push(pageSize, offset);
            }

            // Query principal con paginación
            const query = `
                SELECT 
                    P.ID_PRODUCTO AS idProducto, P.ID_CATEGORIA_PRODUCTO AS idCategoria,
                    P.DSC_NOMBRE AS nombreProducto, P.DSC_PRODUCTO AS descripcionProducto,
                    P.NUM_CANTIDAD AS cantidad, P.DSC_UNIDAD_MEDICION AS unidadMedicion,
                    P.ESTADO AS estadoProducto, C.DSC_NOMBRE AS nombreCategoria, 
                    C.DSC_DESCRIPCION AS descripcionCategoria, C.ESTADO AS estadoCategoria
                ${baseQuery}
                ${whereClause}
                ${limitOffsetClause}
            `;

            // Ejecutar consulta
            const [rows] = await connection.query(query, params);

            // Mapear resultados a objetos Producto
            const productos = rows.map(productoDB => {
                const producto = new Producto();
                producto.setIdProducto(productoDB.idProducto);
                producto.setNombre(productoDB.nombreProducto);
                producto.setDescripcion(productoDB.descripcionProducto);
                producto.setCantidad(productoDB.cantidad);
                producto.setUnidadMedicion(productoDB.unidadMedicion);
                producto.setEstado(productoDB.estadoProducto);

                // Setters para la categoría del producto
                producto.getCategoria().setIdCategoria(productoDB.idCategoria);
                producto.getCategoria().setNombre(productoDB.nombreCategoria);
                producto.getCategoria().setDescripcion(productoDB.descripcionCategoria);
                producto.getCategoria().setEstado(productoDB.estadoCategoria);

                return producto;
            });

            const countQuery = `SELECT COUNT(DISTINCT P.ID_PRODUCTO) as total ${baseQuery} ${whereClause}`;

            // Si se usó paginación, eliminamos los últimos dos parámetros (pageSize, offset)
            const paramsForCount = pageSize ? params.slice(0, -2) : params;
            const [countResult] = await connection.query(countQuery, paramsForCount);

            const totalRecords = countResult[0].total;
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            return {
                productos,
                pagination: {
                    currentPage,
                    pageSize,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoProducto,
                    idCategoria: idCategoriaFiltro,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar productos:', error);
            return {
                success: false,
                message: `Error al listar productos: ${error.message}`
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async eliminarProducto(producto) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar(); 1

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET estado = ? WHERE ID_PRODUCTO = ?`; // Cambiamos estado a 0 (inactivo)
            const params = [producto.getEstado(), producto.getIdProducto()];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (producto.getEstado() === 0) {
                    return {
                        success: true,
                        message: 'Producto desactivado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Producto reactivado exitosamente.'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'No se encontró el producto o no se desactivó.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el producto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }
}

module.exports = ProductoDB;
