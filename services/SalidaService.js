const SalidaDB = require('../database/SalidaDB');

class SalidaService {
    constructor() {
        this.salidaDB = new SalidaDB();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario) {
        console.log("Llamando a la base de datos para listar salidas..."); // Depuración inicial
        const resultado = await this.salidaDB.listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario);
        console.log("Resultado obtenido en el servicio:", resultado); // Verificar los datos obtenidos
        return resultado;
    }
    async crearSalida(salida) {
        console.log("Llamando a la base de datos para crear una nueva salida...");
        const idSalida = await this.salidaDB.crearSalida(salida);
        console.log("ID de la salida creada en la base de datos:", idSalida);
        return idSalida;
    }
    
    async crearSalidaProducto(salidaProducto) {
        console.log("Llamando a la base de datos para asociar un producto a la salida...");
        await this.salidaProductoDB.registrarSalidaProducto(salidaProducto);
        console.log("Producto asociado a la salida exitosamente.");
    }
}

module.exports = SalidaService;