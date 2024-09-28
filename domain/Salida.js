const Colaborador = require('./Colaborador'); // Importa la clase Colaborador

class Salida {
    // Atributos privados
    #idSalida;
    #colaboradorSacando; // Inicializado como objeto de Colaborador
    #colaboradorRecibiendo; // Inicializado como objeto de Colaborador
    #fechaSalida;
    #idUsuario;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idSalida = 0;                           // Inicializado como 0
        this.#colaboradorSacando = new Colaborador(); // Inicializado como objeto de Colaborador
        this.#colaboradorRecibiendo = new Colaborador(); // Inicializado como objeto de Colaborador
        this.#fechaSalida = new Date();               // Inicializado como la fecha actual
        this.#idUsuario = 0;                          // Inicializado como 0
        this.#estado = false;                         // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdSalida() {
        return this.#idSalida;
    }

    setIdSalida(idSalida) {
        this.#idSalida = idSalida;
    }

    getColaboradorSacando() {
        return this.#colaboradorSacando;
    }

    setColaboradorSacando(colaboradorSacando) {
        this.#colaboradorSacando = colaboradorSacando;
    }

    getColaboradorRecibiendo() {
        return this.#colaboradorRecibiendo;
    }

    setColaboradorRecibiendo(colaboradorRecibiendo) {
        this.#colaboradorRecibiendo = colaboradorRecibiendo;
    }

    getFechaSalida() {
        return this.#fechaSalida;
    }

    setFechaSalida(fechaSalida) {
        this.#fechaSalida = fechaSalida;
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

module.exports = Salida;