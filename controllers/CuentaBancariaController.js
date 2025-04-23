const CuentaBancariaService = require('../services/CuentaBancariaService');

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
}

module.exports = CuentaBancariaController;