const FacturaProductoDB = require('../database/FacturaProductoDB');

class FacturaProductoService{
    #facturaProductoDB;

    constructor(){
        this.#facturaProductoDB = new FacturaProductoDB();
    }

    async obtenerFacturaProductos(idFactura){
        return await this.#facturaProductoDB.obtenerProductosPorFactura(idFactura);
    }

    async editarFacturaProducto(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto){
        return await this.#facturaProductoDB.actualizarFacturaYProductos(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto);
    }

    async agregarFacturaProducto(factura, nuevosFacturaProducto){
        return await this.#facturaProductoDB.crearFacturaYProductos(factura, nuevosFacturaProducto);
    }
}

module.exports = FacturaProductoService;