const ConectarDB = require('./ConectarDB');
const Categoria = require('../domain/CategoriaProducto'); // Importamos la clase Categoria

class CategoriaProductoDB {
    #table;

    constructor() {
        this.#table = 'sigm_categoria_producto';
    }

    async obtenerCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            let query = `
                SELECT 
                    ID_CATEGORIA_PRODUCTO,
                    DSC_NOMBRE,
                    DSC_DESCRIPCION,
                    ESTADO
                FROM 
                    ${this.#table}
                WHERE 1=1
            `;

            if (estadoCategoria !== null) {
                query += ` AND ESTADO = ${estadoCategoria}`;
            }

            if (valorBusqueda) {
                query += ` AND DSC_NOMBRE LIKE '%${valorBusqueda}%'`;
            }

            query += ` LIMIT ${pageSize} OFFSET ${(currentPage - 1) * pageSize}`;

            const [rows] = await connection.query(query);

            const categorias = rows.map(categoriaDB => {
                const categoria = new Categoria();
                categoria.setIdCategoria(categoriaDB.ID_CATEGORIA_PRODUCTO);
                categoria.setNombre(categoriaDB.DSC_NOMBRE);
                categoria.setDescripcion(categoriaDB.DSC_DESCRIPCION);
                categoria.setEstado(categoriaDB.ESTADO);
                return categoria;
            });

            return categorias;

        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error.message);
            return [];
        } finally {
            if (connection) {
                await connection.end();
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
            const estado = categoria.getEstado() || 1; // Asumimos estado 1 por defecto

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
            const estado = categoria.getEstado();

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET DSC_NOMBRE = ?, DSC_DESCRIPCION = ?, ESTADO = ? WHERE ID_CATEGORIA_PRODUCTO = ?`;
            const params = [nombre, descripcion, estado, idCategoria];

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
            connection = await db.conectar();1

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET estado = 0 WHERE ID_CATEGORIA_PRODUCTO = ?`; // Cambiamos estado a 0 (inactivo)
            const params = [idCategoria];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Categoría eliminada exitosamente.'
                };
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
