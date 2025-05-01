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

    async eliminarUnidadMedicion(id) {
        return await this.#unidadMedicionDB.eliminarUnidadMedicion(id);
    }

    async rehabilitarUnidadMedicion(unidadMedicion) {
        return await this.#unidadMedicionDB.rehabilitarUnidadMedicion(unidadMedicion);
    }
}

module.exports = UnidadMedicionService;