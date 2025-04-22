const UnidadMedicionDB = require('../database/UnidadMedicionDB');

class UnidadMedicionService {
    #unidadMedicionDB;

    constructor() {
        this.#unidadMedicionDB = new UnidadMedicionDB();
    }

    async listarUnidadesMedicion() {
        return await this.#unidadMedicionDB.listarUnidadesMedicion();
    }

    async crearUnidadMedicion(unidadMedicion) {
        return await this.#unidadMedicionDB.crearUnidadMedicion(unidadMedicion);
    }
}

module.exports = UnidadMedicionService;