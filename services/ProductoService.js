const ProductoDB = require('../database/ProductDB');

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
}

// Exportar la clase
module.exports = ProductoService;