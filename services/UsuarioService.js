const UsuarioDB = require('../database/usuariodb');

class UsuarioService {

    #usuarioDB;

    constructor(){
        this.#usuarioDB = new UsuarioDB();
    }

    async validarUsuario(username, password) {
        if (!username || !password) {
            return {
                success: false,
                message: 'Por favor, rellena todos los campos.'
            };
        }
        return await this.#usuarioDB.validarUsuario(username, password);
    }

    async obtenerUsuarios(){
        return await this.#usuarioDB.obtenerUsuarios();
    }

    async actualizarUsuario(usuario){
        return await this.#usuarioDB.actualizarUsuarioBD(usuario);
    }

    async eliminarUsuario(usuario){
        return await this.#usuarioDB.eliminarUsuarioBD(usuario);
    }

    async crearUsuario(usuario){
        return await this.#usuarioDB.crearUsuarioBD(usuario);
    }
}

// Exportar la clase
module.exports = UsuarioService;
