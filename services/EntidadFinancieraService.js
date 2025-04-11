const EntidadFinancieraDB = require('../database/EntidadFinancieraDB');

class EntidadFinancieraService {

    #entidadFinancieraDB;

    constructor() {
        this.#entidadFinancieraDB = new EntidadFinancieraDB();
    }

    async listarEntidadesFinancieras(pageSize, currentPage, estadoEntidadFinanciera, valorBusqueda) {
        return await this.#entidadFinancieraDB.listarEntidadesFinancieras(pageSize, currentPage, estadoEntidadFinanciera, valorBusqueda);
    }

    async insertarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraDB.insertarEntidadFinanciera(entidadFinanciera);
    }

    async actualizarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraDB.actualizarEntidadFinanciera(entidadFinanciera);
    }

    async eliminarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraDB.eliminarEntidadFinanciera(entidadFinanciera);
    }
}
// Exportar la clase
module.exports = EntidadFinancieraService;