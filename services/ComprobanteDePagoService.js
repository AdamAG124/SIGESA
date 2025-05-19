const ComprobantePagoDB = require('../database/ComprobantePagoDB');

class ComprobantePagoService {
    #comprobantePagoDB;

    constructor() {
        this.#comprobantePagoDB = new ComprobantePagoDB();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria){
        return await this.#comprobantePagoDB.listarComprobantesPago(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria);
    }

    async crearComprobantePago(comprobantePago){
        return await this.#comprobantePagoDB.crearComprobantePago(comprobantePago);
    }

    async actualizarComprobantePago(comprobantePago) {
        return await this.#comprobantePagoDB.actualizarComprobantePago(comprobantePago);
    }
}

module.exports = ComprobantePagoService;