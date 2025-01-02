const ConectarDB = require('./ConectarDB');
const Proveedor = require('../domain/Proveedor'); // Importamos la clase Categoria

class ProveedorDB {
    #table;

    constructor() {
        this.#table = 'SIGM_PROVEEDOR';
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda) {
        const db = new ConectarDB();
        let connection;
        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Consultar todos los proveedores
            let query = `
                SELECT
                    P.ID_PROVEEDOR AS idProveedor,
                    P.DSC_NOMBRE AS nombre,
                    P.DSC_PROVINCIA AS provincia,
                    P.DSC_CANTON AS canton,
                    P.DSC_DISTRITO AS distrito,  
                    P.DSC_DIRECCION AS direccion, 
                    P.ESTADO AS estado
                FROM
                    ${this.#table} P
            `;

            let whereClauseAdded = false;

            if (estadoProveedor !== null) {
                query += ` WHERE P.ESTADO = ${estadoProveedor}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(P.DSC_NOMBRE)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Agregar el orden y la paginación
            query += ` ORDER BY P.ID_PROVEEDOR DESC`; // Ordenar por ID_PROVEEDOR de forma descendente

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const [rows] = await connection.query(query);

            const proveedores = rows.map(proveedorDB => {
                const proveedor = new Proveedor();
                proveedor.setIdProveedor(proveedorDB.idProveedor);
                proveedor.setNombre(proveedorDB.nombre);
                proveedor.setProvincia(proveedorDB.provincia);
                proveedor.setCanton(proveedorDB.canton);
                proveedor.setDistrito(proveedorDB.distrito);
                proveedor.setDireccion(proveedorDB.direccion);
                proveedor.setEstado(proveedorDB.estado);
                return proveedor;
            });

            // Consulta para contar total de proveedores
            let countQuery = `SELECT COUNT(*) AS total FROM ${this.#table} P`;
            if (estadoProveedor !== null) {
                countQuery += ` WHERE P.ESTADO = ${estadoProveedor}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                // Asegúrate de que el valor de búsqueda también esté limpio (sin espacios en blanco)
                const trimmedValorBusqueda = valorBusqueda.trim();
                const likeCondition = ` LOWER(TRIM(P.DSC_NOMBRE)) LIKE LOWER('%${trimmedValorBusqueda}%') `;
                
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            const [countResult] = await connection.query(countQuery);

            // Verificar que countResult tenga resultados
            const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los proveedores y los datos de paginación
            return {
                proveedores,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoProveedor,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar proveedores:', error);
            return {
                success: false,
                message: 'Error al listar proveedores: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }


    async insertarProveedor(proveedor) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const nombre = proveedor.getNombre();

            // Verificar si el proveedor ya existe
            const existingQuery = `
                SELECT 
                    DSC_NOMBRE 
                FROM ${this.#table} 
                WHERE DSC_NOMBRE = ?
            `;
            const [existingRows] = await connection.query(existingQuery, [nombre]);

            // Comprobar si se encontró alguna coincidencia
            if (existingRows.length > 0) {
                const duplicateMessages = [];

                // Verificar cada campo para determinar qué dato se repite
                if (existingRows.some(row => row.DSC_NOMBRE === nombre)) {
                    duplicateMessages.push(`El proveedor ${nombre} ya existe.`);
                }

                return {
                    success: false,
                    message: duplicateMessages.join(' ')
                };
            }

            // Crear la consulta SQL para insertar el nuevo proveedor
            const insertQuery = `
            INSERT INTO ${this.#table}
             (DSC_NOMBRE, DSC_PROVINCIA, DSC_CANTON, DSC_DISTRITO, DSC_DIRECCION, ESTADO)
            VALUES (?, ?, ?, ?, ?, ?)
            `;

            // Crear los parámetros de la consulta usando los valores obtenidos
            const params = [
                proveedor.getNombre(),
                proveedor.getProvincia(),
                proveedor.getCanton(),
                proveedor.getDistrito(),
                proveedor.getDireccion(),
                proveedor.getEstado(),
            ];

            // Ejecutar la consulta SQL para insertar el proveedor
            const [result] = await connection.query(insertQuery, params);

            // Verificar si se ha insertado un registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Proveedor insertado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se pudo insertar el proveedor.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al insertar el proveedor: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }


    async actualizarProveedor(proveedor) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Usar los getters del objeto Proveedor para obtener los datos
            const idProveedor = proveedor.getIdProveedor();
            const nombre = proveedor.getNombre();
            const provincia = proveedor.getProvincia();
            const canton = proveedor.getCanton();
            const distrito = proveedor.getDistrito();
            const direccion = proveedor.getDireccion();
            const estado = proveedor.getEstado();

            // Crear la consulta SQL para actualizar los campos del proveedor
            const query = `
                UPDATE ${this.#table}
                SET 
                    DSC_NOMBRE = ?, 
                    DSC_PROVINCIA = ?, 
                    DSC_CANTON = ?, 
                    DSC_DISTRITO = ?, 
                    DSC_DIRECCION = ?, 
                    ESTADO = ? 
                WHERE 
                    ID_PROVEEDOR = ?
            `;

            // Crear los parámetros de la consulta usando los valores obtenidos
            const params = [
                nombre,
                provincia,
                canton,
                distrito,
                direccion,
                estado,
                idProveedor
            ];

            // Verificar si el proveedor ya existe
            const existingQuery = `
                SELECT 
                    DSC_NOMBRE 
                FROM ${this.#table} 
                WHERE
                    DSC_NOMBRE = ? AND ID_PROVEEDOR <> ?
                `;
            const [existingRows] = await connection.query(existingQuery, [nombre, idProveedor]);

            // Comprobar si se encontró alguna coincidencia
            if (existingRows.length > 0) {
                const duplicateMessages = [];

                // Verificar si se encontró alguna coincidencia
                if (existingRows.some(row => row.DSC_NOMBRE === nombre)) {
                    duplicateMessages.push(`El proveedor ya existe, digite un nombre distinto a: ${nombre}.`);
                }

                return {
                    success: false,
                    message: duplicateMessages.join(' ')
                };
            }


            // Ejecutar la consulta SQL
            const [result] = await connection.query(query, params);

            // Verificar si se ha actualizado algún registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Proveedor actualizado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el proveedor o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el proveedor: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }

    async eliminarProveedor(proveedor) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Colaborador
            const idProveedor = proveedor.getIdProveedor();
            const estadoProveedor = proveedor.getEstado();

            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET ESTADO = ? WHERE ID_PROVEEDOR = ?`;
            let params = [estadoProveedor, idProveedor];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (estadoProveedor === 0) {
                    return {
                        success: true,
                        message: 'Proveedor eliminado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Proveedor reactivado exitosamente.'
                    };
                }

            } else {
                return {
                    success: false,
                    message: 'No se encontró el proveedor o no se modificó su estado.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al modificar el estado del proveedor: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }
}

// Exportar la clase
module.exports = ProveedorDB;