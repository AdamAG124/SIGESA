const EntidadFinanciera = require('./EntidadFinanciera'); // Importa la clase EntidadFinanciera

class CuentaBancaria {
    // Atributos privados
    #idCuentaBancaria;
    #idEntidadFinanciera; // Este atributo será un objeto de la clase EntidadFinanciera
    #banco;
    #numero;
    #divisa;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idCuentaBancaria = 0;                      // Inicializado como 0
        this.#idEntidadFinanciera = new EntidadFinanciera(); // Inicializado como un objeto de EntidadFinanciera
        this.#banco = "";                                // Inicializado como cadena vacía
        this.#numero = "";                               // Inicializado como cadena vacía
        this.#divisa = "";                               // Inicializado como cadena vacía
        this.#estado = false;                            // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdCuentaBancaria() {
        return this.#idCuentaBancaria;
    }

    setIdCuentaBancaria(idCuentaBancaria) {
        this.#idCuentaBancaria = idCuentaBancaria;
    }

    getIdEntidadFinanciera() {
        return this.#idEntidadFinanciera;
    }

    setIdEntidadFinanciera(idEntidadFinanciera) {
        this.#idEntidadFinanciera = idEntidadFinanciera;
    }

    getBanco() {
        return this.#banco;
    }

    setBanco(banco) {
        this.#banco = banco;
    }

    getNumero() {
        return this.#numero;
    }

    setNumero(numero) {
        this.#numero = numero;
    }

    getDivisa() {
        return this.#divisa;
    }

    setDivisa(divisa) {
        this.#divisa = divisa;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = CuentaBancaria;