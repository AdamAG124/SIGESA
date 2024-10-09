const ConectarDB = require('./ConectarDB');
const bcrypt = require('bcrypt');
const Usuario = require('../domain/Usuario'); // Importamos la clase Usuario

class UsuarioDB {
    #table;

    constructor() {
        this.#table = 'usuario';
    }

    async validarUsuario(username, password) {
        const db = new ConectarDB();
        let connection;
    
        try {
            connection = await db.conectar();
    
            // Consultar si el usuario existe
            const [rows] = await connection.query(`
                SELECT 
                    u.*,
                    c.nombre,
                    c.primerApellido,
                    c.segundoApellido,
                    c.numTelefono,
                    c.correo,
                    r.role_name
                FROM 
                    ${this.#table} u
                INNER JOIN
                    colaborador c ON u.idColaborador = c.id_colaborador
                INNER JOIN
                    roles r ON u.idRol = r.id_role
                WHERE nombreUsuario = ?`, [username]);
    
            if (rows.length > 0) {
                const usuarioDB = rows[0];
                const match = await bcrypt.compare(password, usuarioDB.password);
    
                if (match) {
                    // Crear objeto Usuario y setear la información
                    const usuario = new Usuario();
    
                    // Llenar el objeto Usuario
                    usuario.setIdUsuario(usuarioDB.idUsuario);
                    usuario.setNombreUsuario(usuarioDB.nombreUsuario);
                    usuario.getIdColaborador().setNombre(usuarioDB.nombre);
                    usuario.getIdColaborador().setPrimerApellido(usuarioDB.primerApellido);
                    usuario.getIdColaborador().setSegundoApellido(usuarioDB.segundoApellido);
                    usuario.getIdColaborador().setNumTelefono(usuarioDB.numTelefono);
                    usuario.getIdColaborador().setCorreo(usuarioDB.correo);
                    usuario.getRole().setRoleName(usuarioDB.role_name);
                    usuario.setEstado(usuarioDB.estado);
    
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
                            roleName: usuario.getRole().getRoleName(),
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
                    u.id_Usuario,
                    u.nombreUsuario,
                    u.idRol,
                    c.nombre,
                    c.primerApellido,
                    c.segundoApellido,
                    r.role_name,
                    u.estado
                FROM 
                    ${this.#table} u
                INNER JOIN
                    colaborador c ON u.idColaborador = c.id_colaborador
                INNER JOIN
                    roles r ON u.idRol = r.id_role
            `);
    
            // Crear un array para almacenar los objetos Usuario
            const usuarios = rows.map(usuarioDB => {
                const usuario = new Usuario();
    
                // Setear la información en el objeto Usuario
                usuario.setIdUsuario(usuarioDB.id_Usuario);
                usuario.setNombreUsuario(usuarioDB.nombreUsuario);
                usuario.getIdColaborador().setNombre(usuarioDB.nombre);
                usuario.getIdColaborador().setPrimerApellido(usuarioDB.primerApellido);
                usuario.getIdColaborador().setSegundoApellido(usuarioDB.segundoApellido);
                usuario.getRole().setIdRole(usuarioDB.idRol);
                usuario.getRole().setRoleName(usuarioDB.role_name);
                usuario.setEstado(usuarioDB.estado);
    
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
            const idRole = usuario.getRole().getIdRole();
            const password = usuario.getPassword();
            
            // Construimos la consulta SQL dinámicamente
            let query = `UPDATE ${this.#table} SET nombreUsuario = ?, idRol = ?`;
            let params = [nombreUsuario, idRole];

            // Evaluar si el password no es vacío
            if (password && password.trim() !== '') {
                const hashedPassword = await bcrypt.hash(password, 10);
                query += `, password = ?`;
                params.push(hashedPassword);
            }

            query += ` WHERE id_Usuario = ?`;
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

}

// Exportar la clase
module.exports = UsuarioDB;
