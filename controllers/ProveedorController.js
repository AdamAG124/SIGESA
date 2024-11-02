const ProveedorService = require('../services/ProveedorService');

class ProveedorController{

    #proveedorService;

    constructor() {
        this.#proveedorService = new ProveedorService();
    }

    async listarProveedores(pageSize, currentPage) {
        return await this.#proveedorService.listarProveedores(pageSize, currentPage);
    }
}