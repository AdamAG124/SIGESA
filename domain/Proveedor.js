class Proveedor {
    // Atributos privados
    #idProveedor;
    #nombre;
    #provincia;
    #canton;
    #distrito;
    #direccion;
    #estado;

    // Constructor sin parámetros
    constructor() {
        this.#idProveedor = 0;       // Inicializado como 0
        this.#nombre = "";           // Inicializado como cadena vacía
        this.#provincia = "";        // Inicializado como cadena vacía
        this.#canton = "";           // Inicializado como cadena vacía
        this.#distrito = "";         // Inicializado como cadena vacía
        this.#direccion = "";        // Inicializado como cadena vacía
        this.#estado = false;        // Inicializado como false (tinyint(1))
    }

    // Getters y Setters
    getIdProveedor() {
        return this.#idProveedor;
    }

    setIdProveedor(idProveedor) {
        this.#idProveedor = idProveedor;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getProvincia() {
        return this.#provincia;
    }

    setProvincia(provincia) {
        this.#provincia = provincia;
    }

    getCanton() {
        return this.#canton;
    }

    setCanton(canton) {
        this.#canton = canton;
    }

    getDistrito() {
        return this.#distrito;
    }

    setDistrito(distrito) {
        this.#distrito = distrito;
    }

    getDireccion() {
        return this.#direccion;
    }

    setDireccion(direccion) {
        this.#direccion = direccion;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }
}

module.exports = Proveedor;