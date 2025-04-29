const UnidadMedicionService = require('../services/UnidadMedicionService');

class UnidadMedicionController {

    #unidadMedicionService;

    constructor() {
        this.#unidadMedicionService = new UnidadMedicionService();
    }

    async listarUnidadesMedicion() {
        return await this.#unidadMedicionService.listarUnidadesMedicion();
    }

    async crearUnidadMedicion(unidadMedicion) {
        return await this.#unidadMedicionService.crearUnidadMedicion(unidadMedicion);
    }

    async editarUnidadMedicion(unidadMedicion) {
        return await this.#unidadMedicionService.editarUnidadMedicion(unidadMedicion);
    }
}

module.exports = UnidadMedicionController;