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
    onHTMLLoaded: (callback) => ipcRenderer.on('html-cargado', (event, data) => callback(data))
});
