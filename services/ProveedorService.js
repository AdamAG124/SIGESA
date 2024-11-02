const ProveedorDB = require('../database/ProveedorDB');

class ProveedorService{

    #proveedorDB;

    constructor(){
        this.#proveedorDB = new ProveedorDB();
    }

    async listarProveedores(pageSize, currentPage){
        return await this.#proveedorDB.listarProveedores(pageSize, currentPage);
    }
}