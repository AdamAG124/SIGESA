const UnidadMedicionService = require('../services/UnidadMedicionService');

class UnidadMedicionController {

    #unidadMedicionService;

    constructor() {
        this.#unidadMedicionService = new UnidadMedicionService();
    }

    async listarUnidadesMedicion() {
        return await this.#unidadMedicionService.listarUnidadesMedicion();
    }
}

module.exports = UnidadMedicionController;