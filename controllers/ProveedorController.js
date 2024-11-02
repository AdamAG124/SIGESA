const ProveedorService = require('../services/ProveedorService');

class ProveedorController{

    #proveedorService;

    constructor() {
        this.#proveedorService = new ProveedorService();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor) {
        return await this.#proveedorService.listarProveedores(pageSize, currentPage, estadoProveedor);
    }
}
// Exportar la clase
module.exports = ProveedorController;