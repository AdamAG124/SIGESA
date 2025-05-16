const ComprobantePagoDB = require('../database/ComprobantePagoDB');

class ComprobantePagoService {
    #comprobantePagoDB;

    constructor() {
        this.#comprobantePagoDB = new ComprobantePagoDB();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria){
        return await this.#comprobantePagoDB.listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria);
    }
}

module.exports = ComprobantePagoService;