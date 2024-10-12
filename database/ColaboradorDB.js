const ConectarDB = require('./ConectarDB');
const Colaborador = require('../domain/Colaborador');

class ColaboradorDB {
    #table;

    constructor() {
        this.#table = 'colaborador';
    }

    // Método para recuperar la lista de colaboradores
    async listarColaboradores() {
        const db = new ConectarDB();
        const connection = await db.conectar();
        const colaboradores = [];

        try {
            const [rows] = await connection.query(`SELECT * FROM ${this.#table}`);

            // Mapear cada fila a un objeto de tipo Colaborador
            rows.forEach(row => {
                const colaborador = new Colaborador();

                colaboradores.push(colaborador);
            });

            return colaboradores; // Retornar la lista de çolaboradores
        } catch (error) {
            console.error('Error al listar çolaboradores:', error);
            throw error; // Propagar el error
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }
}

module.exports = ColaboradorDB;
