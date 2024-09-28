// Importar las clases correspondientes
const Departamento = require('./Departamento');
const PuestoTrabajo = require('./PuestoTrabajo');

class Colaborador {
    // Atributos privados
    #idColaborador;
    #idDepartamento;
    #idPuesto;
    #segundoApellido;
    #fechaNacimiento;
    #numTelefono;
    #fechaIngreso;
    #fechaSalida;
    #estado;
    #correo;
    #cedula;
    #nombre;
    #primerApellido;

    // Constructor sin parámetros
    constructor() {
        this.#idColaborador = 0;                  // Inicializado como 0
        this.#idDepartamento = new Departamento(); // Inicializado como un objeto de la clase Departamento
        this.#idPuesto = new PuestoTrabajo();      // Inicializado como un objeto de la clase PuestoTrabajo
        this.#segundoApellido = "";               // Inicializado como cadena vacía
        this.#fechaNacimiento = null;             // Inicializado como null (representa una fecha vacía)
        this.#numTelefono = "";                   // Inicializado como cadena vacía
        this.#fechaIngreso = null;                // Inicializado como null
        this.#fechaSalida = null;                 // Inicializado como null
        this.#estado = false;                     // Inicializado como false (tinyint(1))
        this.#correo = "";                        // Inicializado como cadena vacía
        this.#cedula = "";                        // Inicializado como cadena vacía
        this.#nombre = "";                        // Inicializado como cadena vacía
        this.#primerApellido = "";                // Inicializado como cadena vacía
    }

    // Getters y Setters
    getIdColaborador() {
        return this.#idColaborador;
    }

    setIdColaborador(idColaborador) {
        this.#idColaborador = idColaborador;
    }

    getIdDepartamento() {
        return this.#idDepartamento;
    }

    setIdDepartamento(departamento) {
        this.#idDepartamento = departamento;
    }

    getIdPuesto() {
        return this.#idPuesto;
    }

    setIdPuesto(puesto) {
        this.#idPuesto = puesto;
    }

    getSegundoApellido() {
        return this.#segundoApellido;
    }

    setSegundoApellido(segundoApellido) {
        this.#segundoApellido = segundoApellido;
    }

    getFechaNacimiento() {
        return this.#fechaNacimiento;
    }

    setFechaNacimiento(fechaNacimiento) {
        this.#fechaNacimiento = fechaNacimiento;
    }

    getNumTelefono() {
        return this.#numTelefono;
    }

    setNumTelefono(numTelefono) {
        this.#numTelefono = numTelefono;
    }

    getFechaIngreso() {
        return this.#fechaIngreso;
    }

    setFechaIngreso(fechaIngreso) {
        this.#fechaIngreso = fechaIngreso;
    }

    getFechaSalida() {
        return this.#fechaSalida;
    }

    setFechaSalida(fechaSalida) {
        this.#fechaSalida = fechaSalida;
    }

    getEstado() {
        return this.#estado;
    }

    setEstado(estado) {
        this.#estado = estado;
    }

    getCorreo() {
        return this.#correo;
    }

    setCorreo(correo) {
        this.#correo = correo;
    }

    getCedula() {
        return this.#cedula;
    }

    setCedula(cedula) {
        this.#cedula = cedula;
    }

    getNombre() {
        return this.#nombre;
    }

    setNombre(nombre) {
        this.#nombre = nombre;
    }

    getPrimerApellido() {
        return this.#primerApellido;
    }

    setPrimerApellido(primerApellido) {
        this.#primerApellido = primerApellido;
    }
}

module.exports = Colaborador;