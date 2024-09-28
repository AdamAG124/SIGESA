const Proveedor = require('./Proveedor'); // Importa la clase Proveedor
const ComprobantePago = require('./ComprobantePago'); // Importa la clase ComprobantePago

class Factura {
    // Atributos privados
    #idFactura;
    #idProveedor; // Inicializado como objeto de Proveedor
    #idComprobante; // Inicializado como objeto de ComprobantePago
    #numeroFactura;
    #fechaFactura;
    #detallesAdicionales;
    #impuesto;
    #descuento;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idFactura = 0;                  // Inicializado como 0
        this.#idProveedor = new Proveedor();   // Inicializado como objeto de Proveedor
        this.#idComprobante = new ComprobantePago(); // Inicializado como objeto de ComprobantePago
        this.#numeroFactura = "";              // Inicializado como cadena vacía
        this.#fechaFactura = null;             // Inicializado como null
        this.#detallesAdicionales = "";       // Inicializado como cadena vacía
        this.#impuesto = 0.0;                  // Inicializado como 0.0
        this.#descuento = 0.0;                 // Inicializado como 0.0
        this.#estado = false;                  // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdFactura() {
        return this.#idFactura;
    }

    setIdFactura(idFactura) {
        this.#idFactura = idFactura;
    }

    getIdProveedor() {
        return this.#idProveedor;
    }

    setIdProveedor(idProveedor) {
        this.#idProveedor = idProveedor;
    }

    getIdComprobante() {
        return this.#idComprobante;
    }

    setIdComprobante(idComprobante) {
        this.#idComprobante = idComprobante;
    }

    getNumeroFactura() {
        return this.#numeroFactura;
    }

    setNumeroFactura(numeroFactura) {
        this.#numeroFactura = numeroFactura;
    }

    getFechaFactura() {
        return this.#fechaFactura;
    }

    setFechaFactura(fechaFactura) {
        this.#fechaFactura = fechaFactura;
    }

    getDetallesAdicionales() {
        return this.#detallesAdicionales;
    }

    setDetallesAdicionales(detallesAdicionales) {
        this.#detallesAdicionales = detallesAdicionales;
    }

    getImpuesto() {
        return this.#impuesto;
    }

    setImpuesto(impuesto) {
        this.#impuesto = impuesto;
    }

    getDescuento() {
        return this.#descuento;
    }

    setDescuento(descuento) {
        this.#descuento = descuento;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = Factura;
