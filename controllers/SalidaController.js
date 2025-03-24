const SalidaService = require('../services/SalidaService');

class SalidaController {
    constructor() {
        this.salidaService = new SalidaService();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda) {
        console.log("Llamando al servicio para listar salidas..."); // Depuración inicial
        const resultado = await this.salidaService.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
        console.log("Resultado obtenido en el controlador:", resultado); // Verificar los datos obtenidos
        return resultado;
    }
}

module.exports = SalidaController;