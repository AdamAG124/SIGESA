const CategoriaProducto = require('./CategoriaProducto'); // Importa la clase CategoriaProducto
const UnidadMedicion = require('./UnidadMedicion'); // Importa la clase CategoriaProducto

class Producto {
    // Atributos privados
    #idProducto;
    #categoria; // Inicializado como objeto de CategoriaProducto
    #nombre;
    #descripcion;
    #cantidad;
    #unidadMedicion; // Nuevo atributo
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idProducto = 0;                          // Inicializado como 0
        this.#categoria = new CategoriaProducto();    // Inicializado como objeto de CategoriaProducto
        this.#nombre = "";                              // Inicializado como cadena vacía
        this.#descripcion = "";                         // Inicializado como cadena vacía
        this.#cantidad = 0.0;                           // Inicializado como 0.0
        this.#unidadMedicion = new UnidadMedicion();                      // Inicializado como cadena vacía
        this.#estado = false;                           // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdProducto() {
        return this.#idProducto;
    }

    setIdProducto(idProducto) {
        this.#idProducto = idProducto;
    }

    getCategoria() {
        return this.#categoria;
    }

    setCategoria(categoria) {
        this.#categoria = categoria;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getDescripcion() {
        return this.#descripcion;
    }

    setDescripcion(descripcion) {
        this.#descripcion = descripcion;
    }

    getCantidad() {
        return this.#cantidad;
    }

    setCantidad(cantidad) {
        this.#cantidad = cantidad;
    }

    getUnidadMedicion() {
        return this.#unidadMedicion; // Getter para unidadMedicion
    }

    setUnidadMedicion(unidadMedicion) {
        this.#unidadMedicion = unidadMedicion; // Setter para unidadMedicion
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = Producto;