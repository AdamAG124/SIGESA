const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const RolesController = require('./controllers/RolesController');
const fs = require('fs');

let mainWindow;  // Declarar mainWindow a nivel global

async function getStore() {
    const { default: Store } = await import('electron-store');
    return new Store();
}

const createWindow = async () => {
    mainWindow = new BrowserWindow({  // Asignar la ventana creada a mainWindow
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Mantener desactivado por seguridad
            contextIsolation: true // Mantener activado por seguridad
        }
    });

    mainWindow.loadFile('views/login/login.html'); // Vista de inicio por defecto (login)

    // Verificar si hay un usuario almacenado en electron-store
    const store = await getStore();
    const usuarioGuardado = store.get('usuario');

    if (usuarioGuardado) {
        // Si existe un usuario almacenado, cambiar a la vista del dashboard
        mainWindow.loadFile('views/dashboard/dashboard.html').then(() => {
            mainWindow.webContents.send('datos-usuario', usuarioGuardado); // Enviar los datos cuando carga la vista
        });

        // Volver a enviar los datos del usuario cuando se recargue la página
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('datos-usuario', usuarioGuardado); // Volver a enviar al recargar
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

ipcMain.on('listar-usuarios', async (event) => {
    const controller = new UsuarioController();
    const usuarios = await controller.listarUsuarios(); // Asegúrate de que listarUsuarios es asíncrono
    // Crear un nuevo array con objetos simples que solo incluyan las propiedades necesarias
    const usuariosSimplificados = usuarios.map(usuario => {
        //console.log(usuario.getRole().getIdRole());
        return {
            idUsuario: usuario.getIdUsuario(),
            nombreUsuario: usuario.getNombreUsuario(),
            nombreColaborador: usuario.getIdColaborador().getNombre(),
            primerApellidoColaborador: usuario.getIdColaborador().getPrimerApellido(),
            segundoApellidoColaborador: usuario.getIdColaborador().getSegundoApellido(),
            role: usuario.getRole().getIdRole(),
            roleName: usuario.getRole().getRoleName(),
            nombreUsuario: usuario.getNombreUsuario(),
            estado: usuario.getEstado()
        };
    });
    //alert(usuarios.getNombreUsuario());
    if (mainWindow) {  // Verifica que mainWindow esté definido
        mainWindow.webContents.send('cargar-usuarios', usuariosSimplificados); // Enviar los usuarios de vuelta al frontend
    }
});

ipcMain.on('actualizar-usuario', async (event, usuarioData) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const usuario = new Usuario();
        usuario.setIdUsuario(usuarioData.idUsuario);
        usuario.setNombreUsuario(usuarioData.nombreUsuario);
        usuario.getRole().setIdRole(usuarioData.rolName);
        usuario.setPassword(usuarioData.newPassword);

        // Llamar al método de actualizar en el UsuarioController
        const usuarioController = new UsuarioController();
        const resultado = await usuarioController.actualizarUsuario(usuario);

        // Enviar respuesta al frontend
        event.reply('respuesta-actualizar-usuario', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        event.reply('respuesta-actualizar-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('listar-roles', async (event) => {
    const rolesController = new RolesController(); // Asegúrate de tener acceso a la clase RolesDB
    const roles = await rolesController.getRoles(); // Asegúrate de que listarRoles es asíncrono

    // Crear un nuevo array con objetos simples que solo incluyan las propiedades necesarias
    const rolesSimplificados = roles.map(rol => {
        return {
            idRole: rol.getIdRole(),
            roleName: rol.getRoleName(),
            roleDescription: rol.getRoleDescription()
        };
    });

    if (mainWindow) {  // Verifica que mainWindow esté definido
        mainWindow.webContents.send('cargar-roles', rolesSimplificados); // Enviar los roles de vuelta al frontend
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
