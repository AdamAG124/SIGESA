const SalidaService = require('../services/SalidaService');

class SalidaController {
    constructor() {
        this.salidaService = new SalidaService();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario) {
        const resultado = await this.salidaService.listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario);
        return resultado;
    }
}

module.exports = SalidaController;