class Departamento {
    // Atributos privados
    #idDepartamento;
    #nombre;
    #descripcion;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idDepartamento = 0;   // Inicializado con valor por defecto 0
        this.#nombre = "";          // Inicializado como cadena vacía
        this.#descripcion = "";     // Inicializado como cadena vacía
        this.#estado = false;       // Inicializado como false (equivalente a tinyint(1))
    }

    // Getters y Setters
    getIdDepartamento() {
        return this.#idDepartamento;
    }

    setIdDepartamento(idDepartamento) {
        this.#idDepartamento = idDepartamento;
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

module.exports = Departamento;