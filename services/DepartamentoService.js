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
    async crearDepartamento(departamento) {
        return await this.#departamentoDB.insertarDepartamento(departamento);
    }

    async actualizarDepartamento(departamento) {
        return await this.#departamentoDB.actualizarDepartamento(departamento);
    }

    async eliminarDepartamento(departamento) {
        return await this.#departamentoDB.eliminarDepartamento(departamento);
    }
}

module.exports = DepartamentoService;