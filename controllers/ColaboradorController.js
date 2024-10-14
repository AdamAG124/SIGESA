const ColaboradorService = require('../services/ColaboradorService');

class ColaboradorController{

    #colaboradorService;

    constructor() {
        this.#colaboradorService = new ColaboradorService();
    }

    async getColaboradores() {
        return await this.#colaboradorService.obtenerColaboradores();
    }

}

module.exports = ColaboradorController;