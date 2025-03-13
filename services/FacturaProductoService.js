const FacturaProductoDB = require('../database/FacturaProductoDB');

class FacturaProductoService{
    #facturaProductoDB;

    constructor(){
        this.#facturaProductoDB = new FacturaProductoDB();
    }

    async obtenerFacturaProductos(idFactura){
        return await this.#facturaProductoDB.obtenerProductosPorFactura(idFactura);
    }

}

module.exports = FacturaProductoService;