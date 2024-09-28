const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    #usuarioService;

    constructor() {
        this.#usuarioService = new UsuarioService();
    }

    async login(username, password) {
        return await this.#usuarioService.validarUsuario(username, password);
    }
}

module.exports = UsuarioController;
