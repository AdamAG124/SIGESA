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

            return await this.#cuentaBancariaService.crearCuentaBancaria(cuentaBancaria);
        } catch (error) {
            console.error('Error al crear cuenta bancaria:', error);
            throw error; // Propagar el error para que pueda ser manejado por el llamador
        }
    }

    async actualizarCuentaBancaria(cuentaBancariaData) {
        try {
            const cuentaBancaria = new CuentaBancaria()
            cuentaBancaria.setIdCuentaBancaria(cuentaBancariaData.idCuentaBancaria);
            cuentaBancaria.getIdEntidadFinanciera().setIdEntidadFinanciera(cuentaBancariaData.entidadFinanciera);
            cuentaBancaria.setBanco(cuentaBancariaData.nombreBanco);
            cuentaBancaria.setNumero(cuentaBancariaData.numeroCuenta);
            cuentaBancaria.setDivisa(cuentaBancariaData.tipoDivisa);

            return await this.#cuentaBancariaService.actualizarCuentaBancaria(cuentaBancaria);
        } catch (error) {
            console.error('Error al actualizar cuenta bancaria:', error);
            throw error; // Propagar el error para que pueda ser manejado por el llamador
        }
    }

    async eliminarCuentaBancaria(idCuentaBancaria, estado) {
        try {
            return await this.#cuentaBancariaService.eliminarCuentaBancaria(idCuentaBancaria, estado);
        } catch (error) {
            console.error('Error al eliminar cuenta bancaria:', error);
            throw error; // Propagar el error para que pueda ser manejado por el llamador
        }
    }
}

module.exports = CuentaBancariaController;