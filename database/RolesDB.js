const ConectarDB = require('./ConectarDB');
const Roles = require('../domain/Roles');

class RolesDB {
    #table;

    constructor() {
        this.#table = 'roles';
    }

    // Método para recuperar la lista de roles
    async listarRoles() {
        const db = new ConectarDB();
        const connection = await db.conectar();
        const roles = [];

        try {
            const [rows] = await connection.query(`SELECT * FROM ${this.#table}`);

            // Mapear cada fila a un objeto de tipo Roles
            rows.forEach(row => {
                const rol = new Roles();
                rol.setIdRole(row.id_role);
                rol.setRoleName(row.role_name);
                rol.setRoleDescription(row.role_description);
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

module.exports = RolesDB;
