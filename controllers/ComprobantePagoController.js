const ComprobanteDePago = require('../services/ComprobanteDePagoService');

class ComprobantePagoController{
    #comprobanteDePagoService;

    constructor(){
        this.#comprobanteDePagoService = new ComprobanteDePago();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado){
        return await this.#comprobanteDePagoService.obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado);
    }
}

module.exports = ComprobantePagoController;