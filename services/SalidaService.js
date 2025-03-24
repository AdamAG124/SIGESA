const SalidaDB = require('../database/SalidaDB');

class SalidaService {
    constructor() {
        this.salidaDB = new SalidaDB();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda) {
        console.log("Llamando a la base de datos para listar salidas..."); // Depuración inicial
        const resultado = await this.salidaDB.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
        console.log("Resultado obtenido en el servicio:", resultado); // Verificar los datos obtenidos
        return resultado;
    }
}

module.exports = SalidaService;