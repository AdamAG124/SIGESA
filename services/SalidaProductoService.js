const SalidaProductoDB = require('../database/SalidaProductoDB');

class SalidaProductoService {
    #salidaProductoDB;

    constructor() {
        this.#salidaProductoDB = new SalidaProductoDB();
    }

    async listarSalidaProductos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.#salidaProductoDB.listarSalidaProductos(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = SalidaProductoService;