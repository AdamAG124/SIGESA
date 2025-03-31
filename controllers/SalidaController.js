const SalidaService = require('../services/SalidaService');

class SalidaController {
    constructor() {
        this.salidaService = new SalidaService();
    }

    async listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario) {
        console.log("Llamando al servicio para listar salidas..."); // Depuración inicial
        const resultado = await this.salidaService.listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario);
        console.log("Resultado obtenido en el controlador:", resultado); // Verificar los datos obtenidos
        return resultado;
    }
    
    async crearSalidaConProductos(salida, productos) {
        console.log("Creando una nueva salida y asociando productos..."); // Depuración inicial
    
        // Crear la salida y obtener su ID
        const idSalida = await this.salidaService.crearSalida(salida);
        console.log("ID de la salida creada:", idSalida);
    
        // Asociar los productos a la salida
        for (const producto of productos) {
            producto.setIdSalida(idSalida); // Asignar el ID de la salida al producto
            await this.salidaService.crearSalidaProducto(producto);
        }
    
        return { success: true, message: "Salida y productos creados exitosamente.", idSalida };
    }
}

module.exports = SalidaController;