const SalidaProductoService = require('../services/SalidaProductoService');

class SalidaProductoController {
    constructor() {
        this.salidaProductoService = new SalidaProductoService();
    }

    async obtenerSalidaProductos(idSalida) {
        console.log("Obteniendo productos para la salida con ID:", idSalida); // Depuración inicial
        const productos = await this.salidaProductoService.obtenerSalidaProductos(idSalida);
        console.log("Productos obtenidos en el controlador:", productos); // Verificar los datos obtenidos
        return productos;
    }
    async crearSalidaProducto(nuevosSalidaProducto, salidaData) {
        return await this.salidaProductoService.crearSalidaProducto(nuevosSalidaProducto, salidaData);
    }
}

module.exports = SalidaProductoController;