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
                    E.DSC_TELEFONO_ENTIDAD_FINANCIERA AS telefono,
                    E.DSC_CORREO_ENTIDAD_FINANCIERA AS correo,
                    E.TIPO_ENTIDAD_FINANCIERA AS tipo,
                    E.FEC_INICIO_FINANCIAMIENTO AS fechaInicioFinanciamiento,
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
                entidadFinanciera.setTelefono(entidadFinancieraDB.telefono);
                entidadFinanciera.setCorreo(entidadFinancieraDB.correo);
                entidadFinanciera.setTipo(entidadFinancieraDB.tipo);
                entidadFinanciera.setFechaInicioFinanciamiento(entidadFinancieraDB.fechaInicioFinanciamiento);
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

    async insertarEntidadFinanciera(entidadFinanciera) {
        const db = new ConectarDB();
        let connection;
    
        try {
            connection = await db.conectar();
    
            const nombre = entidadFinanciera.getNombre();
    
            // Verificar si el proveedor ya existe
            const existingQuery = `
                SELECT 
                    DSC_NOMBRE_ENTIDAD_FINANCIERA
                FROM ${this.#table} 
                WHERE DSC_NOMBRE_ENTIDAD_FINANCIERA = ?
            `;
            const [existingRows] = await connection.query(existingQuery, [nombre]);
    
            // Comprobar si se encontró alguna coincidencia
            if (existingRows.length > 0) {
                const duplicateMessages = [];
    
                // Verificar cada campo para determinar qué dato se repite
                if (existingRows.some(row => row.DSC_NOMBRE_ENTIDAD_FINANCIERA === nombre)) {
                    duplicateMessages.push(`La entidad financiera ${nombre} ya existe.`);
                }
    
                return {
                    success: false,
                    message: duplicateMessages.join(' ')
                };
            }
    
            // Obtener los valores de los campos de la entidad financiera
            const telefono = entidadFinanciera.getTelefono();
            const correo = entidadFinanciera.getCorreo();
            const tipo = entidadFinanciera.getTipo();
            const fechaInicioFinanciamiento = entidadFinanciera.getFechaInicioFinanciamiento();
            const estado = entidadFinanciera.getEstado();
    
            // Reemplazar los campos vacíos o "N/A" por null antes de insertar en la base de datos
            const telefonoFinal = telefono && telefono.trim() !== "N/A" ? telefono : null;
            const correoFinal = correo && correo.trim() !== "N/A" ? correo : null;
            const tipoFinal = tipo && tipo.trim() !== "N/A" ? tipo : null;
    
            // Validar que tipo no sea null
            if (!tipoFinal) {
                return {
                    success: false,
                    message: 'El tipo de entidad financiera es obligatorio.'
                };
            }
    
            // Para la fecha, si está vacía o es "N/A", la convertimos a null
            const fechaInicioFinal = (fechaInicioFinanciamiento && fechaInicioFinanciamiento.trim() !== "N/A") ? fechaInicioFinanciamiento : null;
    
            // Crear la consulta SQL para insertar el nuevo proveedor
            const insertQuery = `
                INSERT INTO ${this.#table}
                 (DSC_NOMBRE_ENTIDAD_FINANCIERA, DSC_TELEFONO_ENTIDAD_FINANCIERA, DSC_CORREO_ENTIDAD_FINANCIERA, TIPO_ENTIDAD_FINANCIERA, FEC_INICIO_FINANCIAMIENTO, ESTADO)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
    
            // Crear los parámetros de la consulta usando los valores obtenidos
            const params = [
                nombre,
                telefonoFinal,  // Puede ser null
                correoFinal,    // Puede ser null
                tipoFinal,      // No puede ser null
                fechaInicioFinal, // Puede ser null
                estado,
            ];
    
            console.log("Consultando con parametros:", params);  // Verifica los parámetros
    
            // Ejecutar la consulta SQL para insertar el proveedor
            const [result] = await connection.query(insertQuery, params);
    
            // Verificar si se ha insertado un registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Entidad Financiera insertada exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se pudo insertar la entidad financiera.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al insertar la entidad financiera: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }

    async actualizarEntidadFinanciera(entidadFinanciera) {
        const db = new ConectarDB();
        let connection;
    
        try {
            connection = await db.conectar();
    
            // Obtener los valores directamente del objeto entidadFinanciera
            const idEntidadFinanciera = entidadFinanciera.getIdEntidadFinanciera();                                                                                                                                                                                                                                                                                      
            const nombre = entidadFinanciera.getNombre();
            const telefono = entidadFinanciera.getTelefono();
            const correo = entidadFinanciera.getCorreo();
            const tipo = entidadFinanciera.getTipo();
            const fechaInicioFinanciamiento = entidadFinanciera.getFechaInicioFinanciamiento();
            const estado = entidadFinanciera.getEstado();
    

            console.log("el correo es:", correo); // Verifica el valor del correo
            // Validar que los valores de los campos necesarios no estén vacíos o sean "N/A"
            if (!nombre) {
                return {
                    success: false,
                    message: 'El nombre de la entidad financiera es obligatorio.'
                };
            }
    
            // Crear la consulta SQL para actualizar los campos del proveedor
            const query = `
                UPDATE ${this.#table}
                SET 
                    DSC_NOMBRE_ENTIDAD_FINANCIERA = ?, 
                    DSC_TELEFONO_ENTIDAD_FINANCIERA = ?, 
                    DSC_CORREO_ENTIDAD_FINANCIERA = ?, 
                    TIPO_ENTIDAD_FINANCIERA = ?, 
                    FEC_INICIO_FINANCIAMIENTO = ?, 
                    ESTADO = ? 
                WHERE 
                    ID_ENTIDAD_FINANCIERA = ?
            `;
    
            // Parametros que se usarán en la consulta SQL
            const params = [
                nombre,
                telefono === "N/A" ? null : telefono,  // Si el teléfono es "N/A", lo dejamos como null
                correo === "N/A" ? null : correo,      // Si el correo es "N/A", lo dejamos como null
                tipo,
                fechaInicioFinanciamiento === "N/A" ? null : fechaInicioFinanciamiento,  // Si la fecha es "N/A", lo dejamos como null
                estado,
                idEntidadFinanciera
            ];
    
            // Verificar si el nombre de la entidad financiera ya existe en la base de datos
            const existingQuery = `
                SELECT 
                    DSC_NOMBRE_ENTIDAD_FINANCIERA 
                FROM ${this.#table} 
                WHERE
                    DSC_NOMBRE_ENTIDAD_FINANCIERA = ? AND ID_ENTIDAD_FINANCIERA <> ?
            `;
            const [existingRows] = await connection.query(existingQuery, [nombre, idEntidadFinanciera]);
    
            // Si ya existe una entidad financiera con ese nombre, devolver un error
            if (existingRows.length > 0) {
                return {
                    success: false,
                    message: `La entidad financiera ya existe con el nombre: ${nombre}.`
                };
            }
    
            // Ejecutar la consulta SQL
            const [result] = await connection.query(query, params);
    
            // Verificar si se ha actualizado algún registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Entidad financiera actualizada exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró la entidad financiera o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar la entidad financiera: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }

    async eliminarEntidadFinanciera(entidadFinanciera) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const idEntidadFinanciera = entidadFinanciera.getIdEntidadFinanciera();
            const estado = entidadFinanciera.getEstado();

            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET ESTADO = ? WHERE ID_ENTIDAD_FINANCIERA = ?`;
            let params = [estado, idEntidadFinanciera];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (estado === 0) {
                    return {
                        success: true,
                        message: 'Entidad Financiera eliminada exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Entidad Financiera reactivada exitosamente.'
                    };
                }

            } else {
                return {
                    success: false,
                    message: 'No se encontró la entidad financiera o no se modificó su estado.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al modificar el estado del la entidad financiera: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }
}
// Exportar la clase
module.exports = EntidadFinancieraDB;
