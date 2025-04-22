const CuentaBancariaBD = require('../database/CuentaBancariaBD');

class CuentaBancariaService {

    #cuentaBancariaBD;

    constructor() {
        this.#cuentaBancariaBD = new CuentaBancariaBD();
    }

    async obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa) {
        return await this.#cuentaBancariaBD.obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa);
    }
}

module.exports = CuentaBancariaService;