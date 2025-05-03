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
        if(tipoDivisa === "nula"){
            tipoDivisa = null;
        }
        return await this.#cuentaBancariaBD.obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado);
    }

    async crearCuentaBancaria(cuentaBancaria) {
        return await this.#cuentaBancariaBD.crearCuentaBancaria(cuentaBancaria);
    }
}

module.exports = CuentaBancariaService;