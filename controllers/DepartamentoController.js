const DepartamentoService = require("../services/DepartamentoService");

class DepartamentoController {

    #departamentoService;

    constructor() {
        this.#departamentoService = new DepartamentoService();
    }

    async listarDepartamentos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.#departamentoService.obtenerDepartamentos(pageSize, currentPage, estado, valorBusqueda);
    }

}

module.exports = DepartamentoController;