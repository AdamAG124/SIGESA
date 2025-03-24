const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const UsuarioController = require('./controllers/UsuarioController');
const RolController = require('./controllers/RolController');
const DepartamentoController = require('./controllers/DepartamentoController');
const PuestoTrabajoController = require('./controllers/PuestoTrabajoController');
const ProductoController = require('./controllers/ProductoController');
const ProveedorController = require('./controllers/ProveedorController');
const CategoriaProductoController = require('./controllers/CategoriaProductoController');
const Usuario = require('./domain/Usuario');
const Producto = require('./domain/Producto');
const Proveedor = require('./domain/Proveedor')
const CategoriaProducto = require('./domain/CategoriaProducto');
const EntidadFinanciera = require('./domain/EntidadFinanciera');
const EntidadFinancieraController = require('./controllers/EntidadFinancieraController');
const ColaboradorController = require('./controllers/ColaboradorController');
const Colaborador = require('./domain/Colaborador');
const SalidaController = require('./controllers/SalidaController');
const SalidaProductoController = require('./controllers/SalidaProductoController');
const FacturaController = require('./controllers/FacturaController');
const FacturaProductoController = require('./controllers/FacturaProductoController');
const ComprobantePagoController = require('./controllers/ComprobantePagoController');
const os = require('os')
const { shell } = require('electron')
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

ipcMain.on('crear-producto', async (event, productoData) => {
    try {
        // Crear un objetoproducto y setear los datos
        constproducto = newproducto();
        producto.getIdDepartamento().setIdDepartamento(productoData.idDepartamento); // Asegúrate de que el constructor de Departamento acepte el ID
        producto.getIdPuesto().setIdPuestoTrabajo(productoData.idPuesto); // Asegúrate de que el constructor de PuestoTrabajo acepte el ID
        producto.setNombre(productoData.nombre);
        producto.setPrimerApellido(productoData.primerApellido);
        producto.setSegundoApellido(productoData.segundoApellido);
        producto.setFechaNacimiento(productoData.fechaNacimiento); // Debe ser una fecha válida
        producto.setNumTelefono(productoData.numTelefono);
        producto.setFechaIngreso(productoData.fechaIngreso); // Debe ser una fecha válida
        producto.setFechaSalida(productoData.fechaSalida); // Debe ser una fecha válida
        producto.setEstado(1); // Debe ser booleano o compatible
        producto.setCorreo(productoData.correo);
        producto.setCedula(productoData.cedula);

        // Llamar al método insertarproducto en elproductoController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.insertarproducto(producto);

        // Enviar respuesta al frontend
        event.reply('respuesta-crear-producto', resultado); // Pasar el resultado que viene desdeproductoController
    } catch (error) {
        console.error('Error al crearproducto:', error);
        event.reply('respuesta-crear-producto', { success: false, message: error.message });
    }
});

ipcMain.on('eliminar-producto', async (event, productoId, estado) => {
    try {
        // Crear un objeto Usuario y setear los datos
        constproducto = newproducto();
        producto.setIdproducto(productoId);
        producto.setEstado(estado);  // Guarda el estado que viene desde el select con id estado

        // Llamar al método de actualizar en el UsuarioController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.eliminarproducto(producto);

        // Enviar respuesta al frontend
        event.reply('respuesta-eliminar-producto', resultado); // Pasar el resultado que viene desde UsuarioController
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        event.reply('respuesta-eliminar-usuario', { success: false, message: error.message });
    }
});

