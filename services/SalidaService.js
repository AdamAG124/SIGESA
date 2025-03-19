const SalidaDB = require('../database/SalidaDB');

class SalidaService {
    constructor() {
        this.salidaDB = new SalidaDB();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda) {
        return await this.salidaDB.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = SalidaService;