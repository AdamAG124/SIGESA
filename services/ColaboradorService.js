const ColaboradorDB = require('../database/ColaboradorDB');

class ColaboradorService{

    #colaboradorDB;

    constructor(){
        this.#colaboradorDB = new ColaboradorDB();
    }

    async obtenerColaboradores(){
        return await this.#colaboradorDB.listarColaboradores();
    }
}

// Exportar la clase
module.exports = ColaboradorService;