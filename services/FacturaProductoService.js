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
        if (facturaProductoActual.getIdFactura().getIdComprobante().getIdComprobantePago() === 0){
            facturaProductoActual.getIdFactura().getIdComprobante().setIdComprobantePago(null);
        }
        return await this.#facturaProductoDB.actualizarFacturaYProductos(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto);
    }

    async agregarFacturaProducto(factura, nuevosFacturaProducto){
        if (factura.getIdComprobante().getIdComprobantePago() === 0){
            factura.getIdComprobante().setIdComprobantePago(null);
        }
        return await this.#facturaProductoDB.crearFacturaYProductos(factura, nuevosFacturaProducto);
    }
}

module.exports = FacturaProductoService;