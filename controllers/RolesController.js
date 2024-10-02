const RolesService = require('../services/RolesService');

class RolesController{

    #rolesService;

    constructor() {
        this.#rolesService = new RolesService();
    }

    async getRoles() {
        return await this.#rolesService.obtenerRolesPorUsuario();
    }

}

module.exports = RolesController;