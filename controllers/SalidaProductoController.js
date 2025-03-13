const SalidaProductoService = require('../services/SalidaProductoService');

class SalidaProductoController {
    #salidaProductoService;

    constructor() {
        this.#salidaProductoService = new SalidaProductoService();
    }

    async listarSalidaProductos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.#salidaProductoService.listarSalidaProductos(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = SalidaProductoController;