const SalidaProductoService = require('../services/SalidaProductoService');

class SalidaProductoController {
    constructor() {
        this.salidaProductoService = new SalidaProductoService();
    }

    async listarSalidasProductos(pageSize, currentPage, estado, valorBusqueda) {
        const resultado = await this.salidaProductoService.listarSalidasProductos(pageSize, currentPage, estado, valorBusqueda);
        console.log('Datos enviados al frontend:', resultado); // Verificar los datos
        return resultado;
    }
}

module.exports = SalidaProductoController;