const SalidaProductoDB = require('../database/SalidaProductoDB');

class SalidaProductoService {
    constructor() {
        this.salidaProductoDB = new SalidaProductoDB();
    }

    async obtenerSalidaProductos(idSalida) {
        return await this.salidaProductoDB.obtenerSalidaProductos(idSalida);
    }
}

module.exports = SalidaProductoService;