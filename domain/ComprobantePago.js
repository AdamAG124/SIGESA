const EntidadFinanciera = require('./EntidadFinanciera'); // Importa la clase EntidadFinanciera

class ComprobantePago {
    // Atributos privados
    #idComprobantePago;
    #idEntidadFinanciera; // Este atributo será un objeto de la clase EntidadFinanciera
    #fechaPago;
    #numero;
    #monto;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idComprobantePago = 0;                      // Inicializado como 0
        this.#idEntidadFinanciera = new EntidadFinanciera(); // Inicializado como un objeto de EntidadFinanciera
        this.#fechaPago = null;                           // Inicializado como null
        this.#numero = "";                                // Inicializado como cadena vacía
        this.#monto = 0.0;                               // Inicializado como 0.0
        this.#estado = false;                             // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdComprobantePago() {
        return this.#idComprobantePago;
    }

    setIdComprobantePago(idComprobantePago) {
        this.#idComprobantePago = idComprobantePago;
    }

    getIdEntidadFinanciera() {
        return this.#idEntidadFinanciera;
    }

    setIdEntidadFinanciera(idEntidadFinanciera) {
        this.#idEntidadFinanciera = idEntidadFinanciera;
    }

    getFechaPago() {
        return this.#fechaPago;
    }

    setFechaPago(fechaPago) {
        this.#fechaPago = fechaPago;
    }

    getNumero() {
        return this.#numero;
    }

    setNumero(numero) {
        this.#numero = numero;
    }

    getMonto() {
        return this.#monto;
    }

    setMonto(monto) {
        this.#monto = monto;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = ComprobantePago;