const ComprobantePagoDB = require('../database/ComprobantePagoDB');

class ComprobantePagoService {
    #comprobantePagoDB;

    constructor() {
        this.#comprobantePagoDB = new ComprobantePagoDB();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado){
        return await this.#comprobantePagoDB.listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado);
    }

    async actualizarComprobantePago(comprobantePago) {
        return await this.#comprobantePagoDB.actualizarComprobantePago(comprobantePago);
    }
}

module.exports = ComprobantePagoService;