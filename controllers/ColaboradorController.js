const ColaboradorService = require('../services/ColaboradorService');

class ColaboradorController{

    #colaboradorService;

    constructor() {
        this.#colaboradorService = new ColaboradorService();
    }

    async getColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda) {
        return await this.#colaboradorService.obtenerColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);
    }

}

module.exports = ColaboradorController;