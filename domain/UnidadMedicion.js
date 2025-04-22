class UnidadMedicion {
    // Atributos privados (convención usando _ antes del nombre del atributo)
    #idUnidadMedicion;
    #nombre;
    #estado; // Agregado el atributo estado
    // Constructor sin parámetros
    constructor() {
        this.#idUnidadMedicion = 0;
        this.#nombre = "";
        this.#estado = false;
    }

    // Getters y Setters
    getIdUnidadMedicion() {
        return this.#idUnidadMedicion;
    }

    setIdUnidadMedicion(idUnidadMedicion) {
        this.#idUnidadMedicion = idUnidadMedicion;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}
module.exports = UnidadMedicion;
