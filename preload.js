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
    onHTMLLoaded: (callback) => ipcRenderer.on('html-cargado', (event, data) => callback(data)),

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
    eliminarUsuario: (usuarioId) => ipcRenderer.send('eliminar-usuario', usuarioId),
    // Recibir la respuesta de la eliminación del usuario
    onRespuestaEliminarUsuario: (callback) => ipcRenderer.on('respuesta-eliminar-usuario', (event, respuesta) => callback(respuesta)),
    // Método para enviar la información del nuevo usuario al proceso principal para su creación
    crearUsuario: (usuarioData) => ipcRenderer.send('crear-usuario', usuarioData),
    // Recibir la respuesta de la creación del usuario
    onRespuestaCrearUsuario: (callback) => ipcRenderer.on('respuesta-crear-usuario', (event, respuesta) => callback(respuesta)),

    obtenerColaboradores: (callback) => {
        ipcRenderer.send('listar-colaboradores'); // Enviar el evento al proceso principal
        ipcRenderer.on('cargar-colaboradores', (event, colaboradores) => callback(colaboradores)); // Recibir la respuesta
    },

        // Métodos para gestionar categorías
    obtenerCategorias: (callback) => {
        ipcRenderer.send('listar-categorias'); // Enviar el evento al proceso principal
        ipcRenderer.on('cargar-categorias', (event, categorias) => callback(categorias)); // Recibir la respuesta
    },

    // Método para enviar la información del nuevo usuario al proceso principal para su creación
    crearCategoria: (categoriaData) => ipcRenderer.send('crear-categoria', categoriaData),
    // Recibir la respuesta de la creación de la categoría
    onRespuestaCrearCategoria: (callback) => {
        ipcRenderer.on('respuesta-crear-categoria', (event, respuesta) => callback(respuesta));
    },

    // Método para enviar los datos de edición de categoría al proceso principal
    actualizarCategoria: (categoriaData) => ipcRenderer.send('actualizar-categoria', categoriaData),
    // Recibir la respuesta de la actualización de la categoría
    onRespuestaActualizarCategoria: (callback) => {
        ipcRenderer.on('respuesta-actualizar-categoria', (event, respuesta) => callback(respuesta));
    },

    // Método para enviar el id de categoría al proceso principal para su eliminación
    eliminarCategoria: (categoriaId) => ipcRenderer.send('eliminar-categoria', categoriaId),
    // Recibir la respuesta de la eliminación de la categoría
    onRespuestaEliminarCategoria: (callback) => {
        ipcRenderer.on('respuesta-eliminar-categoria', (event, respuesta) => callback(respuesta));
    },

        
    });
