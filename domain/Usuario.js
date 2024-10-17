const Colaborador = require('./Colaborador'); // Importa la clase Colaborador
const Rol = require('./Rol');

class Usuario {
    // Atributos privados
    #idUsuario;
    #idColaborador; // Inicializado como objeto de Colaborador
    #nombreUsuario;
    #idRol;
    #password;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idUsuario = 0;                        // Inicializado como 0
        this.#idColaborador = new Colaborador();    // Inicializado como objeto de Colaborador
        this.#nombreUsuario = '';                    // Inicializado como cadena vacía
        this.#idRol = new Rol();                             // Inicializado como cadena vacía
        this.#password = '';                         // Inicializado como cadena vacía
        this.#estado = false;                        // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdUsuario() {
        return this.#idUsuario;
    }

    setIdUsuario(idUsuario) {
        this.#idUsuario = idUsuario;
    }

    getIdColaborador() {
        return this.#idColaborador;
    }

    setIdColaborador(idColaborador) {
        this.#idColaborador = idColaborador;
    }

    getNombreUsuario() {
        return this.#nombreUsuario;
    }

    setNombreUsuario(nombreUsuario) {
        this.#nombreUsuario = nombreUsuario;
    }

    getRol() {
        return this.#idRol;
    }

    setRol(rol) {
        this.#idRol = rol;
    }

    getPassword() {
        return this.#password;
    }

    setPassword(password) {
        this.#password = password;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = Usuario;