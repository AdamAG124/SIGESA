const ConectarDB = require('./ConectarDB');
const Rol = require('../domain/Rol');

class RolDB {
    #table;

    constructor() {
        this.#table = 'SIGM_ROL';
    }

    // Método para recuperar la lista de roles
    async listarRoles() {
        const db = new ConectarDB();
        const connection = await db.conectar();
        const roles = [];

        try {
            const [rows] = await connection.query(`SELECT ID_ROL AS idRol, DSC_NOMBRE AS nombreRol, DSC_ROL AS descripcion FROM ${this.#table}`);

            // Mapear cada fila a un objeto de tipo Roles
            rows.forEach(row => {
                const rol = new Rol();
                rol.setIdRol(row.idRol);
                rol.setNombre(row.nombreRol);
                rol.setDescripcion(row.descripcion);
                roles.push(rol);
            });

            return roles; // Retornar la lista de roles
        } catch (error) {
            console.error('Error al listar roles:', error);
            throw error; // Propagar el error
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }
}

module.exports = RolDB;
