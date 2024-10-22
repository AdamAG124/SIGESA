const CategoriaProductoDB = require('../database/CategoriaProductoDB');

class CategoriaProductoService {
    #categoriaProductoDB;

    constructor() {
        this.#categoriaProductoDB = new CategoriaProductoDB();
    }

    async obtenerCategoriasProductos() {
        return await this.#categoriaProductoDB.obtenerCategoriasProductos();
    }

    async crearCategoriaProducto(categoriaProducto) {
        if (!categoriaProducto || !categoriaProducto.nombre) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }
        return await this.#categoriaProductoDB.crearCategoriaProductoBD(categoriaProducto);
    }
    
    async actualizarCategoriaProducto(categoriaProducto) {
        if (!categoriaProducto || !categoriaProducto.id) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }
        return await this.#categoriaProductoDB.actualizarCategoriaProductoBD(categoriaProducto);
    }

    async eliminarCategoriaProducto(categoriaProducto) {
        if (!categoriaProducto || !categoriaProducto.id) {
            return {
                success: false,
                message: 'Por favor, proporciona todos los campos requeridos.'
            };
        }
        return await this.#categoriaProductoDB.eliminarCategoriaProductoBD(categoriaProducto);
    }
}

// Exportar la clase
module.exports = CategoriaProductoService;
