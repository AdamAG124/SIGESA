const Producto = require('./Producto'); // Importa la clase Producto
const Salida = require('./Salida'); // Importa la clase Salida

class SalidaProducto {
    // Atributos privados
    #idSalidaProducto;
    #idProducto; // Inicializado como objeto de Producto
    #idSalida; // Inicializado como objeto de Salida
    #cantidadAnterior;
    #cantidadSaliendo;
    #cantidadNueva;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idSalidaProducto = 0;                // Inicializado como 0
        this.#idProducto = new Producto();          // Inicializado como objeto de Producto
        this.#idSalida = new Salida();              // Inicializado como objeto de Salida
        this.#cantidadAnterior = 0.0;               // Inicializado como 0.0
        this.#cantidadSaliendo = 0.0;               // Inicializado como 0.0
        this.#cantidadNueva = 0.0;                  // Inicializado como 0.0
        this.#estado = false;                       // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdSalidaProducto() {
        return this.#idSalidaProducto;
    }

    setIdSalidaProducto(idSalidaProducto) {
        this.#idSalidaProducto = idSalidaProducto;
    }

    getIdProducto() {
        return this.#idProducto;
    }

    setIdProducto(idProducto) {
        this.#idProducto = idProducto;
    }

    getIdSalida() {
        return this.#idSalida;
    }

    setIdSalida(idSalida) {
        this.#idSalida = idSalida;
    }

    getCantidadAnterior() {
        return this.#cantidadAnterior;
    }

    setCantidadAnterior(cantidadAnterior) {
        this.#cantidadAnterior = cantidadAnterior;
    }

    getCantidadSaliendo() {
        return this.#cantidadSaliendo;
    }

    setCantidadSaliendo(cantidadSaliendo) {
        this.#cantidadSaliendo = cantidadSaliendo;
    }

    getCantidadNueva() {
        return this.#cantidadNueva;
    }

    setCantidadNueva(cantidadNueva) {
        this.#cantidadNueva = cantidadNueva;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = SalidaProducto;