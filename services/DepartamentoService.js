const DepartamentoDB = require('../database/DepartamentoDB');

class DepartamentoService {

    #departamentoDB;

    constructor(){
        this.#departamentoDB = new DepartamentoDB();
    }

    async obtenerDepartamentos(pageSize, currentPage, estado, valorBusqueda){
        if(estado == 2){
            estado = null;
        }
        return await this.#departamentoDB.listarDepartamentos(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = DepartamentoService;