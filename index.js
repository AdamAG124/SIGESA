const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Mantener desactivado por seguridad
            contextIsolation: true // Mantener activado por seguridad
        }
    });

    win.loadFile('views/login/login.html');
}

ipcMain.on('login', async (event, { username, password }) => {
  const controller = new UsuarioController();
  const result = await controller.login(username, password);
  event.reply('login-result', result);
});

ipcMain.on('cambiar-vista', (event, view) => {
  const mainWindow = BrowserWindow.getFocusedWindow(); // Obtén la ventana activa
  if (mainWindow) {
      mainWindow.loadFile(`views/dashboard/${view}`).catch(err => console.error('Error al cargar el archivo:', err)); // Carga la nueva vista
  }
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
