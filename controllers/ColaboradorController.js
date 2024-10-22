const ColaboradorService = require('../services/ColaboradorService');

class ColaboradorController{

    #colaboradorService;

    constructor() {
        this.#colaboradorService = new ColaboradorService();
    }

    async getColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda) {
        return await this.#colaboradorService.obtenerColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);
    }

    async insertarColaborador(colaborador){
        return await this.#colaboradorService.crearColaborador(colaborador);
    }

    async editarColaborador(colaborador) {
        return await this.#colaboradorService.actualizarColaborador(colaborador);
    }

    async eliminarColaborador(colaborador){
        return await this.#colaboradorService.eliminarColaborador(colaborador);
    }

}

module.exports = ColaboradorController;