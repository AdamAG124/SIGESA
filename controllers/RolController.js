const RolService = require('../services/RolService');

class RolController{

    #rolService;

    constructor() {
        this.#rolService = new RolService();
    }

    async getRoles() {
        return await this.#rolService.obtenerRolesPorUsuario();
    }

}

module.exports = RolController;