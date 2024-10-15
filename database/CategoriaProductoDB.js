const ConectarDB = require('./ConectarDB');
const Categoria = require('../domain/Categoria'); // Importamos la clase Categoria

class CategoriaProductoDB {
    #table;

    constructor() {
        this.#table = 'categoriaproducto';
    }

    async obtenerCategorias() {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Consultar todas las categorías
            const [rows] = await connection.query(`
                SELECT 
                    id_categoria,
                    nombre,
                    descripcion,
                    estado
                FROM 
                    ${this.#table}
            `);

            // Crear un array para almacenar los objetos Categoria
            const categorias = rows.map(categoriaDB => {
                const categoria = new Categoria();

                // Setear la información en el objeto Categoria
                categoria.setIdCategoria(categoriaDB.id_categoria);
                categoria.setNombre(categoriaDB.nombre);
                categoria.setDescripcion(categoriaDB.descripcion);
                categoria.setEstado(categoriaDB.estado);

                return categoria;
            });

            return categorias; // Retornar solo el array de objetos Categoria

        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error.message);
            return []; // Retornar un array vacío en caso de error
        } finally {
            if (connection) {
                await connection.end(); // Asegúrate de cerrar la conexión
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
            const query = `INSERT INTO ${this.#table} (nombre, descripcion, estado) VALUES (?, ?, ?)`;
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
            const query = `UPDATE ${this.#table} SET nombre = ?, descripcion = ?, estado = ? WHERE id_categoria = ?`;
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
            connection = await db.conectar();

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET estado = 0 WHERE id_categoria = ?`; // Cambiamos estado a 0 (inactivo)
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
