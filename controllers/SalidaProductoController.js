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

    async obtenerProductosPorSalida(idSalida) {
        try {
            // Llamar al método del servicio que obtiene los datos de la base de datos
            const salidasProductos = await this.salidaProductoService.obtenerProductosPorSalida(idSalida);

            // Transformar el array de objetos SalidaProducto en un array de JSON
            const resultado = salidasProductos.map(salidaProducto => {
                return {
                    idSalidaProducto: salidaProducto.getIdSalidaProducto(),
                    idSalida: salidaProducto.getIdSalida().getIdSalida(),
                    fechaSalida: salidaProducto.getIdSalida().getFechaSalida(),
                    estadoSalida: salidaProducto.getIdSalida().getEstado(),

                    // Colaborador Sacando
                    idColaboradorSacando: salidaProducto.getIdSalida().getColaboradorSacando().getIdColaborador(),
                    nombreColaboradorSacando: salidaProducto.getIdSalida().getColaboradorSacando().getNombre(),
                    primerApellidoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getPrimerApellido(),
                    segundoApellidoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getSegundoApellido(),
                    correoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getCorreo(),
                    numTelefonoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getNumTelefono(),
                    nombreDepartamentoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getIdDepartamento().getNombre(),
                    nombrePuestoSacando: salidaProducto.getIdSalida().getColaboradorSacando().getIdPuesto().getNombre(),

                    // Colaborador Recibiendo
                    idColaboradorRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getIdColaborador(),
                    nombreColaboradorRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getNombre(),
                    primerApellidoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getPrimerApellido(),
                    segundoApellidoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getSegundoApellido(),
                    correoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getCorreo(),
                    numTelefonoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getNumTelefono(),
                    nombreDepartamentoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getIdDepartamento().getNombre(),
                    nombrePuestoRecibiendo: salidaProducto.getIdSalida().getColaboradorRecibiendo().getIdPuesto().getNombre(),

                    // Usuario
                    idUsuario: salidaProducto.getIdSalida().getIdUsuario().getIdUsuario(),
                    nombreUsuario: salidaProducto.getIdSalida().getIdUsuario().getNombreUsuario(),

                    // Producto
                    idProducto: salidaProducto.getIdProducto().getIdProducto(),
                    nombreProducto: salidaProducto.getIdProducto().getNombre(),
                    unidadMedicion: salidaProducto.getIdProducto().getUnidadMedicion(),
                    cantidadTotalProducto: salidaProducto.getIdProducto().getCantidad(),
                    estadoProducto: salidaProducto.getIdProducto().getEstado(),

                    // Datos de SalidaProducto
                    cantidadAnterior: salidaProducto.getCantidadAnterior(),
                    cantidadSaliendo: salidaProducto.getCantidadSaliendo(),
                    cantidadNueva: salidaProducto.getCantidadNueva(),
                    estadoSalidaProducto: salidaProducto.getEstado()
                };
            });

            return resultado;

        } catch (error) {
            console.error('Error al procesar los productos de la salida:', error.message);
            throw new Error('Error al procesar los productos de la salida: ' + error.message);
        }
    }
}

module.exports = SalidaProductoController;