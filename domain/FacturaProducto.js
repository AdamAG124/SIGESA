const Factura = require('./Factura'); // Importa la clase Factura
const Producto = require('./Producto'); // Importa la clase Producto
const Usuario = require('./Usuario'); // Importa la clase Usuario

class FacturaProducto {
    // Atributos privados
    #idFacturaProducto;
    #idFactura; // Inicializado como objeto de Factura
    #idProducto; // Inicializado como objeto de Producto
    #cantidadAnterior;
    #cantidadEntrando;
    #precioNuevo;
    #idUsuario; // Inicializado como objeto de Usuario
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idFacturaProducto = 0;                  // Inicializado como 0
        this.#idFactura = new Factura();               // Inicializado como objeto de Factura
        this.#idProducto = new Producto();             // Inicializado como objeto de Producto
        this.#cantidadAnterior = 0.0;                  // Inicializado como 0.0
        this.#cantidadEntrando = 0.0;                  // Inicializado como 0.0
        this.#precioNuevo = 0.0;                       // Inicializado como 0.0
        this.#idUsuario = new Usuario();               // Inicializado como objeto de Usuario
        this.#estado = false;                           // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdFacturaProducto() {
        return this.#idFacturaProducto;
    }

    setIdFacturaProducto(idFacturaProducto) {
        this.#idFacturaProducto = idFacturaProducto;
    }

    getIdFactura() {
        return this.#idFactura;
    }

    setIdFactura(idFactura) {
        this.#idFactura = idFactura;
    }

    getIdProducto() {
        return this.#idProducto;
    }

    setIdProducto(idProducto) {
        this.#idProducto = idProducto;
    }

    getCantidadAnterior() {
        return this.#cantidadAnterior;
    }

    setCantidadAnterior(cantidadAnterior) {
        this.#cantidadAnterior = cantidadAnterior;
    }

    getCantidadEntrando() {
        return this.#cantidadEntrando;
    }

    setCantidadEntrando(cantidadEntrando) {
        this.#cantidadEntrando = cantidadEntrando;
    }

    getPrecioNuevo() {
        return this.#precioNuevo;
    }

    setPrecioNuevo(precioNueva) {
        this.#precioNuevo = precioNueva;
    }

    getIdUsuario() {
        return this.#idUsuario;
    }

    setIdUsuario(idUsuario) {
        this.#idUsuario = idUsuario;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = FacturaProducto;