const CategoriaService = require('../services/CategoriaService');

class CategoriaProductoController {
    #categoriaService;

    constructor() {
        this.#categoriaService = new CategoriaService();
    }

    async listarCategorias() {
        return await this.#categoriaService.obtenerCategorias();
    }

    async crearCategoria(categoria) {
        return await this.#categoriaService.crearCategoria(categoria);
    }

    async actualizarCategoria(categoria) {
        return await this.#categoriaService.actualizarCategoria(categoria);
    }

    async eliminarCategoria(categoria) {
        return await this.#categoriaService.eliminarCategoria(categoria);
    }
}

module.exports = CategoriaProductoController;
