const ConectarDB = require('./ConectarDB');
const Colaborador = require('../domain/Colaborador');

class ColaboradorDB {
    #table;

    constructor() {
        this.#table = 'SIGM_COLABORADOR';
    }

    // Método para recuperar la lista de colaboradores con sus departamentos y puestos
    async listarColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta SQL principal
            let query = `
                SELECT 
                    C.ID_COLABORADOR AS idColaborador, C.ID_DEPARTAMENTO AS idDepartamento,
                    C.ID_PUESTO AS idPuesto, C.DSC_SEGUNDO_APELLIDO AS segundoApellido,
                    C.FEC_NACIMIENTO AS fechaNacimiento, C.NUM_TELEFONO AS numTelefono,
                    C.FEC_INGRESO AS fechaIngreso, C.FEC_SALIDA AS fechaSalida, C.ESTADO AS estado,
                    C.DSC_CORREO AS correo, C.DSC_CEDULA AS cedula, C.DSC_NOMBRE AS nombreColaborador,
                    C.DSC_PRIMER_APELLIDO AS primerApellido,
                    D.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamento,
                    P.DSC_NOMBRE AS nombrePuesto
                FROM 
                    ${this.#table} C
                INNER JOIN 
                    SIGM_DEPARTAMENTO D ON C.ID_DEPARTAMENTO = D.ID_DEPARTAMENTO
                INNER JOIN 
                    SIGM_PUESTO_TRABAJO P ON C.ID_PUESTO = P.ID_PUESTO_TRABAJO
            `;

            // Variable para verificar si ya se ha añadido una condición
            let whereClauseAdded = false;

            // Añadir condiciones según los filtros
            if (estadoColaborador !== null) {
                query += ` WHERE C.ESTADO = ${estadoColaborador}`;
                whereClauseAdded = true;
            }

            if (idPuestoFiltro !== null) {
                query += whereClauseAdded ? ` AND C.ID_PUESTO = ${idPuestoFiltro}` : ` WHERE C.ID_PUESTO = ${idPuestoFiltro}`;
                whereClauseAdded = true;
            }

