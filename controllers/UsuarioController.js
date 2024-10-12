const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    #usuarioService;

    constructor() {
        this.#usuarioService = new UsuarioService();
    }

    async login(username, password) {
        return await this.#usuarioService.validarUsuario(username, password);
    }

    async listarUsuarios(){
        return await this.#usuarioService.obtenerUsuarios();
    }

    async actualizarUsuario(usuario){
        return await this.#usuarioService.actualizarUsuario(usuario);
    }

    async eliminarUsuario(usuario){
        return await this.#usuarioService.eliminarUsuario(usuario);
    }

    async crearUsuario(usuario){
        return await this.#usuarioService.crearUsuario(usuario);
    }
}

module.exports = UsuarioController;
