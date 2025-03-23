const FacturaProductoService = require("../services/FacturaProductoService.js");

class FacturaProductoController {
    #facturaProductoService;

    constructor() {
        this.#facturaProductoService = new FacturaProductoService();
    }

    async obtenerFacturaProductos(idFactura) {
        return await this.#facturaProductoService.obtenerFacturaProductos(idFactura);
    }

    async editarFacturaProducto(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto){
        return await this.#facturaProductoService.editarFacturaProducto(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto);
    }

    async agregarFacturaProducto(factura, nuevosFacturaProducto){
        return await this.#facturaProductoService.agregarFacturaProducto(factura, nuevosFacturaProducto);
    }

}

module.exports = FacturaProductoController;