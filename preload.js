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
    obtenerUsuarios: (callback) => {
        ipcRenderer.send('listar-usuarios'); // Enviar el evento al proceso principal
        ipcRenderer.on('cargar-usuarios', (event, usuarios) => callback(usuarios)); // Recibir la respuesta
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
    
});
