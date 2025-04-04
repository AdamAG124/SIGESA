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

}
// Exportar la clase
module.exports = EntidadFinancieraDB;
