class EntidadFinanciera {
    // Atributos privados
    #idEntidadFinanciera;
    #nombre;
    #telefono;
    #correo;
    #tipo;
    #fechaInicioFinanciamiento;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idEntidadFinanciera = 0;    // Inicializado como 0
        this.#nombre = "";                // Inicializado como cadena vacía
        this.#telefono = "";              // Inicializado como cadena vacía
        this.#correo = "";                // Inicializado como cadena vacía
        this.#tipo = "";                  // Inicializado como cadena vacía
        this.#fechaInicioFinanciamiento = ""; // Inicializado como cadena vacía
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

    getTelefono() {
        return this.#telefono;
    }

    setTelefono(telefono) {
        this.#telefono = telefono;
    }

    getCorreo() {
        return this.#correo;
    }

    setCorreo(correo) {
        this.#correo = correo;
    }

    getTipo() {
        return this.#tipo;
    }

    setTipo(tipo) {
        this.#tipo = tipo;
    }

    getFechaInicioFinanciamiento() {
        return this.#fechaInicioFinanciamiento;
    }

    setFechaInicioFinanciamiento(fechaInicioFinanciamiento) {
        this.#fechaInicioFinanciamiento = fechaInicioFinanciamiento;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = EntidadFinanciera;