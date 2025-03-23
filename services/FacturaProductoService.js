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

}

module.exports = FacturaProductoService;