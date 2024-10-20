const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const RolController = require('./controllers/RolController');
const Usuario = require('./domain/Usuario');
const fs = require('fs');
const ColaboradorController = require('./controllers/ColaboradorController');

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

ipcMain.on('listar-usuarios', async (event, { pageSize, pageNumber, estado, idRolFiltro }) => {
    const controller = new UsuarioController();
    try {
        // Llamar al método listarUsuarios con los parámetros recibidos
        const resultado = await controller.listarUsuarios(pageSize, pageNumber, estado, idRolFiltro);

        // Simplificar la lista de usuarios
        const usuariosSimplificados = resultado.usuarios.map(usuario => {
            return {
                idUsuario: usuario.getIdUsuario(),
                nombreUsuario: usuario.getNombreUsuario(),
                idColaborador: usuario.getIdColaborador().getIdColaborador(),
                nombreColaborador: usuario.getIdColaborador().getNombre(),
                primerApellidoColaborador: usuario.getIdColaborador().getPrimerApellido(),
                segundoApellidoColaborador: usuario.getIdColaborador().getSegundoApellido(),
                idRol: usuario.getRol().getIdRol(),
                nombreRol: usuario.getRol().getNombre(),
                estado: usuario.getEstado()
            };
        });

        // Preparar el objeto de respuesta que incluye los usuarios y los datos de paginación
        const respuesta = {
            usuarios: usuariosSimplificados,  // Lista simplificada de usuarios
            paginacion: resultado.pagination  // Datos de paginación devueltos por el controller
        };

        // Enviar los datos de vuelta al frontend
        if (mainWindow) {
            mainWindow.webContents.send('cargar-usuarios', respuesta);
        }

    } catch (error) {
        console.error('Error al listar los usuarios:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-usuarios', 'Hubo un error al cargar los usuarios.');
        }
    }
});


ipcMain.on('actualizar-usuario', async (event, usuarioData) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const usuario = new Usuario();
        usuario.setIdUsuario(usuarioData.idUsuario);
        usuario.setNombreUsuario(usuarioData.nombreUsuario);
        usuario.getRol().setIdRol(usuarioData.roleName);
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

ipcMain.on('eliminar-usuario', async (event, usuarioId) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const usuario = new Usuario();
        usuario.setIdUsuario(usuarioId);

        // Llamar al método de actualizar en el UsuarioController
        const usuarioController = new UsuarioController();
        const resultado = await usuarioController.eliminarUsuario(usuario);

        // Enviar respuesta al frontend
        event.reply('respuesta-eliminar-usuario', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        event.reply('respuesta-eliminar-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('crear-usuario', async (event, usuarioData) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const usuario = new Usuario();
        usuario.setNombreUsuario(usuarioData.nombreUsuario);
        usuario.getRol().setIdRol(usuarioData.rol); // Guarda el id del select con id roleName
        usuario.setPassword(usuarioData.newPassword);

        // Llamar al método de actualizar en el UsuarioController
        const usuarioController = new UsuarioController();
        const resultado = await usuarioController.crearUsuario(usuario);

        // Enviar respuesta al frontend
        event.reply('respuesta-crear-usuario', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al crear usuario:', error);
        event.reply('respuesta-crear-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('listar-roles', async (event) => {
    const rolController = new RolController(); 
    const roles = await rolController.getRoles(); 

    // Crear un nuevo array con objetos simples que solo incluyan las propiedades necesarias
    const rolesSimplificados = roles.map(rol => {
        return {
            id: rol.getIdRol(),
            nombre: rol.getNombre(),
            descripcion: rol.getDescripcion()
        };
    });

    if (mainWindow) {  // Verifica que mainWindow esté definido
        mainWindow.webContents.send('cargar-roles', rolesSimplificados); // Enviar los roles de vuelta al frontend
    }
});

ipcMain.on('listar-colaboradores', async (event) => {
    const colaboradorController = new ColaboradorController(); // Asegúrate de tener acceso a la clase RolesDB
    const colaboradores = await colaboradorController.getColaboradores(); // Asegúrate de que listarRoles es asíncrono

    // Crear un nuevo array con objetos simples que solo incluyan las propiedades necesarias
    const colaboradoresSimplificados = colaboradores.map(colaborador => {
        return {
            idColaborador: colaborador.getIdColaborador(),
            nombreColaborador: colaborador.getNombre(),
            cedulaColaborador: colaborador.getCedula(),
            primerApellidoColaborador: colaborador.getPrimerApellido(),
            segundoApellidoColaborador: colaborador.getSegundoApellido()
        };
    });

    if (mainWindow) {  // Verifica que mainWindow esté definido
        mainWindow.webContents.send('cargar-colaboradores', colaboradoresSimplificados); // Enviar los roles de vuelta al frontend
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

ipcMain.on('listar-categorias', async (event) => {
    const controller = new CategoriaProductoController();
    const categorias = await controller.listarCategorias();
    const categoriasSimplificadas = categorias.map(categoria => {
        return {
            idCategoria: categoria.getIdCategoria(),
            nombreCategoria: categoria.getNombreCategoria(),
            estado: categoria.getEstado()
        };
    });

    if (mainWindow) {  
        mainWindow.webContents.send('cargar-categorias', categoriasSimplificadas);
    }
});

ipcMain.on('actualizar-categoria', async (event, categoriaData) => {
    try {
        const categoria = new Categoria();
        categoria.setIdCategoria(categoriaData.idCategoria);
        categoria.setNombreCategoria(categoriaData.nombreCategoria);

        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.actualizarCategoria(categoria);

        event.reply('respuesta-actualizar-categoria', resultado);
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        event.reply('respuesta-actualizar-categoria', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-categoria', async (event, categoriaId) => {
    try {
        const categoria = new Categoria();
        categoria.setIdCategoria(categoriaId);

        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.eliminarCategoria(categoria);

        event.reply('respuesta-eliminar-categoria', resultado);
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        event.reply('respuesta-eliminar-categoria', { success: false, message: error.message });
    }
});

ipcMain.on('crear-categoria', async (event, categoriaData) => {
    try {
        const categoria = new Categoria();
        categoria.setNombreCategoria(categoriaData.nombreCategoria);

        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.crearCategoria(categoria);

        event.reply('respuesta-crear-categoria', resultado);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        event.reply('respuesta-crear-categoria', { success: false, message: error.message });
    }
});

