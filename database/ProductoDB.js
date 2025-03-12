const ConectarDB = require('./ConectarDB');
const Producto = require('../domain/Producto');

class ProductoDB {
    #table;

    constructor() {
        this.#table = 'SIGM_PRODUCTO';
    }

    // Método para recuperar la lista de productos con sus categorías
    async listarProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda) {
        const db = new ConectarDB();
        let connection;
    
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
    
            if (estadoProducto !== null) {
                conditions.push(`P.ESTADO = ?`);
                params.push(estadoProducto);
            }
    
            if (idCategoriaFiltro !== null) {
                conditions.push(`C.ID_CATEGORIA_PRODUCTO = ?`);
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
                const searchParam = `${valorBusqueda}%`;
                params.push(searchParam, searchParam, searchParam);
            }
    
            // Añadir las condiciones a los queries
            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
            
            // Query principal con paginación
            const query = `
                SELECT 
                    P.ID_PRODUCTO AS idProducto, P.ID_CATEGORIA_PRODUCTO AS idCategoria,
                    P.DSC_PRODUCTO AS descripcionProducto, P.NUM_CANTIDAD AS cantidad,
                    P.DSC_UNIDAD_MEDICION AS unidadMedicion, P.ESTADO AS estadoProducto,
                    C.DSC_NOMBRE AS nombreCategoria, C.DSC_DESCRIPCION AS descripcionCategoria,
                    C.ESTADO AS estadoCategoria
                ${baseQuery}
                ${whereClause}
                LIMIT ? OFFSET ?
            `;
            params.push(pageSize, offset);
    
            const [rows] = await connection.query(query, params);
    
            const productos = rows.map(productoDB => {
                const producto = new Producto();
                producto.setIdProducto(productoDB.idProducto);
                producto.setDescripcion(productoDB.descripcionProducto);
                producto.setCantidad(productoDB.cantidad);
                producto.setUnidadMedicion(productoDB.unidadMedicion);
                producto.setEstado(productoDB.estadoProducto);
                // Setters para categoría
                producto.getCategoria().setIdCategoria(productoDB.idCategoria);
                producto.getCategoria().setNombre(productoDB.nombreCategoria);
                producto.getCategoria().setDescripcion(productoDB.descripcionCategoria);
                producto.getCategoria().setEstado(productoDB.estadoCategoria);

                return producto;
            });
    
            // Query para conteo total con filtros aplicados
            const countQuery = `SELECT COUNT(DISTINCT P.ID_PRODUCTO) as total ${baseQuery} ${whereClause}`;
            const [countResult] = await connection.query(countQuery, params.slice(0, -2)); // Excluye LIMIT y OFFSET para el conteo
    
            const totalRecords = countResult[0].total;
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;
    
            return {
                productos,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
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
                message: 'Error al listar productos: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = ProductoDB;