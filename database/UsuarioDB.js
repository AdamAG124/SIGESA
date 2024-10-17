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

            // Consultar si el usuario existe
            const [rows] = await connection.query(`
                SELECT 
                    U.ID_USUARIO, U,ID_COLABORADOR, U.DSC_NOMBRE AS nombreUsuario, U.ID_ROL,
                    U.DSC_PASSWORD, U.ESTADO AS estadoUsuario,
                    C.DSC_NOMBRE AS colaboradorNombre,
                    C.DSC_PRIMER_APELLIDO,
                    C.DSC_SEGUNDO_APELLIDO,
                    C.NUM_TELEFONO,
                    C.DSC_CORREO,
                    R.DSC_NOMBRE AS nombreRol
                FROM 
                    ${this.#table} U
                INNER JOIN
                    SIGM_COLABORADOR C ON U.ID_COLABORADOR = C.ID_COLABORADOR
                INNER JOIN
                    SIGM_ROL R ON U.ID_ROL = R.ID_ROL
                WHERE U.DSC_NOMBRE = ?`, [username]);

            if (rows.length > 0) {
                const usuarioDB = rows[0];
                const match = await bcrypt.compare(password, usuarioDB.password);

                if (match) {
                    // Crear objeto Usuario y setear la información
                    const usuario = new Usuario();

                    // Llenar el objeto Usuario
                    usuario.setIdUsuario(usuarioDB.idUsuario);
                    usuario.setNombreUsuario(usuarioDB.nombreUsuario);
                    usuario.getIdColaborador().setNombre(usuarioDB.nombreColaborador);
                    usuario.getIdColaborador().setPrimerApellido(usuarioDB.primerApellido);
                    usuario.getIdColaborador().setSegundoApellido(usuarioDB.segundoApellido);
                    usuario.getIdColaborador().setNumTelefono(usuarioDB.numTelefono);
                    usuario.getIdColaborador().setCorreo(usuarioDB.correo);
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

                    // Retornar todos los datos del usuario
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

    async obtenerUsuarios() {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Consultar todos los usuarios
            const [rows] = await connection.query(`
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
            `);

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

            return usuarios; // Retornar solo el array de objetos Usuario

        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error.message);
            return []; // Retornar un array vacío en caso de error
        } finally {
            if (connection) {
                await connection.end(); // Asegúrate de cerrar la conexión
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

            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET DSC_NOMBRE = ?, ID_ROL = ?`;
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
                return {
                    success: true,
                    message: 'Usuario eliminado exitosamente.'
                };
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

            // Construimos la consulta SQL dinámicamente
            let query = `INSERT INTO ${this.#table} (ID_COLABORADOR, DSC_NOMBRE, ID_ROL, DSC_PASSWORD, ESTADO) 
                         VALUES (${idColaborador}, '${nombreUsuario}', ${idRol}, '${hashedPassword}', 1)`;

            // Ejecutar la consulta
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
