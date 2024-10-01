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
                        message: 'Contraseña incorrecta.',
                        view: 'login/login.html'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'Usuario no encontrado.',
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

}

// Exportar la clase
module.exports = UsuarioDB;
