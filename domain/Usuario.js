const Colaborador = require('./Colaborador'); // Importa la clase Colaborador
const Roles = require('./Roles');

class Usuario {
    // Atributos privados
    #idUsuario;
    #idColaborador; // Inicializado como objeto de Colaborador
    #nombreUsuario;
    #idRole;
    #password;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idUsuario = 0;                        // Inicializado como 0
        this.#idColaborador = new Colaborador();    // Inicializado como objeto de Colaborador
        this.#nombreUsuario = '';                    // Inicializado como cadena vacía
        this.#idRole = new Roles();                             // Inicializado como cadena vacía
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

    getRole() {
        return this.#idRole;
    }

    setRole(role) {
        this.#idRole = role;
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