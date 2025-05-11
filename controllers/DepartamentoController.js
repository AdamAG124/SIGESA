const DepartamentoService = require("../services/DepartamentoService");

class DepartamentoController {

    #departamentoService;

    constructor() {
        this.#departamentoService = new DepartamentoService();
    }

    async listarDepartamentos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.#departamentoService.obtenerDepartamentos(pageSize, currentPage, estado, valorBusqueda);
    }
      async insertarDepartamento(departamento) {
        return await this.#departamentoService.crearDepartamento(departamento);
    }

    async editarDepartamento(departamento) {
        return await this.#departamentoService.actualizarDepartamento(departamento);
    }

    async eliminarDepartamento(departamento) {
        return await this.#departamentoService.eliminarDepartamento(departamento);
    }

}

module.exports = DepartamentoController;