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
    async registrarSalidaProducto(req, res) {
        try {
            const salidaProducto = req.body; // Suponiendo que los datos vienen en el cuerpo de la solicitud

            // Registrar la salida del producto
            const resultado = await this.salidaProductoService.registrarSalidaProducto(salidaProducto);

            res.status(200).json({
                success: true,
                message: 'Salida de producto registrada exitosamente.',
                data: resultado,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = SalidaProductoController;