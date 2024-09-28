const ConectarDB = require('./ConectarDB');
const bcrypt = require('bcrypt');

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
            const [rows] = await connection.query(`SELECT * FROM ${this.#table} WHERE nombreUsuario = ?`, [username]);

            if (rows.length > 0) {
                const usuario = rows[0];
                const match = await bcrypt.compare(password, usuario.password);

                return {
                    success: match,
                    message: match ? 'Inicio de sesión exitoso.' : 'Contraseña incorrecta.',
                    view: match ? 'dashboard.html' : 'login.html'
                };
            } else {
                return {
                    success: false,
                    message: 'Usuario no encontrado.',
                    view: 'login.html'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error en la consulta a la base de datos: ' + error.message,
                view: 'login.html'
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
