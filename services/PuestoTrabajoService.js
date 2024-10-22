const PuestoDB = require("../database/PuestoDB");

class PuestoTranajoService {

    #puestoDB;
    
    constructor() {
        this.#puestoDB = new PuestoDB();
    }

    async obtenerPuestos(pageSize, currentPage, estado, valorBusqueda) {
        if(estado == 2){
            estado = null;
        }
        return await this.#puestoDB.listarPuestos(pageSize, currentPage, estado, valorBusqueda);
    }
}

module.exports = PuestoTranajoService;