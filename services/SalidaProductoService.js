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
    async crearSalidaProducto(nuevosSalidaProducto, salidaData) {
        return await this.salidaProductoDB.crearSalidaProductoBD(nuevosSalidaProducto, salidaData);
    }

    async obtenerProductosPorSalida(idSalida) {
        return await this.salidaProductoDB.obtenerProductosPorSalida(idSalida);
    }

    async editarSalidaProducto(salidaProductoActual, nuevosSalidaProducto, actualizarSalidaProducto, eliminarSalidaProducto) {
        return await this.salidaProductoDB.editarSalidaProductoBD(salidaProductoActual, nuevosSalidaProducto, actualizarSalidaProducto, eliminarSalidaProducto);
    }
}

module.exports = SalidaProductoService;