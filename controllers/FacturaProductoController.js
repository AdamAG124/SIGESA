const FacturaProductoService = require("../services/FacturaProductoService.js");

class FacturaProductoController {
    #facturaProductoService;

    constructor() {
        this.#facturaProductoService = new FacturaProductoService();
    }

    async obtenerFacturaProductos(idFactura) {
        return await this.#facturaProductoService.obtenerFacturaProductos(idFactura);
    }

}

module.exports = FacturaProductoController;