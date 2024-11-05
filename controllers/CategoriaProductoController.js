const CategoriaService = require('../services/CategoriaProductoService');

class CategoriaProductoController {
    #categoriaService;

    constructor() {
        this.#categoriaService = new CategoriaService();
    }

    async listarCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda) {
        return await this.#categoriaService.obtenerCategoriasProductos(pageSize, currentPage, estadoCategoria, valorBusqueda);
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
