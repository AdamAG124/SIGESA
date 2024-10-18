const RolDB = require('../database/RolDB');

class RolService{

    #rolDB;

    constructor(){
        this.#rolDB = new RolDB();
    }

    async obtenerRolesPorUsuario(){
        return await this.#rolDB.listarRoles();
    }
}

// Exportar la clase
module.exports = RolService;