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

    async eliminarProducto(producto) {
        return await this.#productoService.eliminarProducto(producto);
    }


    async obtenerProductoPorId(idProducto) {
        return await this.#productoService.obtenerProductoPorId(idProducto);
    }

    async actualizarProducto(producto) {
        return await this.#productoService.actualizarProducto(producto);
    }

    async generarReportes(filtroEstado, filtroCategoria, formato){
        this.#productoService.generarReportes(filtroEstado, filtroCategoria, formato);
    }
}

module.exports = ProductoController;