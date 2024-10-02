const RolesDB = require('../database/rolesDB');

class RolesService{

    #rolesDB;

    constructor(){
        this.rolesDB = new RolesDB();
    }

    async obtenerRolesPorUsuario(){
        return await this.rolesDB.listarRoles();
    }
}

// Exportar la clase
module.exports = RolesService;