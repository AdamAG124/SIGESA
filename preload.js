// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponer funciones seguras para interactuar con ipcRenderer
contextBridge.exposeInMainWorld('api', {
    sendLogin: (username, password) => ipcRenderer.send('login', { username, password }),
    onLoginResult: (callback) => ipcRenderer.on('login-result', (event, result) => callback(result)),
    sendView: (result) => ipcRenderer.send('cambiar-vista', result),
    receiveUserData: (callback) => ipcRenderer.on('datos-usuario', (event, user) => callback(user)),
    logout: () => ipcRenderer.send('logout'),
    responseLogout: (callback) => ipcRenderer.on('logout-response', (event, response) => callback(response)),

    // Función para solicitar el HTML y recibir la respuesta
    loadHTML: (filePath) => ipcRenderer.send('leer-html', filePath),
    onHTMLLoaded: (callback) => ipcRenderer.once('html-cargado', (event, data) => callback(data)),

    // --------------------------------------------------------------------------------
    //                       USUARIO
    // Función para listar los usuarios y recibir la respuesta
    obtenerUsuarios: (pageSize, pageNumber, estado, idRolFiltro, valorBusqueda, callback) => {
        // Enviar el evento al proceso principal, junto con los parámetros de paginación
        ipcRenderer.send('listar-usuarios', { pageSize, pageNumber, estado, idRolFiltro, valorBusqueda });

        // Recibir la respuesta del proceso principal y pasarla al callback
        ipcRenderer.on('cargar-usuarios', (event, usuarios) => callback(usuarios));
    },

    obtenerRoles: (callback) => {
        ipcRenderer.send('listar-roles'); // Enviar el evento al proceso principal
        ipcRenderer.on('cargar-roles', (event, roles) => callback(roles)); // Recibir la respuesta
    },

    // Método para enviar los datos de edición de usuario al proceso principal
    actualizarUsuario: (usuarioData) => ipcRenderer.send('actualizar-usuario', usuarioData),
    // Recibir la respuesta de la actualización del usuario
    onRespuestaActualizarUsuario: (callback) => ipcRenderer.on('respuesta-actualizar-usuario', (event, respuesta) => callback(respuesta)),
    // Método para enviar el id de usuario al proceso principal para su eliminación
    eliminarUsuario: (usuarioId, estado) => ipcRenderer.send('eliminar-usuario', usuarioId, estado),
    // Recibir la respuesta de la eliminación del usuario
    onRespuestaEliminarUsuario: (callback) => ipcRenderer.on('respuesta-eliminar-usuario', (event, respuesta) => callback(respuesta)),
    // Método para enviar la información del nuevo usuario al proceso principal para su creación
    crearUsuario: (usuarioData) => ipcRenderer.send('crear-usuario', usuarioData),
    // Recibir la respuesta de la creación del usuario
    onRespuestaCrearUsuario: (callback) => ipcRenderer.on('respuesta-crear-usuario', (event, respuesta) => callback(respuesta)),

    // --------------------------------------------------------------------------------
    //                       COLABORADOR
    obtenerColaboradores: (pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda, callback) => {
        ipcRenderer.send('listar-colaboradores', { pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda }); // Enviar el evento al proceso principal
        ipcRenderer.once('cargar-colaboradores', (event, colaboradores) => callback(colaboradores)); // Recibir la respuesta
    },

    crearColaborador: (colaboradorData) => ipcRenderer.send('crear-colaborador', colaboradorData),
    // Recibir la respuesta de la creación del colaborador
    onRespuestaCrearColaborador: (callback) => ipcRenderer.on('respuesta-crear-colaborador', (event, respuesta) => callback(respuesta)),
    eliminarColaborador: (colaboradorId, estado) => ipcRenderer.send('eliminar-colaborador', colaboradorId, estado),
    // Recibir la respuesta de la eliminación del usuario
    onRespuestaEliminarColaborador: (callback) => ipcRenderer.once('respuesta-eliminar-colaborador', (event, respuesta) => callback(respuesta)),
    // Enviar los datos del colaborador al proceso principal
    editarColaborador: (colaboradorData) => ipcRenderer.send('editar-colaborador', colaboradorData),
    // Recibir la respuesta de la actualización del colaborador
    onRespuestaActualizarColaborador: (callback) => ipcRenderer.on('respuesta-actualizar-colaborador', (event, respuesta) => callback(respuesta)),

    obtenerDepartamentos: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        ipcRenderer.send('listar-departamentos', { pageSize, currentPage, estado, valorBusqueda });
        ipcRenderer.once('cargar-departamentos', (event, departamentos) => {
            // Asegúrate de que departamentos es un objeto válido y serializable
            callback(departamentos);
        });
    },

    obtenerPuestosTrabajo: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        ipcRenderer.send('listar-puestos-trabajo', { pageSize, currentPage, estado, valorBusqueda });
        ipcRenderer.once('cargar-puestos-trabajo', (event, respuesta) => {
            // Asegúrate de que respuesta es un objeto válido y serializable
            callback(respuesta);
        });
    },
    // --------------------------------------------------------------------------------
    //                       CATEGORÍA
    // Métodos para gestionar categorías
    obtenerCategorias: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        ipcRenderer.send('listar-categorias', { pageSize, currentPage, estado, valorBusqueda }); // Enviar el evento al proceso principal
        ipcRenderer.once('cargar-categorias', (event, respuesta) => callback(respuesta)); // Recibir la respuesta
    },

    // Método para enviar la información del nuevo usuario al proceso principal para su creación
    crearCategoria: (categoriaData) => ipcRenderer.send('crear-categoria', categoriaData),
    onRespuestaCrearCategoria: (callback) => ipcRenderer.on('respuesta-crear-categoria', (event, respuesta) => callback(respuesta)),

    // Método para enviar los datos de edición de categoría al proceso principal
    editarCategoria: (categoriaData) => ipcRenderer.send('actualizar-categoria', categoriaData),
    onRespuestaActualizarCategoria: (callback) => ipcRenderer.on('respuesta-actualizar-categoria', (event, respuesta) => callback(respuesta)),

    // Método para enviar el id de categoría al proceso principal para su eliminación
    eliminarCategoria: (categoriaId, estado) => ipcRenderer.send('eliminar-categoria', categoriaId, estado),
    onRespuestaEliminarCategoria: (callback) => ipcRenderer.on('respuesta-eliminar-categoria', (event, respuesta) => callback(respuesta)),


    obtenerProveedores: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        // Enviar la solicitud para listar proveedores
        ipcRenderer.send('listar-proveedores', { pageSize, currentPage, estado, valorBusqueda });

        // Definir el callback para manejar la respuesta
        const proveedoresCallback = (event, proveedores) => {
            callback(proveedores);
            // Remover el listener una vez que se ha procesado la respuesta
            ipcRenderer.removeListener('cargar-proveedores', proveedoresCallback);
        };

        // Escuchar la respuesta
        ipcRenderer.on('cargar-proveedores', proveedoresCallback);

        // Manejo de errores de la respuesta
        const errorCallback = (event, errorMessage) => {
            callback({ error: errorMessage });
            // También puedes remover el listener de error si solo lo necesitas una vez
            ipcRenderer.removeListener('error-cargar-proveedores', errorCallback);
        };

        // Escuchar los errores
        ipcRenderer.on('error-cargar-proveedores', errorCallback);
    },

    crearProveedor: (proveedorData) => ipcRenderer.send('crear-proveedor', proveedorData),
    onRespuestaCrearProveedor: (callback) => ipcRenderer.on('respuesta-crear-proveedor', (event, respuesta) => callback(respuesta)),
    editarProveedor: (proveedorData) => ipcRenderer.send('editar-proveedor', proveedorData),
    onRespuestaActualizarProveedor: (callback) => ipcRenderer.on('respuesta-actualizar-proveedor', (event, respuesta) => callback(respuesta)),
    eliminarProveedor: (proveedorId, estado) => ipcRenderer.send('eliminar-proveedor', proveedorId, estado),
    onRespuestaEliminarProveedor: (callback) => ipcRenderer.once('respuesta-eliminar-proveedor', (event, respuesta) => callback(respuesta)),

    // --------------------------------------------------------------------------------
    //                       ENTIDAD FINANCIERA
    obtenerEntidadesFinancieras: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        // Enviar la solicitud para listar proveedores
        ipcRenderer.send('listar-entidades-financieras', { pageSize, currentPage, estado, valorBusqueda });

        // Definir el callback para manejar la respuesta
        const entidadesFinancierasCallback = (event, entidadesFinancieras) => {
            callback(entidadesFinancieras);
            // Remover el listener una vez que se ha procesado la respuesta
            ipcRenderer.removeListener('cargar-entidades-financieras', entidadesFinancierasCallback);
        };

        // Escuchar la respuesta
        ipcRenderer.on('cargar-entidades-financieras', entidadesFinancierasCallback);

        // Manejo de errores de la respuesta
        const errorCallback = (event, errorMessage) => {
            callback({ error: errorMessage });
            // También puedes remover el listener de error si solo lo necesitas una vez
            ipcRenderer.removeListener('error-cargar-entidades-financieras', errorCallback);
        };

        // Escuchar los errores
        ipcRenderer.on('error-cargar-entidades-financieras', errorCallback);
    },

    /* --------------------------------           ------------------------------------------
       -------------------------------- PRODUCTOS ------------------------------------------
       --------------------------------           ------------------------------------------ */
    obtenerProductos: (pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda, callback) => {
        ipcRenderer.send('listar-productos', { pageSize, currentPage, estadoProducto, idCategoriaFiltro, valorBusqueda });
        ipcRenderer.once('cargar-productos', (event, productos) => callback(productos));
    },

    // Método para enviar la información del nuevo usuario al proceso principal para su creación
    crearProducto: (productoData) => ipcRenderer.send('crear-producto', productoData),
    onRespuestaCrearProducto: (callback) => ipcRenderer.on('respuesta-crear-producto', (event, respuesta) => callback(respuesta)),

    eliminarProducto: (id, estado) => ipcRenderer.send('eliminar-producto', id, estado),
    onRespuestaEliminarProducto: (callback) => ipcRenderer.on('respuesta-eliminar-producto', (event, respuesta) => callback(respuesta)),

    obtenerProductoPorId: (id) => ipcRenderer.send('obtener-producto-por-id', id),
    onRespuestaObtenerProductoPorId: (callback) => ipcRenderer.on('respuesta-obtener-producto-por-id', (event, respuesta) => callback(respuesta)),
    

    /* --------------------------------                   ------------------------------------------
       -------------------------------- PUESTO DE TRABAJO ------------------------------------------
       --------------------------------                    ------------------------------------------ */
    obtenerPuestosTrabajo: (pageSize, currentPage, estado, valorBusqueda, callback) => {
        ipcRenderer.send('listar-puestos-trabajo', { pageSize, currentPage, estado, valorBusqueda });
        ipcRenderer.once('cargar-puestos-trabajo', (event, respuesta) => callback(respuesta));
    },
    crearPuesto: (puestoData) => ipcRenderer.send('crear-puesto', puestoData),
    onRespuestaCrearPuesto: (callback) => ipcRenderer.on('respuesta-crear-puesto', (event, respuesta) => callback(respuesta)),
    editarPuesto: (puestoData) => ipcRenderer.send('actualizar-puesto', puestoData),
    onRespuestaActualizarPuesto: (callback) => ipcRenderer.on('respuesta-actualizar-puesto', (event, respuesta) => callback(respuesta)),
    eliminarPuesto: (puestoId, estado) => ipcRenderer.send('eliminar-puesto', puestoId, estado),
    onRespuestaEliminarPuesto: (callback) => ipcRenderer.on('respuesta-eliminar-puesto', (event, respuesta) => callback(respuesta)),

    /* --------------------------------           ------------------------------------------
       --------------------------------  Factura  ------------------------------------------
       --------------------------------           ------------------------------------------ */
    obtenerFacturas: (pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue, callback) => {
        ipcRenderer.send('listar-facturas', { pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue });
        ipcRenderer.once('cargar-facturas', (event, respuesta) => callback(respuesta));
    },

    obtenerFactura: (idFactura, callback) => {
        ipcRenderer.send('listar-productos-por-factura', { idFactura });
        ipcRenderer.once('cargar-productos-por-factura', (event, respuesta) => callback(respuesta));
    },

    actualizarFacturaYProductos: (nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto, facturaData, callback) => {
        ipcRenderer.send('actualizar-factura-y-productos', {nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto, facturaData});
        ipcRenderer.once('factura-actualizada', (event, respuesta) => callback(respuesta));
    },

    printToPDF: () => ipcRenderer.invoke('print-to-pdf'),
    printPDF: (pdfPath) => ipcRenderer.invoke('print-pdf', pdfPath),

    obtenerComprobantesPago: (pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, callback) => {
        ipcRenderer.send('listar-comprobantes-pago', { pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado });
        ipcRenderer.once('cargar-comprobantes-pago', (event, respuesta) => callback(respuesta));
    },
});
