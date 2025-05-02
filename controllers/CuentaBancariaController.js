const CuentaBancariaService = require('../services/CuentaBancariaService');
const CuentaBancaria = require('../domain/CuentaBancaria');

class CuentaBancariaController{

    #cuentaBancariaService;

    constructor() {
        this.#cuentaBancariaService = new CuentaBancariaService();
    }

    async obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado) {
        try {
            const result = await this.#cuentaBancariaService.obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado);
            const cuentasBancarias = result.data.map(cuenta => ({
                idCuentaBancaria: cuenta.getIdCuentaBancaria(),
                idEntidadFinanciera: cuenta.getIdEntidadFinanciera().getIdEntidadFinanciera(),
                dscBanco: cuenta.getBanco(),
                numCuentaBancaria: cuenta.getNumero(),
                tipoDivisa: cuenta.getDivisa(),
                estado: cuenta.getEstado(),
                dscNombreEntidadFinanciera: cuenta.getIdEntidadFinanciera().getNombre()
            }));

           return  {
                cuentasBancarias: cuentasBancarias,
                paginacion: result.pagination
            };
        } catch (error) {
            console.error('Error al obtener cuentas bancarias:', error);
            throw error; // Propagar el error para que pueda ser manejado por el llamador
        }

    }

    async crearCuentaBancaria(cuentaBancariaData) {
        try {
            const cuentaBancaria = new CuentaBancaria()
            cuentaBancaria.getIdEntidadFinanciera().setIdEntidadFinanciera(cuentaBancariaData.entidadFinanciera);
            cuentaBancaria.setBanco(cuentaBancariaData.nombreBanco);
            cuentaBancaria.setNumero(cuentaBancariaData.numeroCuenta);
            cuentaBancaria.setDivisa(cuentaBancariaData.tipoDivisa);

            const result = await this.#cuentaBancariaService.crearCuentaBancaria(cuentaBancaria);
            return result;
        } catch (error) {
            console.error('Error al crear cuenta bancaria:', error);
            throw error; // Propagar el error para que pueda ser manejado por el llamador
        }
    }
}

module.exports = CuentaBancariaController;