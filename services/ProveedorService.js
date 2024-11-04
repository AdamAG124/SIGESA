const ProveedorDB = require('../database/ProveedorDB');

class ProveedorService{

    #proveedorDB;

    constructor(){
        this.#proveedorDB = new ProveedorDB();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda){
        return await this.#proveedorDB.listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda);
    }

    async insetarProveedor(proveedor){
        return await this.#proveedorDB.insertarProveedor(proveedor);
    }

    async actualizarProveedor(proveedor){
        return await this.#proveedorDB.actualizarProveedor(proveedor);
    }

    async eliminarProveedor(proveedor){
        return await this.#proveedorDB.eliminarProveedor(proveedor);
    }
}
// Exportar la clase
module.exports = ProveedorService;