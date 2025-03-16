const SalidaProductoDB = require('../database/SalidaProductoDB');

class SalidaProductoService {
    constructor() {
        this.salidaProductoDB = new SalidaProductoDB();
    }

    async listarSalidasProductos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.salidaProductoDB.listarSalidasProductos(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = SalidaProductoService;