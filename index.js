const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const fs = require('fs');

async function getStore() {
    const { default: Store } = await import('electron-store');
    return new Store();
}

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Mantener desactivado por seguridad
            contextIsolation: true // Mantener activado por seguridad
        }
    });

    win.loadFile('views/login/login.html'); // Vista de inicio por defecto (login)

    // Verificar si hay un usuario almacenado en electron-store
    const store = await getStore();
    const usuarioGuardado = store.get('usuario');

    if (usuarioGuardado) {
        // Si existe un usuario almacenado, cambiar a la vista del dashboard
        win.loadFile('views/dashboard/dashboard.html').then(() => {
            win.webContents.send('datos-usuario', usuarioGuardado); // Enviar los datos cuando carga la vista
        });

        // Volver a enviar los datos del usuario cuando se recargue la página
        win.webContents.on('did-finish-load', () => {
            win.webContents.send('datos-usuario', usuarioGuardado); // Volver a enviar al recargar
        });
    }
};
ipcMain.on('login', async (event, { username, password }) => {
    const controller = new UsuarioController();
    const result = await controller.login(username, password);
    event.reply('login-result', result);
});

ipcMain.on('logout', async (event) => {
    try {
        // Elimina los datos del usuario almacenados en store
        const store = await getStore();
        store.delete('usuario');

        // Si la eliminación es exitosa, enviamos un JSON con éxito
        event.reply('logout-response', {
            success: true,
            message: 'Sesión cerrada con éxito.',
            view: 'login/login.html'
        });
    } catch (error) {
        // En caso de que ocurra algún error, enviamos un JSON con el error
        event.reply('logout-response', {
            success: false,
            message: 'Error al cerrar la sesión. ' + error.message
        });
    }
});

ipcMain.on('cambiar-vista', async (event, result) => {
    const mainWindow = BrowserWindow.getFocusedWindow(); // Obtén la ventana activa
    if (mainWindow) {
        mainWindow.loadFile(`views/${result.view}`)
          .then(async () => {
              // Después de cargar la nueva vista, guarda el usuario
              const store = await getStore();
              store.set('usuario', result.usuario);

              // Envía los datos de usuario al renderizado
              mainWindow.webContents.send('datos-usuario', store.get('usuario'));
          })
          .catch(err => console.error('Error al cargar el archivo:', err)); // Manejar error al cargar archivo
    }
});

ipcMain.on('leer-html', (event, filePath) => {
    const fullPath = path.join(__dirname, 'views', filePath); // Construir la ruta completa del archivo
    fs.readFile(fullPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo HTML:', err);
            return;
        }
        // Enviar el contenido HTML de vuelta al proceso de renderizado
        event.sender.send('html-cargado', data);
    });
});

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
