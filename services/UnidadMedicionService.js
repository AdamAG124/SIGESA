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

    async editarUnidadMedicion(unidadMedicion) {
        return await this.#unidadMedicionDB.editarUnidadMedicion(unidadMedicion);
    }
}

module.exports = UnidadMedicionService;