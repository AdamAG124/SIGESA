const ProveedorDB = require('../database/ProveedorDB');

class ProveedorService{

    #proveedorDB;

    constructor(){
        this.#proveedorDB = new ProveedorDB();
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor){
        return await this.#proveedorDB.listarProveedores(pageSize, currentPage, estadoProveedor);
    }
}
// Exportar la clase
module.exports = ProveedorService;