ipcMain.on('editar-producto', async (event, productoData) => {
    try {
        // Crear un objetoproducto y setear los datos
        constproducto = newproducto();
        producto.setIdproducto(productoData.idproducto);
        producto.setNombre(productoData.nombre);
        producto.setPrimerApellido(productoData.primerApellido);
        producto.setSegundoApellido(productoData.segundoApellido);
        producto.setFechaNacimiento(productoData.fechaNacimiento);
        producto.setNumTelefono(productoData.numTelefono);
        producto.setFechaIngreso(productoData.fechaIngreso);
        producto.setFechaSalida(productoData.fechaSalida);
        producto.setEstado(1);
        producto.setCorreo(productoData.correo);
        producto.setCedula(productoData.cedula);
        producto.setIdDepartamento(productoData.idDepartamento);
        producto.setIdPuesto(productoData.idPuesto);

        // Llamar al método de editarproducto en elproductoController
        constproductoController = newproductoController();
        const resultado = awaitproductoController.editarproducto(producto);

        // Enviar respuesta al frontend
        event.reply('respuesta-actualizar-producto', resultado); // Pasar el resultado que viene desdeproductoController
    } catch (error) {
        console.error('Error al editarproducto:', error);
        event.reply('respuesta-editar-producto', { success: false, message: error.message });
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
        const resultado = await puestoTrabajoController.getPuestos(pageSize, currentPage, estado, valorBusqueda);

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

/* --------------------------------          ------------------------------------------
   -------------------------------- PRODUCTO ------------------------------------------
   --------------------------------          ------------------------------------------ */
ipcMain.on('listar-productos', async (event, { pageSize, currentPage, estado, idCategoriaFiltro, valorBusqueda }) => {
    const productoController = new ProductoController();
    try {
        const resultado = await productoController.getProductos(pageSize, currentPage, estado, idCategoriaFiltro, valorBusqueda);

        const productosCompletos = resultado.productos.map(producto => {
            return {
                idProducto: producto.getIdProducto(),
                nombreProducto: producto.getNombre(),
                descripcionProducto: producto.getDescripcion(),
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
            productos: productosCompletos,
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

/* --------------------------------                    ------------------------------------------
   --------------------------------       Factura      ------------------------------------------
   --------------------------------                    ------------------------------------------ */

ipcMain.on('listar-facturas', async (event, { pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue }) => {
    const facturaController = new FacturaController();
    try {
        const resultado = await facturaController.listarFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue);

        const facturasCompletas = resultado.facturas.map(factura => {
            return {
                idFactura: factura.getIdFactura(),
                numeroFactura: factura.getNumeroFactura(),
                fechaFactura: factura.getFechaFactura(),
                detallesAdicionales: factura.getDetallesAdicionales(),
                impuesto: factura.getImpuesto(),
                descuento: factura.getDescuento(),
                estadoFactura: factura.getEstado(),
                idProveedor: factura.getIdProveedor().getIdProveedor(),
                nombreProveedor: factura.getIdProveedor().getNombre(),
                idComprobantePago: factura.getIdComprobante().getIdComprobantePago(),
                numeroComprobantePago: factura.getIdComprobante().getNumero()
            };
        });

        const respuesta = {
            facturas: facturasCompletas,
            paginacion: resultado.pagination
        };

        if (mainWindow) {
            mainWindow.webContents.send('cargar-facturas', respuesta);
        }
    } catch (error) {
        console.error('Error al listar las facturas:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-facturas', 'Hubo un error al cargar las facturas.');
        }
    }
});

ipcMain.on('listar-productos-por-factura', async (event, { idFactura }) => {
    const facturaProductoController = new FacturaProductoController();
    try {
        // Llamar al método del controlador
        const resultado = await facturaProductoController.obtenerFacturaProductos(idFactura);

        // Mapear los objetos FacturaProducto a un formato plano para enviar al frontend
        const productosCompletos = resultado.map(facturaProducto => {
            return {
                idFacturaProducto: facturaProducto.getIdFacturaProducto(),
                idFactura: facturaProducto.getIdFactura().getIdFactura(),
                numeroFactura: facturaProducto.getIdFactura().getNumeroFactura(),
                fechaFactura: facturaProducto.getIdFactura().getFechaFactura(),
                detallesAdicionales: facturaProducto.getIdFactura().getDetallesAdicionales(),
                impuesto: facturaProducto.getIdFactura().getImpuesto(),
                descuento: facturaProducto.getIdFactura().getDescuento(),
                estadoFactura: facturaProducto.getIdFactura().getEstado(),
                nombreProveedor: facturaProducto.getIdFactura().getIdProveedor().getNombre(),
                numeroComprobantePago: facturaProducto.getIdFactura().getIdComprobante().getNumero(),
                idProducto: facturaProducto.getIdProducto().getIdProducto(),
                nombreProducto: facturaProducto.getIdProducto().getNombre(),
                descripcionProducto: facturaProducto.getIdProducto().getDescripcion(),
                cantidadTotalProducto: facturaProducto.getIdProducto().getCantidad(),
                unidadMedicion: facturaProducto.getIdProducto().getUnidadMedicion(),
                estadoProducto: facturaProducto.getIdProducto().getEstado(),
                cantidadAnterior: facturaProducto.getCantidadAnterior(),
                cantidadEntrando: facturaProducto.getCantidadEntrando(),
                precioNueva: facturaProducto.getPrecioNuevo(),
                idUsuario: facturaProducto.getIdUsuario().getIdUsuario(),
                nombreUsuario: facturaProducto.getIdUsuario().getNombreUsuario(),
                estadoUsuario: facturaProducto.getIdUsuario().getEstado(),
                nombreColaborador: facturaProducto.getIdUsuario().getIdColaborador().getNombre(),
                primerApellido: facturaProducto.getIdUsuario().getIdColaborador().getPrimerApellido(),
                segundoApellido: facturaProducto.getIdUsuario().getIdColaborador().getSegundoApellido(),
                estadoColaborador: facturaProducto.getIdUsuario().getIdColaborador().getEstado(),
                correoColaborador: facturaProducto.getIdUsuario().getIdColaborador().getCorreo(),
                cedulaColaborador: facturaProducto.getIdUsuario().getIdColaborador().getCedula(),
                nombreDepartamento: facturaProducto.getIdUsuario().getIdColaborador().getIdDepartamento().getNombre(),
                nombrePuesto: facturaProducto.getIdUsuario().getIdColaborador().getIdPuesto().getNombre(),
                numTelefono: facturaProducto.getIdUsuario().getIdColaborador().getNumTelefono(),
                estadoFacturaProducto: facturaProducto.getEstado()
            };
        });

        // Construir la respuesta (solo el array de productos, sin paginación)
        const respuesta = {
            productos: productosCompletos
        };

        // Enviar la respuesta al proceso de renderizado
        if (mainWindow) {
            mainWindow.webContents.send('cargar-productos-por-factura', respuesta);
        }
    } catch (error) {
        console.error('Error al listar los productos de la factura:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-productos-por-factura', 'Hubo un error al cargar los productos de la factura.');
        }
    }
});

ipcMain.handle('print-to-pdf', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    // Configuración para el PDF
    const options = {
        printBackground: true,
        margins: {
            marginType: 'printableArea'
        },
        pageSize: 'A4'
    }

    try {
        // Generar el PDF
        const data = await win.webContents.printToPDF(options)

        // Crear un archivo temporal para el PDF
        const tempPath = path.join(os.tmpdir(), `factura-${Date.now()}.pdf`)
        fs.writeFileSync(tempPath, data)

        // Abrir el PDF con el visor predeterminado del sistema
        shell.openPath(tempPath)

        return tempPath
    } catch (error) {
        console.error('Error al generar PDF:', error)
        dialog.showErrorBox('Error', 'No se pudo generar el PDF')
        return null
    }
})

// Maneja la impresión del PDF
ipcMain.handle('print-pdf', async (event, pdfPath) => {
    try {
        // Crear una ventana oculta para imprimir el PDF
        const pdfWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                plugins: true
            }
        })

        // Cargar el PDF
        await pdfWindow.loadURL(`file://${pdfPath}`)

        // Imprimir el PDF
        pdfWindow.webContents.print({}, (success) => {
            pdfWindow.close()
            if (!success) {
                dialog.showErrorBox('Error', 'No se pudo imprimir el PDF')
            }
        })

        return true
    } catch (error) {
        console.error('Error al imprimir PDF:', error)
        dialog.showErrorBox('Error', 'No se pudo imprimir el PDF')
        return false
    }

});

/* --------------------------------           ------------------------------------------
      --------------------------------  salida  y salida producto  ------------------------------------------
      --------------------------------           ------------------------------------------ */

ipcMain.on('listar-salidas', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    const salidaController = new SalidaController();
    try {
        const resultado = await salidaController.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
        event.reply('cargar-salidas', resultado);
    } catch (error) {
        console.error('Error al listar salidas:', error);
        event.reply('error-cargar-salidas', { success: false, message: error.message });
    }
});


ipcMain.on('listar-salidas', async (event, { pageSize, currentPage, estado, valorBusqueda }) => {
    console.log("Evento listar-salidas recibido con los siguientes parámetros:", { pageSize, currentPage, estado, valorBusqueda }); // Depuración inicial

    const salidaController = new SalidaController();
    try {
        const resultado = await salidaController.listarSalidas(pageSize, currentPage, estado, valorBusqueda);
        console.log("Salidas obtenidas desde el controlador:", resultado); // Verificar los datos obtenidos
        event.reply('cargar-salidas', resultado);
    } catch (error) {
        console.error("Error al listar salidas:", error); // Mostrar el error en la consola
        event.reply('cargar-salidas', { salidas: [], error: error.message });
    }
});
ipcMain.on('listar-productos-por-salida', async (event, { idSalida }) => {
    console.log("Evento listar-productos-por-salida recibido con ID:", idSalida); // Depuración inicial

    const salidaProductoController = new SalidaProductoController();
    try {
        const productos = await salidaProductoController.obtenerSalidaProductos(idSalida);
        console.log("Productos obtenidos desde el controlador:", productos); // Verificar los datos obtenidos
        event.reply('cargar-productos-por-salida', productos);
    } catch (error) {
        console.error("Error al listar productos de la salida:", error); // Mostrar el error en la consola
        event.reply('cargar-productos-por-salida', []);
    }
});
ipcMain.on('listar-comprobantes-pago', async (event, { pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado }) => {
    const comprobantePagoController = new ComprobantePagoController();

    try {
        // Llamar al método del controlador
        const resultado = await comprobantePagoController.obtenerComprobantesPagos(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado);

        // Mapear los objetos ComprobantePago a un formato plano para enviar al frontend
        const comprobantesCompletos = resultado.comprobantes.map(comprobante => {
            return {
                idComprobantePago: comprobante.getIdComprobantePago(),
                fechaPago: comprobante.getFechaPago(),
                numeroComprobantePago: comprobante.getNumero(),
                monto: comprobante.getMonto(),
                estadoComprobantePago: comprobante.getEstado(),
                idEntidadFinanciera: comprobante.getIdEntidadFinanciera().getIdEntidadFinanciera(),
                nombreEntidadFinanciera: comprobante.getIdEntidadFinanciera().getNombre(),
                tipoEntidadFinanciera: comprobante.getIdEntidadFinanciera().getTipo(),
                estadoEntidadFinanciera: comprobante.getIdEntidadFinanciera().getEstado()
            };
        });

        // Construir la respuesta con metadatos de paginación
        const respuesta = {
            comprobantes: comprobantesCompletos,
            paginacion: {
                total: resultado.total,
                pageSize: resultado.pageSize,
                currentPage: resultado.currentPage,
                totalPages: resultado.totalPages
            }
        };

        // Enviar la respuesta al proceso de renderizado
        if (mainWindow) {
            mainWindow.webContents.send('cargar-comprobantes-pago', respuesta);
        }
    } catch (error) {
        console.error('Error al listar los comprobantes de pago:', error);
        if (mainWindow) {
            mainWindow.webContents.send('error-cargar-comprobantes-pago', 'Hubo un error al cargar los comprobantes de pago.');
        }
    }
});