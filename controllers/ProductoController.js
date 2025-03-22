const ProductoService = require('../services/ProductoService.js');

class ProductoController {

    #productoService;

    constructor() {
        this.#productoService = new ProductoService();
    }

    async getProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda) {
        return await this.#productoService.obtenerProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda);
    }

    async crearProducto(producto) {
        return await this.#productoService.crearProducto(producto);
    }

}

module.exports = ProductoController;