const ComprobanteDePago = require('../services/ComprobanteDePagoService');

class ComprobantePagoController{
    #comprobanteDePagoService;

    constructor(){
        this.#comprobanteDePagoService = new ComprobanteDePago();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria){
        return await this.#comprobanteDePagoService.obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria);
    }
}

module.exports = ComprobantePagoController;