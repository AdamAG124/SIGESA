class EntidadFinanciera {
    // Atributos privados
    #idEntidadFinanciera;
    #nombre;
    #tipo;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idEntidadFinanciera = 0;    // Inicializado como 0
        this.#nombre = "";                // Inicializado como cadena vacía
        this.#tipo = "";                  // Inicializado como cadena vacía
        this.#estado = false;             // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdEntidadFinanciera() {
        return this.#idEntidadFinanciera;
    }

    setIdEntidadFinanciera(idEntidadFinanciera) {
        this.#idEntidadFinanciera = idEntidadFinanciera;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getTipo() {
        return this.#tipo;
    }

    setTipo(tipo) {
        this.#tipo = tipo;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = EntidadFinanciera;