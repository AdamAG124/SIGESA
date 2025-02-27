const EntidadFinancieraService = require('../services/EntidadFinancieraService');

class EntidadFinancieraController{

    #entidadFinancieraService;

    constructor() {
        this.#entidadFinancieraService = new EntidadFinancieraService();
    }

    async listarEntidadesFinancieras(pageSize, currentPage, estadoEntidadFinanciera, valorBusqueda) {
        return await this.#entidadFinancieraService.listarEntidadesFinancieras(pageSize, currentPage, estadoEntidadFinanciera, valorBusqueda);
    }

    async insertarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraService.insertarEntidadFinanciera(entidadFinanciera);
    }

    async actualizarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraService.actualizarEntidadFinanciera(entidadFinanciera);
    }

    async eliminarEntidadFinanciera(entidadFinanciera) {
        return await this.#entidadFinancieraService.eliminarEntidadFinanciera(entidadFinanciera);
    }
}
// Exportar la clase
module.exports = EntidadFinancieraController;