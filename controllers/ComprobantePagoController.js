const ComprobanteDePago = require('../services/ComprobanteDePagoService');
const ComprobantePago = require('../domain/ComprobantePago');

class ComprobantePagoController {
    #comprobanteDePagoService;

    constructor() {
        this.#comprobanteDePagoService = new ComprobanteDePago();
    }

    async obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria) {
        return await this.#comprobanteDePagoService.obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria);
    }

    async crearComprobantePagoController(datosFormulario) {
        try {
            // Crear una nueva instancia de ComprobantePago
            const comprobantePago = new ComprobantePago();

            // Asignar los valores del JSON al objeto ComprobantePago
            comprobantePago.getIdEntidadFinanciera().setIdEntidadFinanciera(datosFormulario.cuentaBancaria);
            comprobantePago.setFechaPago(datosFormulario.fechaPago);
            comprobantePago.setNumero(datosFormulario.numero);
            comprobantePago.setMonto(datosFormulario.montoComprobante);
            comprobantePago.setEstado(true); // Estado por defecto (activo)

            // Llamar al método del servicio para crear el comprobante
            const resultado = await this.#comprobanteDePagoService.crearComprobantePago(comprobantePago);

            // Retornar el resultado del servicio
            return resultado;

        } catch (error) {
            console.error("Error en el controlador al crear el comprobante de pago:", error.message);
            throw new Error("Error en el controlador al crear el comprobante de pago: " + error.message);
        }
    }
}

module.exports = ComprobantePagoController;