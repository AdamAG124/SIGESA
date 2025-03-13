const FacturaBD = require('../database/FacturaBD.js');

class FacturaService{
    #facturaBd;

    constructor(facturaBd){
        this.#facturaBd = new FacturaBD();;
    }

    async listarFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue){
        if(idComprobantePago == 0){
            idComprobantePago = null;
        }
        if(idProveedor == 0){
            idProveedor = null;
        }
        if(fechaInicio == ""){
            fechaInicio = null;
        }
        if(fechaFin == ""){
            fechaFin = null;
        }
        if(estadoFactura == 2){
            estadoFactura = null;
        }
        return await this.#facturaBd.obtenerFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue);
    }
}

module.exports = FacturaService;