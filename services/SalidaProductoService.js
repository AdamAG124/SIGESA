const SalidaProductoDB = require('../database/SalidaProductoDB');

class SalidaProductoService {
    constructor() {
        this.salidaProductoDB = new SalidaProductoDB();
    }

    async obtenerSalidaProductos(idSalida) {
        console.log("Llamando a la base de datos para obtener productos de la salida con ID:", idSalida); // Depuración inicial
        const productos = await this.salidaProductoDB.obtenerProductosPorSalida(idSalida);
        console.log("Productos obtenidos en el servicio:", productos); // Verificar los datos obtenidos
        return productos;
    }
}

module.exports = SalidaProductoService;