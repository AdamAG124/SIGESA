const ColaboradorDB = require('../database/ColaboradorDB');

class ColaboradorService{

    #colaboradorDB;

    constructor(){
        this.#colaboradorDB = new ColaboradorDB();
    }

    async obtenerColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda){
        return await this.#colaboradorDB.listarColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);
    }
}

// Exportar la clase
module.exports = ColaboradorService;