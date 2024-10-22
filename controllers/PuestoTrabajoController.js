const PuestoTrabajoService = require('../services/PuestoTrabajoService');

class PuestoTrabajoController {
    #puestoTrabajoService;
    
    constructor() {
        this.#puestoTrabajoService = new PuestoTrabajoService();
    }
    
    async getPuestosTrabajo(pageSize, currentPage, estadoPuesto, valorBusqueda) {
        return await this.#puestoTrabajoService.obtenerPuestos(pageSize, currentPage, estadoPuesto, valorBusqueda);
    }

}

module.exports = PuestoTrabajoController;