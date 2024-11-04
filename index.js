const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const RolController = require('./controllers/RolController');
const Usuario = require('./domain/Usuario');
const fs = require('fs');
const ColaboradorController = require('./controllers/ColaboradorController');
const Colaborador = require('./domain/Colaborador');
const DepartamentoController = require('./controllers/DepartamentoController');
const PuestoTrabajoController = require('./controllers/PuestoTrabajoController');

const CategoriaProductoController = require('./controllers/CategoriaProductoController');
const CategoriaProducto = require('./domain/CategoriaProducto');

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
            // Enviar un mensaje de error al proceso de renderizado
            event.sender.send('html-cargado', { error: 'Error al leer el archivo HTML' });
            return;
        }

        // Enviar el contenido HTML de vuelta al proceso de renderizado
        event.sender.send('html-cargado', data);
    });
});


ipcMain.on('listar-usuarios', async (event, { pageSize, pageNumber, estado, idRolFiltro, valorBusqueda }) => {
    const controller = new UsuarioController();
    try {
        // Llamar al método listarUsuarios con los parámetros recibidos
        const resultado = await controller.listarUsuarios(pageSize, pageNumber, estado, idRolFiltro, valorBusqueda);

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

ipcMain.on('eliminar-usuario', async (event, usuarioId, estado) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const usuario = new Usuario();
        usuario.setIdUsuario(usuarioId);
        usuario.setEstado(estado);  // Guarda el estado que viene desde el select con id estado

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
        usuario.getIdColaborador().setIdColaborador(usuarioData.colaborador);
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

ipcMain.on('listar-colaboradores', async (event, { pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda }) => {
    const colaboradorController = new ColaboradorController();
    try {
        const resultado = await colaboradorController.getColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);

        // En lugar de simplificar los datos, devolver el array completo con todos los atributos
        const colaboradoresCompletos = resultado.colaboradores.map(colaborador => {
            return {
                idColaborador: colaborador.getIdColaborador(),
                nombreColaborador: colaborador.getNombre(),
                cedulaColaborador: colaborador.getCedula(),
                primerApellidoColaborador: colaborador.getPrimerApellido(),
                segundoApellidoColaborador: colaborador.getSegundoApellido(),
                fechaNacimiento: colaborador.getFechaNacimiento(),
                numTelefono: colaborador.getNumTelefono(),
                fechaIngreso: colaborador.getFechaIngreso(),
                fechaSalida: colaborador.getFechaSalida(),
                estado: colaborador.getEstado(),
                correo: colaborador.getCorreo(),
                nombreDepartamento: colaborador.getIdDepartamento().getNombre(),
                nombrePuesto: colaborador.getIdPuesto().getNombre()
            };
        });

        // Preparar el objeto de respuesta que incluye los colaboradores completos y los datos de paginación
        const respuesta = {
            colaboradores: colaboradoresCompletos,  // Lista completa de colaboradores con todos los atributos
            paginacion: resultado.pagination  // Datos de paginación devueltos por el controller
        };

        if (mainWindow) {  // Verifica que mainWindow esté definido
            mainWindow.webContents.send('cargar-colaboradores', respuesta); // Enviar los colaboradores completos al frontend
        }
    } catch (error) {
        console.error('Error al listar los colaboradores:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-colaboradores', 'Hubo un error al cargar los colaboradores.');
        }
    }
});

ipcMain.on('crear-colaborador', async (event, colaboradorData) => {
    try {
        // Crear un objeto Colaborador y setear los datos
        const colaborador = new Colaborador();
        colaborador.getIdDepartamento().setIdDepartamento(colaboradorData.idDepartamento); // Asegúrate de que el constructor de Departamento acepte el ID
        colaborador.getIdPuesto().setIdPuestoTrabajo(colaboradorData.idPuesto); // Asegúrate de que el constructor de PuestoTrabajo acepte el ID
        colaborador.setNombre(colaboradorData.nombre);
        colaborador.setPrimerApellido(colaboradorData.primerApellido);
        colaborador.setSegundoApellido(colaboradorData.segundoApellido);
        colaborador.setFechaNacimiento(colaboradorData.fechaNacimiento); // Debe ser una fecha válida
        colaborador.setNumTelefono(colaboradorData.numTelefono);
        colaborador.setFechaIngreso(colaboradorData.fechaIngreso); // Debe ser una fecha válida
        colaborador.setFechaSalida(colaboradorData.fechaSalida); // Debe ser una fecha válida
        colaborador.setEstado(1); // Debe ser booleano o compatible
        colaborador.setCorreo(colaboradorData.correo);
        colaborador.setCedula(colaboradorData.cedula);

        // Llamar al método insertarColaborador en el ColaboradorController
        const colaboradorController = new ColaboradorController();
        const resultado = await colaboradorController.insertarColaborador(colaborador);

        // Enviar respuesta al frontend
        event.reply('respuesta-crear-colaborador', resultado); // Pasar el resultado que viene desde ColaboradorController
    } catch (error) {
        console.error('Error al crear colaborador:', error);
        event.reply('respuesta-crear-colaborador', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-colaborador', async (event, colaboradorId, estado) => {
    try {
        // Crear un objeto Usuario y setear los datos
        const colaborador = new Colaborador();
        colaborador.setIdColaborador(colaboradorId);
        colaborador.setEstado(estado);  // Guarda el estado que viene desde el select con id estado

        // Llamar al método de actualizar en el UsuarioController
        const colaboradorController = new ColaboradorController();
        const resultado = await colaboradorController.eliminarColaborador(colaborador);

        // Enviar respuesta al frontend
        event.reply('respuesta-eliminar-colaborador', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        event.reply('respuesta-eliminar-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('editar-colaborador', async (event, colaboradorData) => {
    try {
        // Crear un objeto Colaborador y setear los datos
        const colaborador = new Colaborador();
        colaborador.setIdColaborador(colaboradorData.idColaborador);
        colaborador.setNombre(colaboradorData.nombre);
        colaborador.setPrimerApellido(colaboradorData.primerApellido);
        colaborador.setSegundoApellido(colaboradorData.segundoApellido);
        colaborador.setFechaNacimiento(colaboradorData.fechaNacimiento);
        colaborador.setNumTelefono(colaboradorData.numTelefono);
        colaborador.setFechaIngreso(colaboradorData.fechaIngreso);
        colaborador.setFechaSalida(colaboradorData.fechaSalida);
        colaborador.setEstado(1);
        colaborador.setCorreo(colaboradorData.correo);
        colaborador.setCedula(colaboradorData.cedula);
        colaborador.setIdDepartamento(colaboradorData.idDepartamento);
        colaborador.setIdPuesto(colaboradorData.idPuesto);

        // Llamar al método de editarColaborador en el ColaboradorController
        const colaboradorController = new ColaboradorController();
        const resultado = await colaboradorController.editarColaborador(colaborador);

        // Enviar respuesta al frontend
        event.reply('respuesta-actualizar-colaborador', resultado); // Pasar el resultado que viene desde ColaboradorController
    } catch (error) {
        console.error('Error al editar colaborador:', error);
        event.reply('respuesta-editar-colaborador', { success: false, message: error.message });
    }
});

ipcMain.on('listar-departamentos', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const departamentoController = new DepartamentoController();
    try {
        const resultado = await departamentoController.listarDepartamentos(pageSize, currentPage, estado, valorBusqueda);

        // Serializar los datos de los departamentos manualmente, asegurándote de que todo es serializable
        const departamentosCompletos = resultado.departamentos.map(departamento => ({
            idDepartamento: departamento.getIdDepartamento(),
            nombreDepartamento: departamento.getNombre(),
            descripcionDepartamento: departamento.getDescripcion(),
            estado: departamento.getEstado()
        }));

        const respuesta = {
            departamentos: departamentosCompletos,
            paginacion: resultado.pagination
        };

        event.reply('cargar-departamentos', respuesta);  // Usar event.reply en lugar de webContents.send
    } catch (error) {
        console.error('Error al listar los departamentos:', error);
        event.reply('error-cargar-departamentos', 'Hubo un error al cargar los departamentos.');
    }
});

ipcMain.on('listar-puestos-trabajo', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const puestoTrabajoController = new PuestoTrabajoController();

    try {
        const resultado = await puestoTrabajoController.getPuestosTrabajo(pageSize, currentPage, estado, valorBusqueda);

        // Serializar los datos de los puestos de trabajo manualmente para asegurarse de que todo es serializable
        const puestosCompletos = resultado.puestos.map(puesto => ({
            idPuestoTrabajo: puesto.getIdPuestoTrabajo(),
            nombrePuestoTrabajo: puesto.getNombre(),
            descripcionPuestoTrabajo: puesto.getDescripcion(),
            estado: puesto.getEstado()
        }));

        const respuesta = {
            puestos: puestosCompletos,  // Lista de puestos de trabajo
            paginacion: resultado.pagination  // Datos de paginación
        };

        event.reply('cargar-puestos-trabajo', respuesta);  // Enviar la respuesta de vuelta al cliente
    } catch (error) {
        console.error('Error al listar los puestos de trabajo:', error);
        event.reply('error-cargar-puestos-trabajo', 'Hubo un error al cargar los puestos de trabajo.');
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


ipcMain.on('listar-categorias', async (event, { pageSize, currentPage, estadoCategoria, valorBusqueda }) => {
    const controller = new CategoriaProductoController();
    const categorias = await controller.listarCategorias(pageSize, currentPage, estadoCategoria, valorBusqueda);
    const categoriasSimplificadas = categorias.map(categoria => {
        return {
            idCategoria: categoria.getIdCategoria(),
            nombre: categoria.getNombre(),
            descripcion: categoria.getDescripcion(),
            estado: categoria.getEstado()
        };
    });

    if (mainWindow) {
        mainWindow.webContents.send('cargar-categorias', categoriasSimplificadas);
    }
});

ipcMain.on('crear-categoria', async (event, categoriaData) => {
    try {
        const categoria = new CategoriaProducto();
        categoria.setNombre(categoriaData.nombre);
        categoria.setDescripcion(categoriaData.descripcion);

        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.crearCategoria(categoria);

        event.reply('respuesta-crear-categoria', resultado);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        event.reply('respuesta-crear-categoria', { success: false, message: error.message });
    }
});

ipcMain.on('actualizar-categoria', async (event, categoriaData) => {
    try {
        const categoria = new CategoriaProducto();
        categoria.setIdCategoria(categoriaData.idCategoria);
        categoria.setNombre(categoriaData.nombre);
        categoria.setDescripcion(categoriaData.descripcion);

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
        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.eliminarCategoria(categoriaId);

        event.reply('respuesta-eliminar-categoria', resultado);
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        event.reply('respuesta-eliminar-categoria', { success: false, message: error.message });
    }
});


