const ConectarDB = require('./ConectarDB');
const bcrypt = require('bcrypt');
const Usuario = require('../domain/Usuario'); // Importamos la clase Usuario

class UsuarioDB {
    #table;

    constructor() {
        this.#table = 'SIGM_USUARIO';
    }

    async validarUsuario(username, password) {
        const db = new ConectarDB();
        let connection;
    
        try {
            connection = await db.conectar();
    
            // Consultar si el usuario existe, incluyendo datos adicionales del colaborador
            const [rows] = await connection.query(`
                SELECT 
                    U.ID_USUARIO, U.DSC_NOMBRE AS nombreUsuario, U.DSC_PASSWORD,
                    U.ESTADO AS estadoUsuario,
                    C.DSC_NOMBRE AS colaboradorNombre,
                    C.DSC_PRIMER_APELLIDO,
                    C.DSC_SEGUNDO_APELLIDO,
                    C.NUM_TELEFONO, 
                    C.DSC_CORREO,
                    C.DSC_CEDULA,  -- Número de cédula del colaborador
                    D.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamento,  -- Nombre del departamento
                    P.DSC_NOMBRE AS nombrePuesto,  -- Nombre del puesto de trabajo
                    R.DSC_NOMBRE AS nombreRol
                FROM 
                    ${this.#table} U
                INNER JOIN
                    SIGM_COLABORADOR C ON U.ID_COLABORADOR = C.ID_COLABORADOR
                INNER JOIN
                    SIGM_ROL R ON U.ID_ROL = R.ID_ROL
                LEFT JOIN
                    SIGM_DEPARTAMENTO D ON C.ID_DEPARTAMENTO = D.ID_DEPARTAMENTO
                LEFT JOIN
                    SIGM_PUESTO_TRABAJO P ON C.ID_PUESTO = P.ID_PUESTO_TRABAJO
                WHERE U.DSC_NOMBRE = ?`, [username]);
    
            if (rows.length > 0) {
                const usuarioDB = rows[0];
                const match = await bcrypt.compare(password, usuarioDB.DSC_PASSWORD);
    
                if (match) {
                    // Crear objeto Usuario y setear la información
                    const usuario = new Usuario();
    
                    // Llenar el objeto Usuario
                    usuario.setIdUsuario(usuarioDB.ID_USUARIO);
                    usuario.setNombreUsuario(usuarioDB.nombreUsuario);
                    usuario.getIdColaborador().setNombre(usuarioDB.colaboradorNombre);
                    usuario.getIdColaborador().setPrimerApellido(usuarioDB.DSC_PRIMER_APELLIDO);
                    usuario.getIdColaborador().setSegundoApellido(usuarioDB.DSC_SEGUNDO_APELLIDO);
                    usuario.getIdColaborador().setNumTelefono(usuarioDB.NUM_TELEFONO);
                    usuario.getIdColaborador().setCorreo(usuarioDB.DSC_CORREO);
                    usuario.getIdColaborador().setCedula(usuarioDB.DSC_CEDULA); // Setear la cédula
                    usuario.getIdColaborador().getIdDepartamento().setNombre(usuarioDB.nombreDepartamento || ''); // Setear el nombre del departamento
                    usuario.getIdColaborador().getIdPuesto().setNombre(usuarioDB.nombrePuesto || ''); // Setear el nombre del puesto
                    usuario.getRol().setNombre(usuarioDB.nombreRol);
                    usuario.setEstado(usuarioDB.estadoUsuario);
    
                    // Verificar si el usuario está inactivo
                    if (usuario.getEstado() == 0) {
                        return {
                            success: false,
                            message: 'Usuario inactivo.',
                            view: 'login/login.html'
                        };
                    }
    
                    // Retornar todos los datos del usuario, incluyendo la información adicional
                    return {
                        success: true,
                        message: 'Inicio de sesión exitoso.',
                        view: 'dashboard/dashboard.html',
                        usuario: {
                            idUsuario: usuario.getIdUsuario(),
                            nombreUsuario: usuario.getNombreUsuario(),
                            nombre: usuario.getIdColaborador().getNombre(),
                            primerApellido: usuario.getIdColaborador().getPrimerApellido(),
                            segundoApellido: usuario.getIdColaborador().getSegundoApellido(),
                            numTelefono: usuario.getIdColaborador().getNumTelefono(),
                            correo: usuario.getIdColaborador().getCorreo(),
                            cedula: usuario.getIdColaborador().getCedula(), // Número de cédula
                            nombreDepartamento: usuario.getIdColaborador().getIdDepartamento().getNombre(), // Nombre del departamento
                            nombrePuesto: usuario.getIdColaborador().getIdPuesto().getNombre(), // Nombre del puesto
                            roleName: usuario.getRol().getNombre(),
                            estado: usuario.getEstado(),
                        }
                    };
                } else {
                    return {
                        success: false,
                        message: 'Correo o contraseña incorrectos',
                        view: 'login/login.html'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Correo o contraseña incorrectos',
                    view: 'login/login.html'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error en la consulta a la base de datos: ' + error.message,
                view: 'login/login.html'
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegúrate de cerrar la conexión
            }
        }
    }

    async obtenerUsuarios(pageSize, currentPage, estadoUsuario, idRolFiltro, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta SQL principal con paginación y filtro de estado
            let query = `
                SELECT 
                    U.ID_USUARIO AS idUsuario,
                    U.DSC_NOMBRE AS nombreUsuario,
                    U.ID_ROL AS idRol,
                    C.ID_COLABORADOR AS idColaborador,
                    C.DSC_NOMBRE AS nombreColaborador,
                    C.DSC_PRIMER_APELLIDO AS primerApellido,
                    C.DSC_SEGUNDO_APELLIDO AS segundoApellido,
                    R.DSC_NOMBRE AS nombreRol,
                    U.ESTADO AS estadoUsuario
                FROM 
                    ${this.#table} U
                INNER JOIN
                    SIGM_COLABORADOR C ON U.ID_COLABORADOR = C.ID_COLABORADOR
                INNER JOIN
                    SIGM_ROL R ON U.ID_ROL = R.ID_ROL
            `;

            // Definir una variable para verificar si ya hemos agregado alguna condición
            let whereClauseAdded = false;

            // Añadir la condición de filtro por estado de usuario si es proporcionado
            if (estadoUsuario !== null) {
                query += ` WHERE U.ESTADO = ${estadoUsuario}`;
                whereClauseAdded = true;
            }

            // Filtro por rol
            if (idRolFiltro !== null) {
                query += whereClauseAdded ? ` AND U.ID_ROL = ${idRolFiltro}` : ` WHERE U.ID_ROL = ${idRolFiltro}`;
                whereClauseAdded = true;
            }

            // Filtro por valor de búsqueda
            if (valorBusqueda !== null) {
                const likeCondition = `
                (
                    U.DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                    C.DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                    C.DSC_PRIMER_APELLIDO LIKE '${valorBusqueda}%' OR
                    C.DSC_SEGUNDO_APELLIDO LIKE '${valorBusqueda}%'
                )
            `;
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Añadir la cláusula de LIMIT y OFFSET para la paginación
            query += ` LIMIT ${pageSize} OFFSET ${offset}`;

            // Ejecutar la consulta SQL para obtener los usuarios
            const [rows] = await connection.query(query);

            // Crear un array para almacenar los objetos Usuario
            const usuarios = rows.map(usuarioDB => {
                const usuario = new Usuario();

                // Setear la información en el objeto Usuario
                usuario.setIdUsuario(usuarioDB.idUsuario);
                usuario.setNombreUsuario(usuarioDB.nombreUsuario);
                usuario.getIdColaborador().setIdColaborador(usuarioDB.idColaborador);
                usuario.getIdColaborador().setNombre(usuarioDB.nombreColaborador);
                usuario.getIdColaborador().setPrimerApellido(usuarioDB.primerApellido);
                usuario.getIdColaborador().setSegundoApellido(usuarioDB.segundoApellido);
                usuario.getRol().setIdRol(usuarioDB.idRol);
                usuario.getRol().setNombre(usuarioDB.nombreRol);
                usuario.setEstado(usuarioDB.estadoUsuario);

                return usuario;
            });

            // Ahora obtenemos el total de usuarios para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} U
                INNER JOIN SIGM_COLABORADOR C ON U.ID_COLABORADOR = C.ID_COLABORADOR
                INNER JOIN SIGM_ROL R ON U.ID_ROL = R.ID_ROL
            `;

            // Añadir las mismas condiciones al query de conteo
            whereClauseAdded = false;
            if (estadoUsuario !== null) {
                countQuery += ` WHERE U.ESTADO = ${estadoUsuario}`;
                whereClauseAdded = true;
            }
            if (idRolFiltro !== null) {
                countQuery += whereClauseAdded ? ` AND U.ID_ROL = ${idRolFiltro}` : ` WHERE U.ID_ROL = ${idRolFiltro}`;
                whereClauseAdded = true;
            }
            if (valorBusqueda !== null) {
                const likeCondition = `C.DSC_NOMBRE LIKE '${valorBusqueda}%'`;
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Ejecutar la consulta para contar el total de usuarios
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalRecords / pageSize);

            // Retornar los usuarios y los datos de paginación
            return {
                usuarios,
                pagination: {
                    currentPage,
                    pageSize,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoUsuario,
                    idRol: idRolFiltro,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error.message);
            return {
                success: false,
                message: 'Error al obtener los usuarios: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }


    async actualizarUsuarioBD(usuario) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Usuario
            const idUsuario = usuario.getIdUsuario();
            const nombreUsuario = usuario.getNombreUsuario();
            const idRol = usuario.getRol().getIdRol();
            const password = usuario.getPassword();

            // Validar si el nombre de usuario ya existe
            let query = `SELECT COUNT(*) AS count FROM ${this.#table} WHERE DSC_NOMBRE = '${nombreUsuario}' AND ID_USUARIO != '${idUsuario}'`;
            const [rowsNombreUsuario] = await connection.query(query);

            if (rowsNombreUsuario[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso.'
                };
            }

            // Construimos la consulta SQL dinámicamente
            query = `UPDATE ${this.#table} SET DSC_NOMBRE = ?, ID_ROL = ?`;
            let params = [nombreUsuario, idRol];

            // Evaluar si el password no es vacío
            if (password && password.trim() !== '') {
                const hashedPassword = await bcrypt.hash(password, 10);
                query += `, DSC_PASSWORD = ?`;
                params.push(hashedPassword);
            }

            query += ` WHERE ID_USUARIO = ?`;
            params.push(idUsuario);

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Usuario actualizado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el usuario o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el usuario: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async eliminarUsuarioBD(usuario) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Usuario
            const idUsuario = usuario.getIdUsuario();
            const estado = usuario.getEstado();

            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET ESTADO = ? WHERE ID_USUARIO = ?`;
            let params = [estado, idUsuario];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (estado === 0) {
                    return {
                        success: true,
                        message: 'Usuario eliminado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Usuario reactivado exitosamente.'
                    };
                }

            } else {
                return {
                    success: false,
                    message: 'No se encontró el usuario o no se elimino el usuario.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el usuario: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async crearUsuarioBD(usuario) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Obtén los atributos del objeto Usuario
            const idColaborador = usuario.getIdColaborador().getIdColaborador();
            const nombreUsuario = usuario.getNombreUsuario();
            const idRol = usuario.getRol().getIdRol();
            const password = usuario.getPassword();
            const hashedPassword = await bcrypt.hash(password, 10);

            // Validar si el nombre de usuario ya existe
            let query = `SELECT COUNT(*) AS count FROM ${this.#table} WHERE DSC_NOMBRE = '${nombreUsuario}'`;
            const [rowsNombreUsuario] = await connection.query(query);

            if (rowsNombreUsuario[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso.'
                };
            }

            // Validar si el ID del colaborador ya existe
            query = `SELECT COUNT(*) AS count FROM ${this.#table} WHERE ID_COLABORADOR = ${idColaborador}`;
            const [rowsIdColaborador] = await connection.query(query);

            if (rowsIdColaborador[0].count > 0) {
                return {
                    success: false,
                    message: 'El colaborador ya tiene un usuario asociado.'
                };
            }

            // Construimos la consulta SQL para insertar el nuevo usuario
            query = `INSERT INTO ${this.#table} (ID_COLABORADOR, DSC_NOMBRE, ID_ROL, DSC_PASSWORD, ESTADO) 
                     VALUES (${idColaborador}, '${nombreUsuario}', ${idRol}, '${hashedPassword}', 1)`;

            // Ejecutar la consulta de inserción
            const [result] = await connection.query(query);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Usuario creado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el usuario o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el usuario: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

}

// Exportar la clase
module.exports = UsuarioDB;
