const ConectarDB = require('./ConectarDB');
const Proveedor = require('../domain/Proveedor'); // Importamos la clase Categoria

class ProveedorDB {
    #table;

    constructor() {
        this.#table = 'sigm_proveedor';
    }

    async listarProvedores(pageSize, offset) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Consultar todas las categorías
            const [rows] = await connection.query(`
                SELECT
                 ID_PROVEEDOR AS idProveedor,
                 DSC_NOMBRE AS nombre,
                 DSC_PROVINCIA AS provincia,
                 DSC_CANTON AS canton,
                 DSC_DISTRITO AS distrito,  
                 DSC_DIRECCION AS direccion, 
                 ESTADO AS estado
                FROM
                    ${this.#table}
                WHERE
                    ESTADO = 1
                LIMIT ${pageSize} OFFSET ${offset}
            `);

            const proveedores = rows.map(proveedorDB => {
                const proveedor = new Proveedor();
                // Setear la información en el objeto Proveedor
                proveedor.setIdProveedor(proveedorDB.idProveedor);
                proveedor.setNombre(proveedorDB.nombre);
                proveedor.setProvincia(proveedorDB.provincia);
                proveedor.setCanton(proveedorDB.canton);
                proveedor.setDistrito(proveedorDB.distrito);
                proveedor.setDireccion(proveedorDB.direccion);
                proveedor.setEstado(proveedorDB.estado);

                return proveedor;
            });


            // Obtener el total de proveedores para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} 
            `;

            // Ejecutar la consulta para contar el total de colaboradores
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los proveedores y los datos de paginación
            return {
                proveedores,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords, // Si no hay paginación, el tamaño de la página es el total
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    lastPage: totalPages
                }
            };


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