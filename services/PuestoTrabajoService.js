const PuestoTrabajoDB = require("../database/PuestoTrabajoDB");

class PuestoTrabajoService {
    #puestoTrabajoDB;

    constructor() {
        this.#puestoTrabajoDB = new PuestoTrabajoDB();
    }

    async obtenerPuestos(pageSize, currentPage, estado, valorBusqueda) {
        if (estado == 2) {
            estado = null;
        }
        return await this.#puestoTrabajoDB.listarPuestos(pageSize, currentPage, estado, valorBusqueda);
    }

    async crearPuesto(puesto) {
        return await this.#puestoTrabajoDB.insertarPuesto(puesto);
    }

    async actualizarPuesto(puesto) {
        return await this.#puestoTrabajoDB.actualizarPuesto(puesto);
    }

    async eliminarPuesto(puesto) {
        return await this.#puestoTrabajoDB.eliminarPuesto(puesto);
    }
}

module.exports = PuestoTrabajoService;