// ConectarDB.js
const mysql = require('mysql2/promise');

class ConectarDB {
    #host;
    #user;
    #password;
    #database;

    constructor() {
        this.#host = "localhost";
        this.#user = "AdamAG";
        this.#password = "adam124";
        this.#database = "dbsigesa";
    }

    async conectar() {
        try {
            const connection = await mysql.createConnection({
                host: this.#host,
                user: this.#user,
                password: this.#password,
                database: this.#database,
            });
            console.log('Conectado a la base de datos como ID ' + connection.threadId);
            return connection; // Devuelve la conexión
        } catch (err) {
            console.error('Error conectando a la base de datos: ' + err.stack);
            throw err; // Lanza el error para ser manejado en otro lugar
        }
    }
}

// Exportar la clase
module.exports = ConectarDB;
