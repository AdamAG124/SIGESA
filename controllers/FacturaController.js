const FacturaService = require("../services/FacturaService.js");

class FacturaController{
    #facturaService;

    constructor(facturaService){
        this.#facturaService = new FacturaService();
    }

    async listarFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue){
        return await this.#facturaService.listarFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue);
    }
}

module.exports = FacturaController;