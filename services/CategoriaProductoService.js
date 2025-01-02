const CategoriaProductoDB = require('../database/CategoriaProductoDB');

class CategoriaProductoService {
    #categoriaProductoDB;

    constructor() {
        this.#categoriaProductoDB = new CategoriaProductoDB();
    }

    async obtenerCategoriasProductos(pageSize, currentPage, estadoCategoria, valorBusqueda) {
        if(estadoCategoria == 2){
            estadoCategoria = null;
        }
        return await this.#categoriaProductoDB.listarCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda);
    }

    async crearCategoria(categoria) {
        if (!categoria || !categoria.getNombre()) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }
        return await this.#categoriaProductoDB.crearCategoriaBD(categoria);
    }

    async actualizarCategoria(categoria) {
        if (!categoria || !categoria.getIdCategoria()) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }
        return await this.#categoriaProductoDB.actualizarCategoriaBD(categoria);
    }

    async eliminarCategoria(categoria,) {
        /*if (!categoria || !categoria.getIdCategoria() ) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }*/
        return await this.#categoriaProductoDB.eliminarCategoriaBD(categoria);
    }
}

// Exportar la clase
module.exports = CategoriaProductoService;
