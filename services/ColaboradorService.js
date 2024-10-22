const ColaboradorDB = require('../database/ColaboradorDB');

class ColaboradorService{

    #colaboradorDB;

    constructor(){
        this.#colaboradorDB = new ColaboradorDB();
    }

    async obtenerColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda){
        if(estadoColaborador == 2){
            estadoColaborador = null;
        }
        if(idPuestoFiltro == 0){
            idPuestoFiltro = null;
        }
        if(idDepartamentoFiltro == 0){
            idDepartamentoFiltro = null;
        }
        return await this.#colaboradorDB.listarColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);
    }

    async eliminarColaborador(colaborador){
        return await this.#colaboradorDB.eliminarColaboradorBD(colaborador);
    }
}

// Exportar la clase
module.exports = ColaboradorService;