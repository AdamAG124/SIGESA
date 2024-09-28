class CategoriaProducto {
    // Atributos privados (convención usando _ antes del nombre del atributo)
    #idCategoria;
    #nombre;
    #descripcion;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idCategoria = 0;       // Inicializado con valor por defecto 0
        this.#nombre = "";           // Inicializado como una cadena vacía
        this.#descripcion = "";      // Inicializado como una cadena vacía
        this.#estado = false;        // Inicializado como false (equivalente a tinyint(1) en MySQL)
    }

    // Getters y Setters
    getIdCategoria() {
        return this.#idCategoria;
    }

    setIdCategoria(idCategoria) {
        this.#idCategoria = idCategoria;
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

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = CategoriaProducto;