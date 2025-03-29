const Colaborador = require('./Colaborador');
const Usuario = require('./Usuario');
class Salida {
    #idSalida;
    #colaboradorSacando;
    #colaboradorRecibiendo;
    #fechaSalida;
    #idUsuario;
    #detalleSalida;
    #estado;

    constructor() {
        this.#idSalida = 0;
        this.#colaboradorSacando = new Colaborador();
        this.#colaboradorRecibiendo = new Colaborador();
        this.#fechaSalida = new Date();
        this.#idUsuario = new Usuario();
        this.#detalleSalida = "";
        this.#estado = false
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

    getDetalleSalida() {
        return this.#detalleSalida;
    }

    setDetalleSalida(detalleSalida) {
        this.#detalleSalida = detalleSalida;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = Salida;