const CuentaBancariaBD = require('../database/CuentaBancariaBD');

class CuentaBancariaService {

    #cuentaBancariaBD;

    constructor() {
        this.#cuentaBancariaBD = new CuentaBancariaBD();
    }

    async obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado) {
        if(estado === 2){
            estado = null;
        }
        return await this.#cuentaBancariaBD.obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado);
    }
}

module.exports = CuentaBancariaService;