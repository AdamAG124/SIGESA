const ProductoDB = require('../database/ProductoDB.js');

class ProductoService {

    #productoDB;

    constructor(){
        this.#productoDB = new ProductoDB();
    }

    async obtenerProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda){
        if(estadoProducto == 2){
            estadoProducto = null;
        }

        if(idCategoriaFiltro == 0){
            idCategoriaFiltro = null;
        }       
        
        return await this.#productoDB.listarProductos(pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda);
    }

    async crearProducto(producto){
        return await this.#productoDB.crearProducto(producto);
    }

    async eliminarProducto(producto) {
        return await this.#productoDB.eliminarProducto(producto);
    }

    async obtenerProductoPorId(idProducto) {
        return await this.#productoDB.obtenerProductoPorId(idProducto);
    }

    async actualizarProducto(producto) {
        return await this.#productoDB.actualizarProducto(producto);
    }
}

// Exportar la clase
module.exports = ProductoService;