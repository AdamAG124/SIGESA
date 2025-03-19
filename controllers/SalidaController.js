const SalidaService = require('../services/SalidaService');

class SalidaController {
    constructor() {
        this.salidaService = new SalidaService();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda) {
        return await this.salidaService.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = SalidaController;