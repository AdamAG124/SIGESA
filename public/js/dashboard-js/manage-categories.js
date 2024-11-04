document.addEventListener('DOMContentLoaded', () => {
    // Listar categorías al cargar la página
    cargarCategoriasTabla();

    // Manejar la creación de una nueva categoría
    document.getElementById('formCrearCategoria').addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombreCategoria').value;
        const descripcion = document.getElementById('descripcionCategoria').value;

        const categoriaData = { nombreCategoria: nombre, descripcion: descripcion };
        window.api.crearCategoria(categoriaData);
    });

    // Manejar la respuesta de crear categoría
    window.api.onRespuestaCrearCategoria((respuesta) => {
        alert(respuesta.message);
        if (respuesta.success) {
            cargarCategoriasTabla();
        }
    });

    // Manejar la actualización de una categoría
    document.getElementById('formActualizarCategoria').addEventListener('submit', (event) => {
        event.preventDefault();

        const idCategoria = document.getElementById('idCategoria').value;
        const nombre = document.getElementById('nombreCategoriaActualizar').value;
        const descripcion = document.getElementById('descripcionCategoriaActualizar').value;

        const categoriaData = { idCategoria, nombreCategoria: nombre, descripcion: descripcion };
        window.api.actualizarCategoria(categoriaData);
    });

    // Manejar la respuesta de actualizar categoría
    window.api.onRespuestaActualizarCategoria((respuesta) => {
        alert(respuesta.message);
        if (respuesta.success) {
            cargarCategoriasTabla();
        }
    });

    // Manejar la eliminación de una categoría
    document.getElementById('formEliminarCategoria').addEventListener('submit', (event) => {
        event.preventDefault();

        const idCategoria = document.getElementById('idCategoriaEliminar').value;
        window.api.eliminarCategoria(idCategoria);
    });

    // Manejar la respuesta de eliminar categoría
    window.api.onRespuestaEliminarCategoria((respuesta) => {
        alert(respuesta.message);
        if (respuesta.success) {
            cargarCategoriasTabla();
        }
    });
});

function cargarCategoriasTabla(pageSize = 10, currentPage = 1, estadoCategoria = 1, valorBusqueda = null) {
    window.api.obtenerCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda, (categorias) => {
        const listaCategorias = document.getElementById('listaCategorias');
        listaCategorias.innerHTML = '';

        categorias.forEach(categoria => {
            const item = document.createElement('li');
            item.textContent = `${categoria.nombreCategoria} - ${categoria.descripcion}`;
            listaCategorias.appendChild(item);
        });

        // Actualizar los botones de paginación
        actualizarPaginacion(categorias.paginacion, ".pagination", 3);
    });
}

function filterTable(moduloFiltrar) {
    switch (moduloFiltrar) {
        case 3:
            cargarCategoriasTabla(
                Number(document.getElementById("selectPageSize").value),
                Number(document.querySelector('.currentPage').getAttribute('data-value')),
                Number(document.getElementById("estado-filtro").value),
                document.getElementById("search-bar").value
            );
            break;
    }
}

function actualizarPaginacion(pagination, idInnerDiv, moduloPaginar) {
    
}