const CategoriaProductoService = require('../services/CategoriaProductoService');

class CategoriaProductoController {
    #categoriaProductoService;

    constructor() {
        this.#categoriaProductoService = new CategoriaProductoService();
    }

    async listarCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda) {
        return await this.#categoriaProductoService.obtenerCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda);
    }

    async crearCategoria(categoria) {
        return await this.#categoriaProductoService.crearCategoria(categoria);
    }

    async actualizarCategoria(categoria) {
        return await this.#categoriaProductoService.actualizarCategoria(categoria);
    }

    async eliminarCategoria(categoria) {
        return await this.#categoriaProductoService.eliminarCategoria(categoria);
    }
}

module.exports = CategoriaProductoController;