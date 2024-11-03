const ProveedorService = require('../services/ProveedorService');

class ProveedorController{

    #proveedorService;

    constructor() {
        this.#proveedorService = new ProveedorService();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda) {
        return await this.#proveedorService.listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda);
    }
}
// Exportar la clase
module.exports = ProveedorController;