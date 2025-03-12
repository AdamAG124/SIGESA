const ProductoService = require('../services/ProductService');

class ProductoController {

    #productoService;

    constructor() {
        this.#productoService = new ProductoService();
    }

    async getProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda) {
        return await this.#productoService.obtenerProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda);
    }

}

module.exports = ProductoController;