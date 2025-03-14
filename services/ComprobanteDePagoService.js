const ComprobantePagoDB = require('../database/ComprobantePagoDB');

class ComprobantePagoService {
    #comprobantePagoDB;

    constructor() {
        this.#comprobantePagoDB = new ComprobantePagoDB();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado){
        return await this.#comprobantePagoDB.listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado);
    }
}

module.exports = ComprobantePagoService;