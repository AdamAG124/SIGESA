const UnidadMedicionDB = require('../database/UnidadMedicionDB');

class UnidadMedicionService {
    #unidadMedicionDB;

    constructor() {
        this.#unidadMedicionDB = new UnidadMedicionDB();
    }

    async listarUnidadesMedicion() {
        return await this.#unidadMedicionDB.listarUnidadesMedicion();
    }
}

module.exports = UnidadMedicionService;