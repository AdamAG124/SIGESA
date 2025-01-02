const ProveedorService = require('../services/ProveedorService');

class ProveedorController{

    #proveedorService;

    constructor() {
        this.#proveedorService = new ProveedorService();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda) {
        return await this.#proveedorService.listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda);
    }

    async insertarProveedor(proveedor) {
        return await this.#proveedorService.insetarProveedor(proveedor);
    }

    async actualizarProveedor(proveedor) {
        return await this.#proveedorService.actualizarProveedor(proveedor);
    }

    async eliminarProveedor(proveedor) {
        return await this.#proveedorService.eliminarProveedor(proveedor);
    }
}
// Exportar la clase
module.exports = ProveedorController;