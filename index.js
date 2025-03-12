const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const RolController = require('./controllers/RolController');
const DepartamentoController = require('./controllers/DepartamentoController');
const PuestoTrabajoController = require('./controllers/PuestoTrabajoController');
constproductoController = require('./controllers/proproductoController');
const ProveedorController = require('./controllers/ProveedorController');
const CategoriaProductoController = require('./controllers/CategoriaProductoController');
const Usuario = require('./domain/Usuario');
constproducto = require('./domain/proproducto');
const Proveedor = require('./domain/Proveedor')
const CategoriaProducto = require('./domain/CategoriaProducto');
const EntidadFinanciera = require('./domain/EntidadFinanciera');
const EntidadFinancieraController = require('./controllers/EntidadFinancieraController');
const ProductoController = require('./controllers/ProductoController');
// const Producto = require('./domain/Producto');
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

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

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
/* --------------------------------         ------------------------------------------
   -------------------------------- USUARIO ------------------------------------------
   --------------------------------         ------------------------------------------ */
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
                idproproducto: usuario.getIdproproducto().getIdproproducto(),
                nombreproproducto: usuario.getIdproproducto().getNombre(),
                primerApellidoproproducto: usuario.getIdproproducto().getPrimerApellido(),
                segundoApellidoproproducto: usuario.getIdproproducto().getSegundoApellido(),
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
        usuario.getIdproproducto().setIdproproducto(usuarioData.proproducto);
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
/* --------------------------------             ------------------------------------------
   --------------------------------producto ------------------------------------------
   --------------------------------             ------------------------------------------ */
ipcMain.on('listar-proproductoes', async (event, { pageSize, currentPage, estadoproproducto, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda }) => {
    constproductoController = newproductoController();
    try {
        const resultado = awaitproductoController.getproproductoes(pageSize, currentPage, estadoproproducto, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda);

        // En lugar de simplificar los datos, devolver el array completo con todos los atributos
        constproductoesCompletos = resultado.proproductoes.map(proproducto => {
            return {
                idproproducto:producto.getIdproproducto(),
                nombreproproducto:producto.getNombre(),
                cedulaproproducto:producto.getCedula(),
                primerApellidoproproducto:producto.getPrimerApellido(),
                segundoApellidoproproducto:producto.getSegundoApellido(),
                fechaNacimiento:producto.getFechaNacimiento(),
                numTelefono:producto.getNumTelefono(),
                fechaIngreso:producto.getFechaIngreso(),
                fechaSalida:producto.getFechaSalida(),
                estado:producto.getEstado(),
                correo:producto.getCorreo(),
                nombreDepartamento:producto.getIdDepartamento().getNombre(),
                nombrePuesto:producto.getIdPuesto().getNombre()
            };
        });

        // Preparar el objeto de respuesta que incluye losproductoes completos y los datos de paginación
        const respuesta = {
           productoes:productoesCompletos,  // Lista completa deproductoes con todos los atributos
            paginacion: resultado.pagination  // Datos de paginación devueltos por el controller
        };

        if (mainWindow) {  // Verifica que mainWindow esté definido
            mainWindow.webContents.send('cargar-proproductoes', respuesta); // Enviar losproductoes completos al frontend
        }
    } catch (error) {
        console.error('Error al listar losproductoes:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-proproductoes', 'Hubo un error al cargar losproductoes.');
        }
    }
});

