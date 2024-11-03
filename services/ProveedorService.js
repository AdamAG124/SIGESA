const ProveedorDB = require('../database/ProveedorDB');

class ProveedorService{

    #proveedorDB;

    constructor(){
        this.#proveedorDB = new ProveedorDB();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda){
        return await this.#proveedorDB.listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda);
    }
}
// Exportar la clase
module.exports = ProveedorService;