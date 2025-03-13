const FacturaBD = require('../database/FacturaBD.js');

class FacturaService{
    #facturaBd;

    constructor(facturaBd){
        this.#facturaBd = new FacturaBD();;
    }

    async listarFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue){
        return await this.#facturaBd.obtenerFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue);
    }
}

module.exports = FacturaService;