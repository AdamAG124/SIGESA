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

    }  async validarCantidadSaliendo(idProducto, cantidadSaliendo) {
        // Obtener la cantidad en stock del producto
        const producto = await this.productoDB.obtenerProductoPorId(idProducto);
        if (!producto) {
            throw new Error(`El producto con ID ${idProducto} no existe.`);
        }

        const cantidadEnStock = producto.cantidadEnStock;

        // Validar que la cantidad saliendo no exceda la cantidad en stock
        if (cantidadSaliendo > cantidadEnStock) {
            throw new Error(
                `La cantidad saliendo (${cantidadSaliendo}) excede la cantidad en stock (${cantidadEnStock}).`
            );
        }

        return true; // Validación exitosa
    }
    async registrarSalidaProducto(salidaProducto) {
        // Validar la cantidad antes de registrar la salida
        await this.validarCantidadSaliendo(
            salidaProducto.getIdProducto(),
            salidaProducto.getCantidadSaliendo()
        );

        // Registrar la salida en la base de datos
        return await this.salidaProductoDB.registrarSalidaProducto(salidaProducto);
    }

}

module.exports = SalidaProductoService;