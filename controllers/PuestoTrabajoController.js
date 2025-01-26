const PuestoTrabajoService = require('../services/PuestoTrabajoService');

class PuestoTrabajoController {
    #puestoTrabajoService;

    constructor() {
        this.#puestoTrabajoService = new PuestoTrabajoService();
    }

    async getPuestos(pageSize, currentPage, estado, valorBusqueda) {
        return await this.#puestoTrabajoService.obtenerPuestos(pageSize, currentPage, estado, valorBusqueda);
    }

    async insertarPuesto(puesto) {
        return await this.#puestoTrabajoService.crearPuesto(puesto);
    }

    async editarPuesto(puesto) {
        return await this.#puestoTrabajoService.actualizarPuesto(puesto);
    }

    async eliminarPuesto(puesto) {
        return await this.#puestoTrabajoService.eliminarPuesto(puesto);
    }
}

module.exports = PuestoTrabajoController;