ipcMain.on('crear-proproducto', async (event,productoData) => {
    try {
        // Crear un objetoproducto y setear los datos
        constproducto = newproducto();
       producto.getIdDepartamento().setIdDepartamento(proproductoData.idDepartamento); // Asegúrate de que el constructor de Departamento acepte el ID
       producto.getIdPuesto().setIdPuestoTrabajo(proproductoData.idPuesto); // Asegúrate de que el constructor de PuestoTrabajo acepte el ID
       producto.setNombre(proproductoData.nombre);
       producto.setPrimerApellido(proproductoData.primerApellido);
       producto.setSegundoApellido(proproductoData.segundoApellido);
       producto.setFechaNacimiento(proproductoData.fechaNacimiento); // Debe ser una fecha válida
       producto.setNumTelefono(proproductoData.numTelefono);
       producto.setFechaIngreso(proproductoData.fechaIngreso); // Debe ser una fecha válida
       producto.setFechaSalida(proproductoData.fechaSalida); // Debe ser una fecha válida
       producto.setEstado(1); // Debe ser booleano o compatible
       producto.setCorreo(proproductoData.correo);
       producto.setCedula(proproductoData.cedula);

        // Llamar al método insertarproproducto en elproductoController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.insertarproproducto(proproducto);

        // Enviar respuesta al frontend
        event.reply('respuesta-crear-proproducto', resultado); // Pasar el resultado que viene desdeproductoController
    } catch (error) {
        console.error('Error al crearproducto:', error);
        event.reply('respuesta-crear-proproducto', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-proproducto', async (event,productoId, estado) => {
    try {
        // Crear un objeto Usuario y setear los datos
        constproducto = newproducto();
       producto.setIdproproducto(proproductoId);
       producto.setEstado(estado);  // Guarda el estado que viene desde el select con id estado

        // Llamar al método de actualizar en el UsuarioController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.eliminarproproducto(proproducto);

        // Enviar respuesta al frontend
        event.reply('respuesta-eliminar-proproducto', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        event.reply('respuesta-eliminar-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('editar-proproducto', async (event,productoData) => {
    try {
        // Crear un objetoproducto y setear los datos
        constproducto = newproducto();
       producto.setIdproproducto(proproductoData.idproproducto);
       producto.setNombre(proproductoData.nombre);
       producto.setPrimerApellido(proproductoData.primerApellido);
       producto.setSegundoApellido(proproductoData.segundoApellido);
       producto.setFechaNacimiento(proproductoData.fechaNacimiento);
       producto.setNumTelefono(proproductoData.numTelefono);
       producto.setFechaIngreso(proproductoData.fechaIngreso);
       producto.setFechaSalida(proproductoData.fechaSalida);
       producto.setEstado(1);
       producto.setCorreo(proproductoData.correo);
       producto.setCedula(proproductoData.cedula);
       producto.setIdDepartamento(proproductoData.idDepartamento);
       producto.setIdPuesto(proproductoData.idPuesto);

        // Llamar al método de editarproproducto en elproductoController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.editarproproducto(proproducto);

        // Enviar respuesta al frontend
        event.reply('respuesta-actualizar-proproducto', resultado); // Pasar el resultado que viene desdeproductoController
    } catch (error) {
        console.error('Error al editarproducto:', error);
        event.reply('respuesta-editar-proproducto', { success: false, message: error.message });
    }
});
/* --------------------------------              ------------------------------------------
   -------------------------------- DEPARTAMENTO ------------------------------------------
   --------------------------------              ------------------------------------------ */
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
/* --------------------------------                   ------------------------------------------
   -------------------------------- PUESTO DE TRABAJO ------------------------------------------
   --------------------------------                   ------------------------------------------ */
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
/* --------------------------------                    ------------------------------------------
   -------------------------------- CATEGORIA PRODUCTO ------------------------------------------
   --------------------------------                    ------------------------------------------ */
ipcMain.on('listar-categorias', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    try {
        const controller = new CategoriaProductoController(pageSize, currentPage, estado, valorBusqueda);
        const resultado = await controller.listarCategorias(pageSize, currentPage, estado, valorBusqueda);
        const categoriasSimplificadas = resultado.categorias.map(categoria => {
            return {
                idCategoria: categoria.getIdCategoria(),
                nombreCategoria: categoria.getNombre(),
                descripcionCategoria: categoria.getDescripcion(),
                estado: categoria.getEstado()
            };
        });

        const respuesta = {
            categorias: categoriasSimplificadas,  // Lista de puestos de trabajo
            paginacion: resultado.pagination  // Datos de paginación
        };

        if (mainWindow) {
            mainWindow.webContents.send('cargar-categorias', respuesta);
        }
    } catch (error) {
        console.error('Error al listar las categorías de productos:', error);
        mainWindow.webContents.send('error-cargar-puestos-trabajo', 'Hubo un error al cargar las categorías de productos.');
    }
});

ipcMain.on('actualizar-categoria', async (event, categoriaData) => {
    try {
        const categoria = new CategoriaProducto();
        categoria.setIdCategoria(categoriaData.id);
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

ipcMain.on('eliminar-categoria', async (event, categoriaId, estado) => {
    try {
        const categoriaController = new CategoriaProductoController();

        const categoria = new CategoriaProducto();
        categoria.setIdCategoria(categoriaId);
        categoria.setEstado(estado);  // Guardar el estado que viene desde el select con id estado

        const resultado = await categoriaController.eliminarCategoria(categoria);

        event.reply('respuesta-eliminar-categoria', resultado);
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        event.reply('respuesta-eliminar-categoria', { success: false, message: error.message });
    }
});

ipcMain.on('crear-categoria', async (event, categoriaData) => {
    try {
        const categoria = new CategoriaProducto();
        categoria.setNombre(categoriaData.nombre);
        categoria.setDescripcion(categoriaData.descripcion);
        categoria.setEstado(1);  // Por defecto, las categorías se crean con estado activo

        const categoriaController = new CategoriaProductoController();
        const resultado = await categoriaController.crearCategoria(categoria);

        event.reply('respuesta-crear-categoria', resultado);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        event.reply('respuesta-crear-categoria', { success: false, message: error.message });
    }
});
/* --------------------------------           ------------------------------------------
   -------------------------------- PROVEEDOR ------------------------------------------
   --------------------------------           ------------------------------------------ */
ipcMain.on('listar-proveedores', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const controller = new ProveedorController();

    if (typeof currentPage !== 'number' || currentPage <= 0) {
        currentPage = 1;
    }


    try {
        // Llamar al método listarProveedores con los parámetros recibidos
        const resultado = await controller.listarProveedores(pageSize, currentPage, estado, valorBusqueda);

        // Simplificar la lista de proveedores
        const proveedoresSimplificados = resultado.proveedores.map(proveedor => ({
            idProveedor: proveedor.getIdProveedor(),
            nombre: proveedor.getNombre(),
            provincia: proveedor.getProvincia(),
            canton: proveedor.getCanton(),
            distrito: proveedor.getDistrito(),
            direccion: proveedor.getDireccion(),
            estado: proveedor.getEstado()
        }));

        // Preparar el objeto de respuesta que incluye los proveedores y los datos de paginación
        const respuesta = {
            proveedores: proveedoresSimplificados,
            paginacion: resultado.pagination
        };

        // Enviar los datos de vuelta al frontend
        mainWindow?.webContents.send('cargar-proveedores', respuesta);

    } catch (error) {
        console.error('Error al listar los proveedores:', error);
        mainWindow?.webContents.send('error-cargar-proveedores', `Hubo un error al cargar los proveedores: ${error.message}`);
    }
});

ipcMain.on('crear-proveedor', async (event, proveedorData) => {
    try {
        // Crear un objetoproducto y setear los datos
        const proveedor = new Proveedor();
        proveedor.setNombre(proveedorData.nombre);
        proveedor.setProvincia(proveedorData.provincia);
        proveedor.setCanton(proveedorData.canton);
        proveedor.setDistrito(proveedorData.distrito);
        proveedor.setDireccion(proveedorData.direccion);
        proveedor.setEstado(1);

        const proveedorController = new ProveedorController();
        const resultado = await proveedorController.insertarProveedor(proveedor);

        // Enviar respuesta al frontend
        event.reply('respuesta-crear-proveedor', resultado);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        event.reply('respuesta-crear-proveedor', { success: false, message: error.message });
    }
});

ipcMain.on('editar-proveedor', async (event, proveedorData) => {
    try {
        // Crear un objetoproducto y setear los datos
        const proveedor = new Proveedor();
        proveedor.setIdProveedor(proveedorData.idProveedor);
        proveedor.setNombre(proveedorData.nombre);
        proveedor.setProvincia(proveedorData.provincia);
        proveedor.setCanton(proveedorData.canton);
        proveedor.setDistrito(proveedorData.distrito);
        proveedor.setDireccion(proveedorData.direccion);
        proveedor.setEstado(1);

        const proveedorController = new ProveedorController();
        const resultado = await proveedorController.actualizarProveedor(proveedor);

        // Enviar respuesta al frontend
        event.reply('respuesta-actualizar-proveedor', resultado);
    } catch (error) {
        console.error('Error al editar proveedor:', error);
        event.reply('respuesta-editar-proveedor', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-proveedor', async (event, proveedorId, estado) => {
    try {
        const proveedor = new Proveedor();
        proveedor.setIdProveedor(proveedorId);
        proveedor.setEstado(estado);

        const proveedorController = new ProveedorController();
        const resultado = await proveedorController.eliminarProveedor(proveedor);

        // Enviar respuesta al frontend
        event.reply('respuesta-eliminar-proveedor', resultado);
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        event.reply('respuesta-eliminar-proveedor', { success: false, message: error.message });
    }
});
/* --------------------------------                   ------------------------------------------
   -------------------------------- PUESTO DE TRABAJO ------------------------------------------
   --------------------------------                   ------------------------------------------ */
ipcMain.on('listar-puestos-trabajo', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const puestoTrabajoController = new PuestoTrabajoController();

    try {
        const resultado = await puestoTrabajoController.getPuestos(pageSize, currentPage, estado, valorBusqueda);

        const puestosCompletos = resultado.puestos.map(puesto => ({
            idPuestoTrabajo: puesto.getIdPuestoTrabajo(),
            nombrePuestoTrabajo: puesto.getNombre(),
            descripcionPuestoTrabajo: puesto.getDescripcion(),
            estado: puesto.getEstado()
        }));

        const respuesta = {
            puestos: puestosCompletos,
            paginacion: resultado.pagination
        };

        event.reply('cargar-puestos-trabajo', respuesta);
    } catch (error) {
        console.error('Error al listar los puestos de trabajo:', error);
        event.reply('error-cargar-puestos-trabajo', 'Hubo un error al listar los puestos de trabajo.');
    }
});

ipcMain.on('crear-puesto', async (event, puestoData) => {
    try {
        const puesto = new PuestoTrabajo();
        puesto.setNombre(puestoData.nombre);
        puesto.setDescripcion(puestoData.descripcion);
        puesto.setEstado(puestoData.estado);

        const puestoTrabajoController = new PuestoTrabajoController();
        const resultado = await puestoTrabajoController.insertarPuesto(puesto);

        event.reply('respuesta-crear-puesto', resultado);
    } catch (error) {
        console.error('Error al crear puesto:', error);
        event.reply('respuesta-crear-puesto', { success: false, message: error.message });
    }
});

ipcMain.on('actualizar-puesto', async (event, puestoData) => {
    try {
        const puesto = new PuestoTrabajo();
        puesto.setIdPuestoTrabajo(puestoData.idPuestoTrabajo);
        puesto.setNombre(puestoData.nombre);
        puesto.setDescripcion(puestoData.descripcion);
        puesto.setEstado(puestoData.estado);

        const puestoTrabajoController = new PuestoTrabajoController();
        const resultado = await puestoTrabajoController.editarPuesto(puesto);

        event.reply('respuesta-actualizar-puesto', resultado);
    } catch (error) {
        console.error('Error al actualizar puesto:', error);
        event.reply('respuesta-actualizar-puesto', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-puesto', async (event, puestoId, estado) => {
    try {
        const puesto = new PuestoTrabajo();
        puesto.setIdPuestoTrabajo(puestoId);
        puesto.setEstado(estado);

        const puestoTrabajoController = new PuestoTrabajoController();
        const resultado = await puestoTrabajoController.eliminarPuesto(puesto);

        event.reply('respuesta-eliminar-puesto', resultado);
    } catch (error) {
        console.error('Error al eliminar puesto:', error);
        event.reply('respuesta-eliminar-puesto', { success: false, message: error.message });
    }
});
/* --------------------------------                    ------------------------------------------
   -------------------------------- ENTIDAD FINANCIERA ------------------------------------------
   --------------------------------                    ------------------------------------------ */
ipcMain.on('listar-entidades-financieras', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const controller = new EntidadFinancieraController();

    if (typeof currentPage !== 'number' || currentPage <= 0) {
        currentPage = 1;
    }


    try {
        // Llamar al método listarProveedores con los parámetros recibidos
        const resultado = await controller.listarEntidadesFinancieras(pageSize, currentPage, estado, valorBusqueda);

        // Simplificar la lista de proveedores
        const entidadesFinancierasSimplificadas = resultado.entidadesFinancieras.map(entidadFinanciera => ({
            idEntidadFinanciera: entidadFinanciera.getIdEntidadFinanciera(),
            nombre: entidadFinanciera.getNombre(),
            tipo: entidadFinanciera.getTipo(),
            estado: entidadFinanciera.getEstado()
        }));

        // Preparar el objeto de respuesta que incluye los proveedores y los datos de paginación
        const respuesta = {
            entidadesFinancieras: entidadesFinancierasSimplificadas,
            paginacion: resultado.pagination
        };

        // Enviar los datos de vuelta al frontend
        mainWindow?.webContents.send('cargar-entidades-financieras', respuesta);

    } catch (error) {
        console.error('Error al listar las entidades financieras:', error);
        mainWindow?.webContents.send('error-cargar-entidades-financieras', `Hubo un error al cargar las entidades financieras: ${error.message}`);
    }
});


ipcMain.on('listar-productos', async (event, { pageSize, currentPage, estado, idCategoriaFiltro, valorBusqueda }) => {
    const productoController = new ProductoController();
    try {
        const resultado = await productoController.getProductos(pageSize, currentPage, estado, idCategoriaFiltro, valorBusqueda);

        const productosCompletos = resultado.productos.map(producto => {
            return {
                idProducto: producto.getIdProducto(),
                nombreProducto: producto.getDescripcion(), 
                cantidad: producto.getCantidad(),
                unidadMedicion: producto.getUnidadMedicion(), 
                estadoProducto: producto.getEstado(), 
                idCategoria: producto.getCategoria().getIdCategoria(), 
                nombreCategoria: producto.getCategoria().getNombre(), 
                descripcionCategoria: producto.getCategoria().getDescripcion(),
                estadoCategoria: producto.getCategoria().getEstado()
            };
        });

        const respuesta = {
           productos:productosCompletos, 
            paginacion: resultado.pagination  
        };

        if (mainWindow) {  
            mainWindow.webContents.send('cargar-productos', respuesta);
        }
    } catch (error) {
        console.error('Error al listar los productos:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-productos', 'Hubo un error al cargar los productos.');
        }
    }
});