// rol.js
class Rol {
    // Atributos privados
    #idRol;
    #nombre;
    #descripcion;

    // Constructor sin parámetros
    constructor() {
        this.#idRol = null;
        this.#nombre = '';
        this.#descripcion = '';
    }

    // Getters
    getIdRol() {
        return this.#idRol;
    }

    getNombre() {
        return this.#nombre;
    }

    getDescripcion() {
        return this.#descripcion;
    }

    // Setters
    setIdRol(value) {
        this.#idRol = value;
    }

    setNombre(value) {
        this.#nombre = value;
    }

    setDescripcion(value) {
        this.#descripcion = value;
    }
}

module.exports = Rol;