const SalidaProductoService = require('../services/SalidaProductoService');

class SalidaProductoController {
    constructor() {
        this.salidaProductoService = new SalidaProductoService();
    }

    async obtenerSalidaProductos(idSalida) {
        return await this.salidaProductoService.obtenerSalidaProductos(idSalida);
    }
}

module.exports = SalidaProductoController;