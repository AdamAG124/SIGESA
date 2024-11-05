const ConectarDB = require('./ConectarDB');
const Categoria = require('../domain/CategoriaProducto'); // Importamos la clase Categoria

class CategoriaProductoDB {
    #table;

    constructor() {
        this.#table = 'sigm_categoria_producto';
    }

    async listarCategorias(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = pageSize ? (currentPage - 1) * pageSize : 0;

            // Construir la consulta SQL principal
            let query = `
                SELECT 
                    C.ID_CATEGORIA_PRODUCTO AS idCategoriaProducto,
                    C.DSC_NOMBRE AS nombre,
                    C.DSC_DESCRIPCION AS descripcion,
                    C.ESTADO AS estado
                FROM 
                    ${this.#table} C
            `;

            // Definir la cláusula WHERE condicionalmente
            let whereClauses = [];

            // Añadir condición por estado si está definido
            if (estado !== undefined && estado !== null) {
                whereClauses.push(`C.ESTADO = ${estado}`);
            }

            // Añadir condición por valor de búsqueda si está definido
            if (valorBusqueda) { // Usamos valorBusqueda en lugar de valorBusqueda !== null
                whereClauses.push(`C.DSC_NOMBRE LIKE '${valorBusqueda}%'`);
            }

            // Añadir la cláusula WHERE si hay condiciones
            if (whereClauses.length > 0) {
                query += ` WHERE ${whereClauses.join(' AND ')}`;
            }

            // Añadir la cláusula de LIMIT y OFFSET si pageSize está definido
            if (pageSize) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Ejecutar la consulta SQL para obtener las categorías
            const [rows] = await connection.query(query);

            // Mapear los resultados a objetos de categorías
            const categorias = rows.map(categoriaDB => {
                const categoriaProducto = new Categoria();
                categoriaProducto.setIdCategoria(categoriaDB.idCategoriaProducto);
                categoriaProducto.setNombre(categoriaDB.nombre);
                categoriaProducto.setDescripcion(categoriaDB.descripcion);
                categoriaProducto.setEstado(categoriaDB.estado);
                return categoriaProducto;
            });

            // Obtener el total de categorías para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} C
            `;

            // Añadir las mismas condiciones al query de conteo
            if (whereClauses.length > 0) {
                countQuery += ` WHERE ${whereClauses.join(' AND ')}`;
            }

            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar las categorías y los datos de paginación
            return {
                categorias,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estado,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar categorías:', error.message);
            return {
                success: false,
                message: 'Error al listar categorías: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async crearCategoriaBD(categoria) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Categoria
            const nombre = categoria.getNombre();
            const descripcion = categoria.getDescripcion();
            const estado = categoria.getEstado();

            // Construimos la consulta SQL
            const query = `INSERT INTO ${this.#table} (DSC_NOMBRE, DSC_DESCRIPCION, ESTADO) VALUES (?, ?, ?)`;
            const params = [nombre, descripcion, estado];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Categoría creada exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se pudo crear la categoría.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear la categoría: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async actualizarCategoriaBD(categoria) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Categoria
            const idCategoria = categoria.getIdCategoria();
            const nombre = categoria.getNombre();
            const descripcion = categoria.getDescripcion();

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET DSC_NOMBRE = ?, DSC_DESCRIPCION = ? WHERE ID_CATEGORIA_PRODUCTO = ?`;
            const params = [nombre, descripcion, idCategoria];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Categoría actualizada exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró la categoría o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar la categoría: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async eliminarCategoriaBD(idCategoria) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar(); 1

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET estado = ? WHERE ID_CATEGORIA_PRODUCTO = ?`; // Cambiamos estado a 0 (inactivo)
            const params = [idCategoria.getEstado(), idCategoria.getIdCategoria()];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (idCategoria.getEstado() === 0) {
                    return {
                        success: true,
                        message: 'Categoría eliminado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Categoría reactivado exitosamente.'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'No se encontró la categoría o no se eliminó.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar la categoría: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }
}

// Exportar la clase
module.exports = CategoriaProductoDB;