            if (idDepartamentoFiltro !== null) {
                query += whereClauseAdded ? ` AND C.ID_DEPARTAMENTO = ${idDepartamentoFiltro}` : ` WHERE C.ID_DEPARTAMENTO = ${idDepartamentoFiltro}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = `
                    (
                        C.DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                        C.DSC_PRIMER_APELLIDO LIKE '${valorBusqueda}%' OR
                        C.DSC_SEGUNDO_APELLIDO LIKE '${valorBusqueda}%'
                    )
                `;
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Añadir la cláusula de LIMIT y OFFSET solo si se solicita paginación
            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Ejecutar la consulta SQL para obtener los colaboradores
            const [rows] = await connection.query(query);

            // Crear un array para almacenar los objetos Colaborador
            const colaboradores = rows.map(colaboradorDB => {
                const colaborador = new Colaborador();

                colaborador.setIdColaborador(colaboradorDB.idColaborador);
                colaborador.setNombre(colaboradorDB.nombreColaborador);
                colaborador.setPrimerApellido(colaboradorDB.primerApellido);
                colaborador.setSegundoApellido(colaboradorDB.segundoApellido);
                colaborador.setFechaNacimiento(colaboradorDB.fechaNacimiento);
                colaborador.setNumTelefono(colaboradorDB.numTelefono);
                colaborador.setFechaIngreso(colaboradorDB.fechaIngreso);
                colaborador.setFechaSalida(colaboradorDB.fechaSalida);
                colaborador.setEstado(colaboradorDB.estado);
                colaborador.setCorreo(colaboradorDB.correo);
                colaborador.setCedula(colaboradorDB.cedula);
                colaborador.getIdDepartamento().setNombre(colaboradorDB.nombreDepartamento);
                colaborador.getIdPuesto().setNombre(colaboradorDB.nombrePuesto);

                return colaborador;
            });

            // Obtener el total de colaboradores para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} C
                INNER JOIN SIGM_DEPARTAMENTO D ON C.ID_DEPARTAMENTO = D.ID_DEPARTAMENTO
                INNER JOIN SIGM_PUESTO_TRABAJO P ON C.ID_PUESTO = P.ID_PUESTO_TRABAJO
            `;

            // Añadir las mismas condiciones de los filtros al query de conteo
            whereClauseAdded = false;
            if (estadoColaborador !== null) {
                countQuery += ` WHERE C.ESTADO = ${estadoColaborador}`;
                whereClauseAdded = true;
            }

            if (idPuestoFiltro !== null) {
                countQuery += whereClauseAdded ? ` AND C.ID_PUESTO = ${idPuestoFiltro}` : ` WHERE C.ID_PUESTO = ${idPuestoFiltro}`;
                whereClauseAdded = true;
            }

            if (idDepartamentoFiltro !== null) {
                countQuery += whereClauseAdded ? ` AND C.ID_DEPARTAMENTO = ${idDepartamentoFiltro}` : ` WHERE C.ID_DEPARTAMENTO = ${idDepartamentoFiltro}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = `
                    C.DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                    C.DSC_PRIMER_APELLIDO LIKE '${valorBusqueda}%'
                `;
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Ejecutar la consulta para contar el total de colaboradores
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los colaboradores y los datos de paginación
            return {
                colaboradores,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords, // Si no hay paginación, el tamaño de la página es el total
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoColaborador,
                    idPuesto: idPuestoFiltro,
                    idDepartamento: idDepartamentoFiltro,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar colaboradores:', error);
            return {
                success: false,
                message: 'Error al listar colaboradores: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }

    async insertarColaboradorBD(colaborador) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Usar los getters del objeto Colaborador para obtener los datos
            const cedula = colaborador.getCedula();
            const correo = colaborador.getCorreo();
            const numTelefono = colaborador.getNumTelefono();

            // Verificar si el colaborador ya existe
            const existingQuery = `
                SELECT 
                    DSC_CEDULA, DSC_CORREO, NUM_TELEFONO 
                FROM ${this.#table} 
                WHERE DSC_CEDULA = ? OR DSC_CORREO = ? OR NUM_TELEFONO = ?
            `;
            const [existingRows] = await connection.query(existingQuery, [cedula, correo, numTelefono]);

            // Comprobar si se encontró alguna coincidencia
            if (existingRows.length > 0) {
                const duplicateMessages = [];

                // Verificar cada campo para determinar qué dato se repite
                if (existingRows.some(row => row.DSC_CEDULA === cedula)) {
                    duplicateMessages.push(`La cédula ${cedula} ya existe.`);
                }
                if (existingRows.some(row => row.DSC_CORREO === correo)) {
                    duplicateMessages.push(`El correo ${correo} ya existe.`);
                }
                if (existingRows.some(row => row.NUM_TELEFONO === numTelefono)) {
                    duplicateMessages.push(`El número de teléfono ${numTelefono} ya existe.`);
                }

                return {
                    success: false,
                    message: duplicateMessages.join(' ')
                };
            }

            // Crear la consulta SQL para insertar el nuevo colaborador
            const insertQuery = `
                INSERT INTO ${this.#table} 
                (ID_DEPARTAMENTO, ID_PUESTO, DSC_SEGUNDO_APELLIDO, FEC_NACIMIENTO, NUM_TELEFONO, FEC_SALIDA, ESTADO, DSC_CORREO, DSC_CEDULA, DSC_NOMBRE, DSC_PRIMER_APELLIDO) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Crear los parámetros de la consulta usando los valores obtenidos
            const params = [
                colaborador.getIdDepartamento().getIdDepartamento(),
                colaborador.getIdPuesto().getIdPuestoTrabajo(),
                colaborador.getSegundoApellido(),
                colaborador.getFechaNacimiento(),
                numTelefono,
                colaborador.getFechaSalida(),
                colaborador.getEstado(),
                correo,
                cedula,
                colaborador.getNombre(),
                colaborador.getPrimerApellido()
            ];

            // Ejecutar la consulta SQL para insertar el colaborador
            const [result] = await connection.query(insertQuery, params);

            // Verificar si se ha insertado un registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Colaborador insertado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se pudo insertar el colaborador.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al insertar el colaborador: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }

    async editarColaboradorBD(colaborador) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Usar los getters del objeto Colaborador para obtener los datos
            const idColaborador = colaborador.getIdColaborador();
            const idDepartamento = colaborador.getIdDepartamento();
            const idPuesto = colaborador.getIdPuesto();
            const segundoApellido = colaborador.getSegundoApellido();
            const fechaNacimiento = colaborador.getFechaNacimiento();
            const numTelefono = colaborador.getNumTelefono();
            const fechaIngreso = colaborador.getFechaIngreso();
            const fechaSalida = colaborador.getFechaSalida();
            const estado = colaborador.getEstado();
            const correo = colaborador.getCorreo();
            const cedula = colaborador.getCedula();
            const nombre = colaborador.getNombre();
            const primerApellido = colaborador.getPrimerApellido();

            // Crear la consulta SQL para actualizar los campos del colaborador
            const query = `
                UPDATE ${this.#table} 
                SET 
                    ID_DEPARTAMENTO = ?,
                    ID_PUESTO = ?,
                    DSC_SEGUNDO_APELLIDO = ?,
                    FEC_NACIMIENTO = ?,
                    NUM_TELEFONO = ?,
                    FEC_INGRESO = ?,
                    FEC_SALIDA = ?,
                    ESTADO = ?,
                    DSC_CORREO = ?,
                    DSC_CEDULA = ?,
                    DSC_NOMBRE = ?,
                    DSC_PRIMER_APELLIDO = ?
                WHERE ID_COLABORADOR = ?
            `;

            // Crear los parámetros de la consulta usando los valores obtenidos
            const params = [
                idDepartamento,
                idPuesto,
                segundoApellido,
                fechaNacimiento,
                numTelefono,
                fechaIngreso,
                fechaSalida,
                estado,
                correo,
                cedula,
                nombre,
                primerApellido,
                idColaborador
            ];

            // Ejecutar la consulta SQL
            const [result] = await connection.query(query, params);

            // Verificar si se ha actualizado algún registro
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Colaborador actualizado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el colaborador o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el colaborador: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión con la base de datos
            }
        }
    }

    async eliminarColaboradorBD(colaborador) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Colaborador
            const idColaborador = colaborador.getIdColaborador();
            const estadoColaborador = colaborador.getEstado();

            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET ESTADO = ? WHERE ID_COLABORADOR = ?`;
            let params = [estadoColaborador, idColaborador];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (estadoColaborador === 0) {
                    return {
                        success: true,
                        message: 'Colaborador eliminado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Colaborador reactivado exitosamente.'
                    };
                }

            } else {
                return {
                    success: false,
                    message: 'No se encontró el colaborador o no se modificó su estado.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al modificar el estado del colaborador: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

}

module.exports = ColaboradorDB;
