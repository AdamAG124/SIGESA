let moduleSelector = null;

function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  submenu.classList.toggle("active");
  const arrow = document.getElementById(id + "-arrow");
  arrow.classList.toggle("rotate");
}

function showUserData() {
  window.api.receiveUserData((user) => {
    if (user) {
      document.getElementById("user-name").innerText =
        user.nombre + " " + user.primerApellido;
      document.getElementById("user-role").innerText = user.roleName;
    } else {
      console.log("No se encontraron datos de usuario.");
    }
  });
}

function logout() {
  Swal.fire({
    title: "Cerrando sesión",
    text: "¿Esta seguro de cerrar sesión?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.logout();
      window.api.responseLogout((response) => {
        if (response.success) {
          mostrarToastConfirmacion(response.message);
          setTimeout(() => {
            window.api.sendView(response);
          }, 2000);
        } else {
          mostrarToastError(response.message);
        }
      });
    }
  });
}

function adjuntarHTML(filePath, cargarTabla) {
  window.api.loadHTML(filePath); // Solicita cargar el archivo HTML

  window.api.onHTMLLoaded((data) => {
    const innerDiv = document.getElementById("inner-div");

    if (innerDiv) {
      innerDiv.innerHTML = data; // Adjunta el HTML solo si el div existe

      if (cargarTabla) {
        cargarTabla(); // Ejecuta cargarTabla solo después de cargar el HTML
      }
    } else {
      console.error('Error: Elemento "inner-div" no encontrado en el DOM.');
    }
  });
}

function limpiarDIV() {
  document.getElementById("inner-div").innerHTML = "";
}

function mostrarToastError(mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
  });
  Toast.fire({
    icon: "error",
    title: mensaje,
  });
}
// Función para mostrar un Toast de confirmación
function mostrarToastConfirmacion(titulo) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
  });
  Toast.fire({
    icon: "success",
    title: titulo,
  });
}

function cargarUsuariosTabla(pageSize = 10, pageNumber = 1, estado = 1, idRolFiltro = 0, valorBusqueda = null) {

  // Obtener el select por su id
  const selectEstado = document.getElementById('filtrado-estado');

  const selectRoles = document.getElementById("filtrado-role");

  // Verificar el valor del estado
  if (estado === 0 || estado === 1) {
    // Si el estado es 0 o 1, preseleccionamos ese valor en el select
    selectEstado.value = estado;
  } else {
    // Si el estado es null o cualquier otro valor, preseleccionamos el option con value=2
    selectEstado.value = 2;
  }

  selectPageSize.value = pageSize;

  // Cargar los roles para el filtrado (esto permanece igual)
  cargarRoles("filtrado-role", "Filtrar por tipo");
  setTimeout(() => {
    selectRoles.value = idRolFiltro;

    // Llamar al método del preload.js pasando los datos de paginación
    window.api.obtenerUsuarios(pageSize, pageNumber, estado, idRolFiltro, valorBusqueda, (respuesta) => {
      const tbody = document.getElementById("usuarios-body");
      tbody.innerHTML = ""; // Limpiar contenido previo

      // Iterar sobre los usuarios y agregarlos a la tabla
      respuesta.usuarios.forEach((usuario) => {
        const nombreCompleto = `${usuario.nombreColaborador} ${usuario.primerApellidoColaborador} ${usuario.segundoApellidoColaborador}`;
        const estadoUsuario = usuario.estado === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${nombreCompleto}</td>
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.nombreRol}</td>
                <td>${estadoUsuario}</td>
                <td class="action-icons">
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="editarUsuario(this.value, this)">
                        <span class="material-icons">edit</span>
                        <span class="tooltiptext">Editar usuario</span>
                    </button>
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="${usuario.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando usuario', '¿Está seguro que desea eliminar a este usuario?', 1)` : `actualizarEstado(this.value, 1, 'Reactivando usuario', '¿Está seguro que desea reactivar a este usuario?', 1)`}">
                        <span class="material-icons">
                          ${usuario.estado === 1 ? 'delete' : 'restore'} <!-- Cambia el icono dependiendo del estado -->
                        </span>
                        <span class="tooltiptext">
                          ${usuario.estado === 1 ? 'Eliminar usuario' : 'Reactivar usuario'} <!-- Cambia el tooltip dependiendo del estado -->
                        </span>
                    </button>
                </td>
            `;
        tbody.appendChild(row);
      });

      // Actualizar los botones de paginación
      actualizarPaginacion(respuesta.paginacion, ".pagination", 1);

      cerrarModal("editarUsuarioModal", "editarUsuarioForm");
    });
  }, 100);
}

function checkEmpty(event, moduloFiltrar) {
  const searchValue = document.getElementById("search-bar").value.trim();

  if (searchValue === "") {
    filterTable(moduloFiltrar);
  }

  if (event.key === "Enter") {
    filterTable(moduloFiltrar); // Llama a filterTable cuando se presiona "Enter"
  }
}

function cargarProveedoresTabla(pageSize = 10, currentPage = 1, estado = 1, valorBusqueda = null) {
  const selectEstado = document.getElementById('estado-filtro');
  const selectPageSize = document.getElementById('selectPageSize');

  // Validar pageNumber
  if (typeof currentPage !== 'number' || currentPage <= 0) {
    currentPage = 1; // Establecer el valor predeterminado
  }

  // Verificar el valor del estado y establecerlo
  estado = (estado === 0 || estado === 1) ? estado : 0;
  selectEstado.value = estado;
  selectPageSize.value = pageSize;

  window.api.obtenerProveedores(pageSize, currentPage, estado, valorBusqueda, (respuesta) => {
    const tbody = document.getElementById("proveedores-body");
    tbody.innerHTML = ""; // Limpiar contenido previo

    // Manejo de errores en la respuesta
    if (respuesta.error) {
      const mensajeError = document.createElement("tr");
      mensajeError.innerHTML = `
          <td colspan="3" style="text-align: center; color: red; font-style: italic;">
              Error: ${respuesta.error}
          </td>
      `;
      tbody.appendChild(mensajeError);
      return; // Terminar la función si hay un error
    }

    // Verificar que 'proveedores' es un arreglo
    if (!Array.isArray(respuesta.proveedores)) {
      const mensajeError = document.createElement("tr");
      mensajeError.innerHTML = `
          <td colspan="3" style="text-align: center; color: red; font-style: italic;">
              Error: La respuesta no contiene una lista de proveedores válida.
          </td>
      `;
      tbody.appendChild(mensajeError);
      return; // Terminar la función si hay un error
    }

    // Iterar sobre los proveedores y agregarlos a la tabla
    if (respuesta.proveedores.length === 0) {
      const mensaje = document.createElement("tr");
      mensaje.innerHTML = `
          <td colspan="3" style="text-align: center; color: gray; font-style: italic;">
              No hay proveedores registrados
          </td>
      `;
      tbody.appendChild(mensaje);
      actualizarPaginacion(respuesta.paginacion, ".pagination", 3);
      return;
    } else {
      respuesta.proveedores.forEach((proveedor) => {
        const nombre = `${proveedor.nombre}`;
        const estadoTexto = proveedor.estado === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nombre}</td>
          <td>${estadoTexto}</td>
          <td class="action-icons">
              <button class="tooltip" value="${proveedor.idProveedor}" onclick="editarProveedor(this.value, this)">
                  <span class="material-icons">edit</span>
                  <span class="tooltiptext">Editar proveedor</span>
              </button>
              <button class="tooltip" value="${proveedor.idProveedor}" onclick="${proveedor.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando proveedor', '¿Está seguro que desea eliminar a este proveedor?', 3)` : `actualizarEstado(this.value, 1, 'Reactivando proveedor', '¿Está seguro que desea reactivar a este proveedor?', 3)`}">
                  <span class="material-icons">${proveedor.estado === 1 ? 'delete' : 'restore'}</span>
                  <span class="tooltiptext">${proveedor.estado === 1 ? 'Eliminar proveedor' : 'Reactivar proveedor'}</span>
              </button>
          </td>
          <!-- Información adicional oculta -->
          <td class="hidden-info" style="display:none;">${proveedor.provincia}</td>
          <td class="hidden-info" style="display:none;">${proveedor.canton}</td>
          <td class="hidden-info" style="display:none;">${proveedor.distrito}</td>
          <td class="hidden-info" style="display:none;">${proveedor.direccion}</td>
        `;
        tbody.appendChild(row);
      });
    }

    if (respuesta.paginacion) {
      actualizarPaginacion(respuesta.paginacion, ".pagination", 3);
    } else {
      console.warn('No se proporcionaron datos de paginación o respuesta está vacía.');
    }
    // Cerrar cualquier modal activo
    cerrarModal("editarProveedorModal", "editarProveedorForm");
  });
}

function agregarProveedor() {

  // Cambiar el título del modal a "Editar Colaborador"
  document.getElementById("modalTitle").innerText = "Crear Proveedor";
  document.getElementById("buttonModal").onclick = enviarCreacionProveedor;
  // Mostrar el modal
  document.getElementById("editarProveedorModal").style.display = "block";
}

function enviarCreacionProveedor() {
  // Asignar valores extraídos a los campos del formulario de creación
  const id = document.getElementById("idProveedor").value; // Aunque no se usa, lo dejamos por si es necesario más adelante
  const nombre = document.getElementById("nombreProveedor").value.trim();
  const provincia = document.getElementById("provincia").value.trim();
  const canton = document.getElementById("canton").value.trim();
  const distrito = document.getElementById("distrito").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  // Validar que todos los campos estén llenos
  const inputs = [
    { value: nombre, element: document.getElementById("nombreProveedor") },
    { value: provincia, element: document.getElementById("provincia") },
    { value: canton, element: document.getElementById("canton") },
    { value: distrito, element: document.getElementById("distrito") },
    { value: direccion, element: document.getElementById("direccion") },
  ];

  // Marcar los campos vacíos y llenar el array camposVacios
  inputs.forEach(input => {
    if (!input.value) {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error
  }

  // Crear el objeto proveedor con los datos del formulario
  const proveedorData = {
    nombre: nombre,
    provincia: provincia,
    canton: canton,
    distrito: distrito,
    direccion: direccion,
  };

  Swal.fire({
    title: "Creando Proveedor",
    text: "¿Está seguro que desea crear este nuevo proveedor?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.crearProveedor(proveedorData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaCrearProveedor((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          filterTable(3); // Actualiza la tabla inmediatamente
          cerrarModal("editarProveedorModal", "editarProveedorForm"); // Cierra el modal
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

async function editarProveedor(id, boton) {

  // Obtener la fila del botón clicado
  const fila = boton.closest('tr');

  // Extraer la información de la fila
  const nombreProveedor = fila.children[0].textContent;
  const provincia = fila.children[3].textContent;
  const canton = fila.children[4].textContent;
  const distrito = fila.children[5].textContent;
  const direccion = fila.children[6].textContent;

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idProveedor").value = id;
  document.getElementById("nombreProveedor").value = nombreProveedor;
  document.getElementById("provincia").value = provincia;
  document.getElementById("canton").value = canton;
  document.getElementById("distrito").value = distrito;
  document.getElementById("direccion").value = direccion;

  // Cambiar el título del modal a "Editar Proveedor"
  document.getElementById("modalTitle").innerText = "Editar Proveedor";
  document.getElementById("buttonModal").onclick = enviarEdicionProveedor;
  // Mostrar el modal
  document.getElementById("editarProveedorModal").style.display = "block";
}

function enviarEdicionProveedor() {
  // Obtener valores del formulario
  const id = document.getElementById("idProveedor").value.trim();
  const nombre = document.getElementById("nombreProveedor").value.trim();
  const provincia = document.getElementById("provincia").value.trim();
  const canton = document.getElementById("canton").value.trim();
  const distrito = document.getElementById("distrito").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  // Validar campos vacíos y espacios en blanco
  const inputs = [
    { value: nombre, element: document.getElementById("nombreProveedor") },
    { value: provincia, element: document.getElementById("provincia") },
    { value: canton, element: document.getElementById("canton") },
    { value: distrito, element: document.getElementById("distrito") },
    { value: direccion, element: document.getElementById("direccion") },
  ];

  const camposInvalidos = inputs.filter(input => input.value === "");

  // Manejo de bordes y mensajes de error
  const errorMessage = document.getElementById("errorMessage");
  if (camposInvalidos.length > 0) {
    camposInvalidos.forEach(input => {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
    });
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    inputs.forEach(input => input.element.style.border = ""); // Resetear bordes
    errorMessage.textContent = ""; // Resetear mensaje de error
  }

  // Crear objeto proveedor
  const proveedorData = { idProveedor: id, nombre, provincia, canton, distrito, direccion };

  // Confirmar la edición
  Swal.fire({
    title: "Editando proveedor",
    text: "¿Está seguro que desea editar este proveedor?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.editarProveedor(proveedorData);

      // Manejar la respuesta de la edición
      window.api.onRespuestaActualizarProveedor((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          cerrarModal("editarProveedorModal", "editarProveedorForm");
          filterTable(3);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

function actualizarPaginacion(pagination, idInnerDiv, moduloPaginar) {
  const paginacionDiv = document.querySelector(idInnerDiv);

  // Limpiar el contenido previo de paginación
  paginacionDiv.innerHTML = "";

  // Función para cargar la tabla según el módulo
  const cargarTabla = (page) => {
    if (page < 1 || page > pagination.totalPages) return; // Validar el rango de página
    switch (moduloPaginar) {
      case 1:
        cargarUsuariosTabla(pagination.pageSize, page, pagination.estado, pagination.idRol, pagination.valorBusqueda);
        break;
      case 2:
        cargarColaboradoresTabla(pagination.pageSize, page, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda);
        break;
      case 3:
        cargarProveedoresTabla(pagination.pageSize, page, pagination.estado, pagination.valorBusqueda);
        break;
      case 4:
        cargarCategoriasTabla(pagination.pageSize, page, pagination.estado, pagination.valorBusqueda);
        break;
      case 5:
        cargarEntidadesFinancierasTabla(pagination.pageSize, page, pagination.estado, pagination.valorBusqueda);
        break;
      case 6:
        cargarFacturasTabla(pagination.pageSize, page, pagination.estadoFactura, pagination.idProveedor, pagination.fechaInicio, pagination.fechaFin, pagination.idComprobantePago, pagination.valorBusqueda);
        break;
      case 7:
        cargarProductosTabla(pagination.pageSize, page, pagination.estado, pagination.idCategoria, pagination.valorBusqueda);
        break;
      case 8:
        cargarSalidasTabla(pagination.pageSize, page, pagination.estado, pagination.valorBusqueda, pagination.filtroColaboradorSacando, pagination.filtroColaboradorRecibiendo, pagination.fechaInicio, pagination.fechaFin, pagination.filtroUsuario);
        break;
      default:

        console.warn('Módulo de paginación desconocido:', moduloPaginar);
        break;
    }
  };

  // Función para cargar la primera página y actualizar la paginación
  const loadFirstPage = () => {
    cargarTabla(1);
  };

  // Botón "Primera página"
  const firstPageButton = document.createElement("button");
  firstPageButton.innerHTML = `<span class="material-icons">first_page</span>`;
  firstPageButton.disabled = pagination.currentPage === 1;
  firstPageButton.addEventListener("click", loadFirstPage);
  paginacionDiv.appendChild(firstPageButton);

  // Botón "Página anterior"
  const prevPageButton = document.createElement("button");
  prevPageButton.innerHTML = `<span class="material-icons">navigate_before</span>`;
  prevPageButton.disabled = pagination.currentPage === 1;
  prevPageButton.addEventListener("click", () => {
    if (!prevPageButton.disabled) {
      cargarTabla(pagination.currentPage - 1);
    }
  });
  paginacionDiv.appendChild(prevPageButton);

  // Mostrar información de la página actual
  const pageSpan = document.createElement("span");
  let totalPages = pagination.totalPages >= 1 ? pagination.totalPages : 1;
  pageSpan.textContent = `${pagination.currentPage} de ${totalPages}`;
  pageSpan.setAttribute('data-value', pagination.currentPage);
  pageSpan.classList.add("currentPage");
  paginacionDiv.appendChild(pageSpan);

  // Botón "Siguiente página"
  const nextPageButton = document.createElement("button");
  nextPageButton.innerHTML = `<span class="material-icons">navigate_next</span>`;
  nextPageButton.disabled = pagination.currentPage === pagination.totalPages;
  nextPageButton.addEventListener("click", () => {
    if (!nextPageButton.disabled) {
      cargarTabla(pagination.currentPage + 1);
    }
  });
  paginacionDiv.appendChild(nextPageButton);

  // Botón "Última página"
  const lastPageButton = document.createElement("button");
  lastPageButton.innerHTML = `<span class="material-icons">last_page</span>`;
  lastPageButton.disabled = pagination.currentPage === pagination.totalPages;
  lastPageButton.addEventListener("click", () => {
    if (!lastPageButton.disabled) {
      cargarTabla(pagination.totalPages);
    }
  });
  paginacionDiv.appendChild(lastPageButton);
}

function filterTable(moduloFiltrar) {
  // Siempre cargar la primera página al aplicar un filtro
  const pageSize = Number(document.getElementById("selectPageSize").value);
  switch (moduloFiltrar) {
    case 1:
      cargarUsuariosTabla(pageSize, 1, Number(document.getElementById("filtrado-estado").value), Number(document.getElementById("filtrado-role").value), document.getElementById("search-bar").value);
      break;
    case 2:
      cargarColaboradoresTabla(pageSize, 1, Number(document.getElementById("estado-filtro").value), Number(document.getElementById("puesto-filtro").value), Number(document.getElementById("departamento-filtro").value), document.getElementById("search-bar").value);
      break;
    case 3:
      cargarProveedoresTabla(pageSize, 1, Number(document.getElementById("estado-filtro").value), document.getElementById("search-bar").value);
      break;
    case 4:
      cargarCategoriasTabla(pageSize, 1, Number(document.getElementById("estado-filtro").value), document.getElementById("search-bar").value);
      break;
    case 5:
      cargarEntidadesFinancierasTabla(pageSize, 1, Number(document.getElementById("estado-filtro").value), document.getElementById("search-bar").value);
      break;
    case 6:
      cargarFacturasTabla(pageSize, 1, Number(document.getElementById("estadoFiltro").value), Number(document.getElementById("proveedorFiltro").value), document.getElementById("fechaInicialFiltro").value, document.getElementById("fechaFinalFiltro").value, Number(document.getElementById("comprobanteFiltro").value), document.getElementById("search-bar").value);
      break;
    case 7:
      cargarProductosTabla(pageSize, 1, Number(document.getElementById("estado-filtro").value), Number(document.getElementById("categoria-filtro").value), document.getElementById("search-bar").value);
      break;
    case 8:
      cargarSalidasTabla(pageSize, 1, Number(document.getElementById("estadoFiltro").value), document.getElementById("search-bar").value, Number(document.getElementById("colaboradorSacando").value), Number(document.getElementById("colaboradorRecibiendo").value), document.getElementById("fechaInicialFiltro").value, document.getElementById("fechaFinalFiltro").value, null);
  }
}

function editarUsuario(id, boton) {
  const colaboradorSelect = document.getElementById("colaboradorName");
  const colaboradorSelectLabel = document.getElementById("colaboradorSelectLabel");
  const roleSelectOrigen = document.getElementById("filtrado-role");
  const roleSelectDestino = document.getElementById("roleName");

  // Ocultar campos innecesarios
  colaboradorSelect.style.display = "none";
  colaboradorSelectLabel.style.display = "none";

  // Obtener la fila del botón clicado
  const fila = boton.closest('tr');

  // Extraer la información de la fila
  const nombreUsuario = fila.children[1].textContent;
  const nombreRol = fila.children[2].textContent;

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idUsuario").value = id;
  document.getElementById("nombreUsuario").value = nombreUsuario;

  // Crear un array para almacenar los textos de las opciones del select de roles
  const opcionesArray = [];

  for (let i = 0; i < roleSelectOrigen.options.length; i++) {
    const option = roleSelectOrigen.options[i];
    opcionesArray.push(option.textContent); // Guardar el texto en el array
  }
  roleSelectDestino.innerHTML = "";
  // Insertar las opciones del select de roles
  for (let i = 1; i < opcionesArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesArray[i];
    roleSelectDestino.appendChild(option);
  }

  // Preseleccionar el rol del usuario
  roleSelectDestino.value = opcionesArray.indexOf(nombreRol);

  // Cambiar el título del modal a "Editar Usuario"
  document.getElementById("modalTitle").innerText = "Editar Usuario";
  document.getElementById("buttonModal").onclick = enviarEdicionUsuario;

  // Mostrar el modal
  document.getElementById("editarUsuarioModal").style.display = "block";
}

function enviarEdicionUsuario() {
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.getElementById("passwordError");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const roleName = document.getElementById("roleName").value;

  if (!nombreUsuario || !roleName) {
    passwordError.innerText = "Por favor, complete todos los campos.";
    passwordError.style.display = "block";
    return; // Detener el envío del formulario si hay campos vacíos
  }

  // Reiniciar el estilo de los campos y el mensaje de error
  passwordError.style.display = "none";
  newPasswordInput.style.border = "";
  confirmPasswordInput.style.border = "";

  // Comparar las contraseñas
  if (newPassword !== confirmPassword) {
    // Mostrar el mensaje de error y cambiar el borde a rojo
    passwordError.style.display = "block";
    newPasswordInput.style.border = "2px solid red";
    confirmPasswordInput.style.border = "2px solid red";
    return; // Detener el envío del formulario si las contraseñas no coinciden
  }

  // Si las contraseñas coinciden, crear el objeto JSON con los datos del usuario
  const jsonData = {
    idUsuario: document.getElementById("idUsuario").value,
    nombreUsuario: document.getElementById("nombreUsuario").value,
    newPassword: newPassword,
    roleName: document.getElementById("roleName").value,
  };

  Swal.fire({
    title: "Actualizando usuario",
    text: "¿Esta seguro que desea actualizar la información de este usuario?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Enviar los datos al proceso principal a través de preload.js
      window.api.actualizarUsuario(jsonData);

      // Mostrar el resultado de la actualización al recibir la respuesta
      window.api.onRespuestaActualizarUsuario((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(1);
          }, 2000);
        } else if (respuesta.message === "El nombre de usuario ya está en uso.") {
          document.getElementById("nombreUsuario").style.border = "2px solid red";
          passwordError.innerText = respuesta.message;
          passwordError.style.display = "block";
        } else {
          mostrarToastError(respuesta.message);
        }
      });
      console.log(jsonData);
    }
  });
}

function actualizarEstado(id, estado, title, message, moduloEstadoActualizar) {
  Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      switch (moduloEstadoActualizar) {
        case 1:
          // Enviar los datos al proceso principal a través de preload.js
          window.api.eliminarUsuario(Number(id), Number(estado));

          // Mostrar el resultado de la actualización al recibir la respuesta
          window.api.onRespuestaEliminarUsuario((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              setTimeout(() => {
                filterTable(1);
              }, 2000);
            } else {
              mostrarToastError(respuesta.message);
            }
          });
          break;
        case 2:
          // Enviar los datos al proceso principal a través de preload.js
          window.api.eliminarColaborador(Number(id), Number(estado));
          // Mostrar el resultado de la actualización al recibir la respuesta
          window.api.onRespuestaEliminarColaborador((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              setTimeout(() => {
                filterTable(2);
              }, 2000);
            } else {
              mostrarToastError(respuesta.message);
            }
          });
          break;

        case 3:
          window.api.eliminarProveedor(Number(id), Number(estado));

          window.api.onRespuestaEliminarProveedor((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              filterTable(moduloEstadoActualizar);
            } else {
              mostrarToastError(respuesta.message);
            }
          });
          break;
        case 4:
          window.api.eliminarCategoria(Number(id), Number(estado));
          window.api.onRespuestaEliminarCategoria((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              setTimeout(() => {
                filterTable(4);
              }, 2000);
            }
          });
          break;
        case 5:
          window.api.eliminarEntidadFinanciera(Number(id), Number(estado));

          window.api.onRespuestaEliminarEntidadFinanciera((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              filterTable(moduloEstadoActualizar);
            } else {
              mostrarToastError(respuesta.message);
            }
          });
          break;
        case 7:
          window.api.eliminarProducto(id, estado);

          window.api.onRespuestaEliminarProducto((respuesta) => {
            if (respuesta.success) {
              mostrarToastConfirmacion(respuesta.message);
              filterTable(moduloEstadoActualizar);
            } else {
              mostrarToastError(respuesta.message);
            }
          });
          break;
      }
    }
  });
}

function agregarUsuario() {
  const roleSelectOrigen = document.getElementById("filtrado-role");
  const roleSelectDestino = document.getElementById("roleName");

  // Crear un array para almacenar los textos de las opciones
  const opcionesArray = [];

  for (let i = 0; i < roleSelectOrigen.options.length; i++) {
    const option = roleSelectOrigen.options[i];
    opcionesArray.push(option.textContent); // Guardar el texto en el array
  }

  // Cargar la lista de roles y preseleccionar el rol del usuario
  //window.api.obtenerRoles((roles) => {
  roleSelectDestino.innerHTML = ""; // Limpiar las opciones existentes
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecciona un rol";
  roleSelectDestino.appendChild(defaultOption);

  //roles.forEach((rol) => {
  for (let i = 1; i < opcionesArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesArray[i];
    roleSelectDestino.appendChild(option);
  }

  window.api.obtenerColaboradores(pageSize = null, currentPage = 1, estadoColaborador = 1, idPuestoFiltro = 0, idDepartamentoFiltro = 0, valorBusqueda = null, (respuesta) => {
    const colaboradorSelect = document.getElementById("colaboradorName");
    const colaboradorSelectLabel = document.getElementById("colaboradorSelectLabel");
    colaboradorSelect.style.display = "block";
    colaboradorSelectLabel.style.display = "block";
    colaboradorSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona un colaborador";
    colaboradorSelect.appendChild(option);

    respuesta.colaboradores.forEach((colaborador) => {
      const option = document.createElement("option");
      option.value = colaborador.idColaborador;
      option.textContent = colaborador.nombreColaborador + " " + colaborador.primerApellidoColaborador + " " + colaborador.segundoApellidoColaborador;
      colaboradorSelect.appendChild(option);
    });
  });

  document.getElementById("modalTitle").innerText = "Crear Usuario";
  document.getElementById("buttonModal").onclick = enviarCreacionUsuario;
  // Mostrar el modal
  document.getElementById("editarUsuarioModal").style.display = "block";
}

function enviarCreacionUsuario(event) {
  event.preventDefault(); // Evitar comportamiento predeterminado de envío del formulario

  const colaborador = document.getElementById("colaboradorName").value;
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.getElementById("passwordError");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const roleName = document.getElementById("roleName").value;

  // Reiniciar el estilo de los campos y el mensaje de error
  passwordError.style.display = "none";
  newPasswordInput.style.border = "";
  confirmPasswordInput.style.border = "";

  // Validar que los campos no estén vacíos
  if (!colaborador || !nombreUsuario || !newPassword || !confirmPassword || !roleName) {
    passwordError.innerText = "Por favor, complete todos los campos.";
    passwordError.style.display = "block";
    return; // Detener el envío del formulario si hay campos vacíos
  }

  // Verificar que la nueva contraseña tenga al menos 6 caracteres y contenga números y letras
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Al menos 6 caracteres, con letras y números
  if (!passwordPattern.test(newPassword)) {
    passwordError.innerText = "La contraseña debe tener al menos 6 caracteres, incluyendo números y letras.";
    passwordError.style.display = "block";
    newPasswordInput.style.border = "2px solid red";
    return; // Detener el envío del formulario si la contraseña no es válida
  }

  // Comparar las contraseñas
  if (newPassword !== confirmPassword) {
    // Mostrar el mensaje de error y cambiar el borde a rojo
    passwordError.innerText = "Las contraseñas no coinciden.";
    passwordError.style.display = "block";
    newPasswordInput.style.border = "2px solid red";
    confirmPasswordInput.style.border = "2px solid red";
    return; // Detener el envío del formulario si las contraseñas no coinciden
  }

  // Si todas las validaciones son exitosas, crear el objeto JSON con los datos del usuario
  const jsonData = {
    colaborador: colaborador,
    nombreUsuario: nombreUsuario,
    newPassword: newPassword,
    rol: roleName,
  };

  Swal.fire({
    title: "Creando usuario",
    text: "¿Está seguro que desea crear un usuario nuevo?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Enviar los datos al proceso principal a través de preload.js
      window.api.crearUsuario(jsonData);

      // Mostrar el resultado de la actualización al recibir la respuesta
      window.api.onRespuestaCrearUsuario((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(1);
          }, 2000);
        } else if (respuesta.message === "El nombre de usuario ya está en uso.") {
          document.getElementById("nombreUsuario").style.border = "2px solid red";
          passwordError.innerText = respuesta.message;
          passwordError.style.display = "block";
        } else if (respuesta.message === "El colaborador ya tiene un usuario asociado.") {
          document.getElementById("colaboradorName").style.border = "2px solid red";
          passwordError.innerText = respuesta.message;
          passwordError.style.display = "block";
        } else {
          mostrarToastError(respuesta.message);
        }
      });
      console.log(jsonData);
    }
  });
  //});
}
// Función para cerrar el modal
function cerrarModal(idModalCerrar, idFormReset) {
  const modal = document.getElementById(idModalCerrar);
  const form = document.getElementById(idFormReset);

  // Cerrar el modal
  modal.style.display = "none";

  // Limpiar campos del formulario
  form.reset();

  // Manejo de errores y estilos específicos para el formulario de editar usuario
  if (idFormReset === "editarUsuarioForm") {
    ocultarErrores();
  }

  // Reset específico según formulario
  if (idFormReset === "editarProductoForm") {
    if (moduleSelector) moduleSelector.reset();
  }
}

function ocultarErrores() {
  const errorElements = [
    document.getElementById("passwordError"),
    document.getElementById("newPassword"),
    document.getElementById("confirmPassword"),
    document.getElementById("nombreUsuario"),
    document.getElementById("colaboradorName")
  ];

  errorElements.forEach(element => {
    if (element) {
      if (element.id === "passwordError") {
        element.style.display = "none";
      } else {
        element.style.border = "";
      }
    }
  });
}

function cargarRoles(idSelect, mensajeQuemado) {
  window.api.obtenerRoles((roles) => {
    const roleSelect = document.getElementById(idSelect);
    roleSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    roleSelect.appendChild(option);

    roles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.id; // Asumiendo que tu objeto role tiene un idRole
      option.textContent = role.nombre;
      roleSelect.appendChild(option);
    });
  });
}

function togglePasswordVisibility(passwordFieldId, iconId) {
  const passwordField = document.getElementById(passwordFieldId);
  const icon = document.getElementById(iconId);

  // Alternar entre "password" y "text"
  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.remove("fa-eye-slash"); // Ojo cerrado
    icon.classList.add("fa-eye"); // Ojo abierto
  } else {
    passwordField.type = "password";
    icon.classList.remove("fa-eye"); // Ojo abierto
    icon.classList.add("fa-eye-slash"); // Ojo cerrado
  }
}
/* --------------------------------             ------------------------------------------
   -------------------------------- COLABORADOR ------------------------------------------
   --------------------------------             ------------------------------------------ */
function cargarColaboradoresTabla(pageSize = 10, currentPage = 1, estadoColaborador = 1, idPuestoFiltro = 0, idDepartamentoFiltro = 0, valorBusqueda = null) {

  // Obtener el select por su id
  const selectEstado = document.getElementById('estado-filtro');
  const selectPageSize = document.getElementById('selectPageSize');
  const selectDepartamento = document.getElementById("departamento-filtro");
  const selectPuesto = document.getElementById("puesto-filtro");

  // Verificar el valor del estado
  if (estadoColaborador === 0 || estadoColaborador === 1) {
    selectEstado.value = estadoColaborador;
  } else {
    selectEstado.value = 2;
  }

  selectPageSize.value = pageSize;

  cargarDepartamentos(selectDepartamento, "Filtrar por departamento");
  cargarPuestos(selectPuesto, "Filtrar por puesto");

  setTimeout(() => {
    selectDepartamento.value = idDepartamentoFiltro;
    selectPuesto.value = idPuestoFiltro;
    // Cargar los colaboradores
    window.api.obtenerColaboradores(pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda, (respuesta) => {
      const tbody = document.getElementById("colaboradores-body");
      tbody.innerHTML = ""; // Limpiar contenido previo

      // Iterar sobre los colaboradores y generar las filas de la tabla
      respuesta.colaboradores.forEach((colaborador) => {
        const nombreCompleto = `${colaborador.nombreColaborador} ${colaborador.primerApellidoColaborador} ${colaborador.segundoApellidoColaborador}`;
        const estadoColaborador = colaborador.estado === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nombreCompleto}</td>
          <td>${colaborador.numTelefono}</td>
          <td>${colaborador.correo}</td>
          <td>${estadoColaborador}</td>
          <td class="action-icons">
              <button class="tooltip" value="${colaborador.idColaborador}" onclick="editarColaborador(this.value, this)">
                  <span class="material-icons">edit</span>
                  <span class="tooltiptext">Editar colaborador</span>
              </button>
              <button class="tooltip" value="${colaborador.idColaborador}" onclick="${colaborador.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando colaborador', '¿Está seguro que desea eliminar a este colaborador?', 2)` : `actualizarEstado(this.value, 1, 'Reactivando colaborador', '¿Está seguro que desea reactivar a este colaborador?', 2)`}">
                  <span class="material-icons">
                      ${colaborador.estado === 1 ? 'delete' : 'restore'} <!-- Cambia el icono dependiendo del estado -->
                  </span>
                  <span class="tooltiptext">
                      ${colaborador.estado === 1 ? 'Eliminar colaborador' : 'Reactivar colaborador'} <!-- Cambia el tooltip dependiendo del estado -->
                  </span>
              </button>
              <button class="tooltip" value="${colaborador.idColaborador}" onclick="verDetallesColaborador(this.value)">
                  <span class="material-icons">info</span>
                  <span class="tooltiptext">Ver detalles</span>
              </button>
          </td>
          <!-- Información adicional oculta -->
          <td class="hidden-info" style="display:none;">${colaborador.cedulaColaborador}</td>
          <td class="hidden-info" style="display:none;">${colaborador.fechaNacimiento}</td>
          <td class="hidden-info" style="display:none;">${colaborador.fechaIngreso}</td>
          <td class="hidden-info" style="display:none;">${colaborador.fechaSalida ? colaborador.fechaSalida : 'N/A'}</td>
          <td class="hidden-info" style="display:none;">${colaborador.nombreDepartamento}</td>
          <td class="hidden-info" style="display:none;">${colaborador.nombrePuesto}</td>
      `;
        tbody.appendChild(row);
      });

      // Actualizar los botones de paginación
      actualizarPaginacion(respuesta.paginacion, ".pagination", 2);

      cerrarModal("editarUsuarioModal", "editarColaboradorForm"); // Cerrar cualquier modal activo
    });
  }, 100);
}

function agregarColaborador() {
  const puestoSelect = document.getElementById("puesto-filtro");
  const departamentoSelect = document.getElementById("departamento-filtro");
  const puestoDestinoSelect = document.getElementById("nombrePuesto");
  const departamentoDestinoSelect = document.getElementById("nombreDepartamento");

  // Crear un array para almacenar los textos de las opciones del select de puestos y departamentos
  const opcionesPuestosArray = [];
  const opcionesDepartamentosArray = [];

  for (let i = 0; i < puestoSelect.options.length; i++) {
    const option = puestoSelect.options[i];
    opcionesPuestosArray.push(option.textContent); // Guardar el texto en el array
  }

  for (let i = 0; i < departamentoSelect.options.length; i++) {
    const option = departamentoSelect.options[i];
    opcionesDepartamentosArray.push(option.textContent); // Guardar el texto en el array
  }

  // Insertar las opciones del select de puestos y preseleccionar el puesto del colaborador
  puestoDestinoSelect.innerHTML = ""; // Limpiar las opciones existentes
  const option = document.createElement("option");
  option.value = "0";
  option.textContent = "Seleccione un puesto";
  puestoDestinoSelect.appendChild(option);
  for (let i = 1; i < opcionesPuestosArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesPuestosArray[i];
    puestoDestinoSelect.appendChild(option);
  }

  // Insertar las opciones del select de departamentos y preseleccionar el departamento del colaborador
  departamentoDestinoSelect.innerHTML = ""; // Limpiar las opciones existentes
  const option1 = document.createElement("option");
  option1.value = "0";
  option1.textContent = "Seleccione un departamento";
  departamentoDestinoSelect.appendChild(option1);
  for (let i = 1; i < opcionesDepartamentosArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesDepartamentosArray[i];
    departamentoDestinoSelect.appendChild(option);
  }

  document.getElementById("nombreColaborador").disabled = true;
  document.getElementById("primerApellidoColaborador").disabled = true;
  document.getElementById("segundoApellidoColaborador").disabled = true;

  // Cambiar el título del modal a "Editar Colaborador"
  document.getElementById("modalTitle").innerText = "Crear Colaborador";
  document.getElementById("buttonModal").onclick = enviarCreacionColaborador;
  // Mostrar el modal
  document.getElementById("editarColaboradorModal").style.display = "block";
}

function enviarCreacionColaborador() {
  // Asignar valores extraídos a los campos del formulario de edición
  const id = document.getElementById("idColaborador").value;
  const nombre = document.getElementById("nombreColaborador").value;
  const cedulaColaborador = document.getElementById("cedulaColaborador").value;
  const primerApellidoColaborador = document.getElementById("primerApellidoColaborador").value;
  const segundoApellidoColaborador = document.getElementById("segundoApellidoColaborador").value;
  const fechaNacimientoFormateada = document.getElementById("fechaNacimiento").value;
  const numTelefono = document.getElementById("numTelefono").value;
  const correoColaborador = document.getElementById("correoColaborador").value;
  const fechaIngreso = document.getElementById("fechaIngreso").value;
  const puestoColaborador = document.getElementById("nombrePuesto").value;
  const departamentoColaborador = document.getElementById("nombreDepartamento").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  // Validar que todos los campos estén llenos
  const inputs = [
    { value: nombre, element: document.getElementById("nombreColaborador") },
    { value: cedulaColaborador, element: document.getElementById("cedulaColaborador") },
    { value: primerApellidoColaborador, element: document.getElementById("primerApellidoColaborador") },
    { value: segundoApellidoColaborador, element: document.getElementById("segundoApellidoColaborador") },
    { value: fechaNacimientoFormateada, element: document.getElementById("fechaNacimiento") },
    { value: numTelefono, element: document.getElementById("numTelefono") },
    { value: correoColaborador, element: document.getElementById("correoColaborador") },
    { value: fechaIngreso, element: document.getElementById("fechaIngreso") },
    { value: puestoColaborador, element: document.getElementById("nombrePuesto") },
    { value: departamentoColaborador, element: document.getElementById("nombreDepartamento") },
  ];

  // Marcar los campos vacíos y llenar el array camposVacios
  inputs.forEach(input => {
    if (!input.value) {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error
  }

  // Crear el objeto colaborador con los datos del formulario
  const colaboradorData = {
    nombre: nombre,
    primerApellido: primerApellidoColaborador,
    segundoApellido: segundoApellidoColaborador,
    cedula: cedulaColaborador,
    fechaNacimiento: fechaNacimientoFormateada,
    numTelefono: numTelefono,
    correo: correoColaborador,
    fechaIngreso: fechaIngreso,
    idPuesto: puestoColaborador, // Asumimos que se envía el ID del puesto
    idDepartamento: departamentoColaborador // Asumimos que se envía el ID del departamento
  };

  Swal.fire({
    title: "Creando colaborador",
    text: "¿Está seguro que desea crear este nuevo colaborador?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.crearColaborador(colaboradorData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaCrearColaborador((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(2);
            cerrarModal("editarColaboradorModal", "editarColaboradorForm");
          }, 2000);
          // Aquí puedes hacer alguna acción adicional, como redirigir o limpiar el formulario
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

async function editarColaborador(id, boton) {
  const puestoSelect = document.getElementById("puesto-filtro");
  const departamentoSelect = document.getElementById("departamento-filtro");
  const puestoDestinoSelect = document.getElementById("nombrePuesto");
  const departamentoDestinoSelect = document.getElementById("nombreDepartamento");

  document.getElementById("nombreColaborador").disabled = true;
  document.getElementById("primerApellidoColaborador").disabled = true;
  document.getElementById("segundoApellidoColaborador").disabled = true;

  // Obtener la fila del botón clicado
  const fila = boton.closest('tr');

  // Extraer la información de la fila
  const nombreColaborador = fila.children[0].textContent;
  const nombreDesglosado = desglosarNombreCompleto(nombreColaborador);
  const cedulaColaborador = fila.children[5].textContent;
  const nombre = nombreDesglosado.nombre;
  const primerApellidoColaborador = nombreDesglosado.primerApellido;
  const segundoApellidoColaborador = nombreDesglosado.segundoApellido;
  const fechaNacimiento = fila.children[6].textContent;
  const fechaNacimientoFormateada = formatearFecha(fechaNacimiento);
  const numTelefono = fila.children[1].textContent;
  const correoColaborador = fila.children[2].textContent;
  const puestoColaborador = fila.children[10].textContent;
  const departamentoColaborador = fila.children[9].textContent;
  const fechaIngreso = fila.children[7].textContent;
  const fechaIngresoFormateada = formatearFecha(fechaIngreso);

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idColaborador").value = id;
  document.getElementById("nombreColaborador").value = nombre;
  document.getElementById("cedulaColaborador").value = cedulaColaborador;
  document.getElementById("primerApellidoColaborador").value = primerApellidoColaborador;
  document.getElementById("segundoApellidoColaborador").value = segundoApellidoColaborador;
  document.getElementById("fechaNacimiento").value = fechaNacimientoFormateada;
  document.getElementById("numTelefono").value = numTelefono;
  document.getElementById("correoColaborador").value = correoColaborador;
  document.getElementById("fechaIngreso").value = fechaIngresoFormateada;

  // Crear un array para almacenar los textos de las opciones del select de puestos y departamentos
  const opcionesPuestosArray = [];
  const opcionesDepartamentosArray = [];

  for (let i = 0; i < puestoSelect.options.length; i++) {
    const option = puestoSelect.options[i];
    opcionesPuestosArray.push(option.textContent); // Guardar el texto en el array
  }

  for (let i = 0; i < departamentoSelect.options.length; i++) {
    const option = departamentoSelect.options[i];
    opcionesDepartamentosArray.push(option.textContent); // Guardar el texto en el array
  }

  // Insertar las opciones del select de puestos y preseleccionar el puesto del colaborador
  puestoDestinoSelect.innerHTML = ""; // Limpiar las opciones existentes
  for (let i = 1; i < opcionesPuestosArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesPuestosArray[i];
    puestoDestinoSelect.appendChild(option);
  }

  // Insertar las opciones del select de departamentos y preseleccionar el departamento del colaborador
  departamentoDestinoSelect.innerHTML = ""; // Limpiar las opciones existentes
  for (let i = 1; i < opcionesDepartamentosArray.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = opcionesDepartamentosArray[i];
    departamentoDestinoSelect.appendChild(option);
  }

  // Cambiar el título del modal a "Editar Colaborador"
  document.getElementById("modalTitle").innerText = "Editar Colaborador";
  document.getElementById("buttonModal").onclick = enviarEdicionColaborador;
  // Mostrar el modal
  document.getElementById("editarColaboradorModal").style.display = "block";
}

function enviarEdicionColaborador() {

  // Asignar valores extraídos a los campos del formulario de edición
  const id = document.getElementById("idColaborador").value;
  const nombre = document.getElementById("nombreColaborador").value;
  const cedulaColaborador = document.getElementById("cedulaColaborador").value;
  const primerApellidoColaborador = document.getElementById("primerApellidoColaborador").value;
  const segundoApellidoColaborador = document.getElementById("segundoApellidoColaborador").value;
  const fechaNacimientoFormateada = document.getElementById("fechaNacimiento").value;
  const numTelefono = document.getElementById("numTelefono").value;
  const correoColaborador = document.getElementById("correoColaborador").value;
  const fechaIngreso = document.getElementById("fechaIngreso").value;
  const puestoColaborador = document.getElementById("nombrePuesto").value;
  const departamentoColaborador = document.getElementById("nombreDepartamento").value;

  const camposVacios = [];

  // Validar que todos los campos estén llenos
  const inputs = [
    { value: nombre, element: document.getElementById("nombreColaborador") },
    { value: cedulaColaborador, element: document.getElementById("cedulaColaborador") },
    { value: primerApellidoColaborador, element: document.getElementById("primerApellidoColaborador") },
    { value: segundoApellidoColaborador, element: document.getElementById("segundoApellidoColaborador") },
    { value: fechaNacimientoFormateada, element: document.getElementById("fechaNacimiento") },
    { value: numTelefono, element: document.getElementById("numTelefono") },
    { value: correoColaborador, element: document.getElementById("correoColaborador") },
    { value: fechaIngreso, element: document.getElementById("fechaIngreso") },
    { value: puestoColaborador, element: document.getElementById("nombrePuesto") },
    { value: departamentoColaborador, element: document.getElementById("nombreDepartamento") },
  ];

  // Marcar los campos vacíos y llenar el array camposVacios
  inputs.forEach(input => {
    if (!input.value) {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error
  }


  // Crear objeto colaborador con los datos
  const colaboradorData = {
    idColaborador: id,
    nombre: nombre,
    primerApellido: primerApellidoColaborador,
    segundoApellido: segundoApellidoColaborador,
    fechaNacimiento: fechaNacimientoFormateada,
    numTelefono: numTelefono,
    correo: correoColaborador,
    fechaIngreso: fechaIngreso,
    idPuesto: puestoColaborador,
    idDepartamento: departamentoColaborador,
    cedula: cedulaColaborador,
  };

  Swal.fire({
    title: "Editando colaborador",
    text: "¿Está seguro que desea editar este colaborador?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.editarColaborador(colaboradorData);
      // Realizar la petición de edición del colaborador
      window.api.onRespuestaActualizarColaborador((respuesta) => {
        if (respuesta.success) {
          // Mostrar mensaje de éxito
          //alert("Colaborador editado exitosamente.");
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            cerrarModal("editarColaboradorModal", "editarColaboradorForm");
            filterTable(2); // Actualizar la lista de colaboradores
          }, 2000);
        } else {
          // Mostrar mensaje de error
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

function desglosarNombreCompleto(nombreCompleto) {
  // Dividir el nombre completo en partes utilizando los espacios como separadores
  const partes = nombreCompleto.split(' ');

  let nombre = '';
  let primerApellido = '';
  let segundoApellido = '';

  // Si hay 3 o más partes, asumimos la estructura: nombre + primer apellido + segundo apellido
  if (partes.length >= 3) {
    nombre = partes.slice(0, partes.length - 2).join(' ');  // Todo lo que no sea apellidos
    primerApellido = partes[partes.length - 2]; // Penúltima parte
    segundoApellido = partes[partes.length - 1]; // Última parte
  } else if (partes.length === 2) {
    // Si hay exactamente 2 partes, tomamos el primer elemento como nombre y el segundo como primer apellido
    nombre = partes[0];
    primerApellido = partes[1];
    segundoApellido = ''; // No hay segundo apellido
  } else if (partes.length === 1) {
    // Si hay solo una parte, lo tratamos todo como el nombre
    nombre = partes[0];
    primerApellido = '';
    segundoApellido = '';
  }

  return {
    nombre: nombre,
    primerApellido: primerApellido,
    segundoApellido: segundoApellido
  };
}

async function obtenerNombrePorCedula() {
  const cedula = document.getElementById("cedulaColaborador").value; // Obtener el valor del input
  const url = `https://api.hacienda.go.cr/fe/ae?identificacion=${cedula}`; // Construir la URL

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error en la respuesta de la API'); // Manejo de errores si la respuesta no es exitosa
    }

    const data = await response.json(); // Parsear la respuesta como JSON
    const nombre = data.nombre; // Extraer el nombre del JSON

    const nombreCompleto = desglosarNombreCompleto(nombre);

    document.getElementById("nombreColaborador").value = nombreCompleto.nombre;
    document.getElementById("primerApellidoColaborador").value = nombreCompleto.primerApellido;
    document.getElementById("segundoApellidoColaborador").value = nombreCompleto.segundoApellido;

  } catch (error) {
    console.error('Error al obtener datos:', error); // Manejo de errores
    return null; // Retornar null en caso de error
  }
}
// Función para formatear las fechas en yyyy-MM-dd
function formatearFecha(fecha) {                                     // Autor Adam
  if (!fecha) return 'N/A'; // Maneja el caso de fecha vacía o nula
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Añadir ceros iniciales
  const day = ('0' + date.getDate()).slice(-2); // Añadir ceros iniciales
  return `${year}-${month}-${day}`;
}

function formatearFechaParaInput(fecha) {                             // Autor Jeycob
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();

  // Devuelve el formato yyyy-mm-dd
  return `${año}-${mes}-${dia}`;
}

/* --------------------------------                         ------------------------------------------
   -------------------------------- DEPARTAMENTO DE TRABAJO ------------------------------------------
   --------------------------------                          ------------------------------------------ */
function cargarDepartamentos(idSelect, mensajeQuemado) {
  window.api.obtenerDepartamentos(pageSize = null, currentPage = null, estado = 2, valorBusqueda = null, (respuesta) => {

    //const departamentoSelect = document.getElementById(idSelect);
    idSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    idSelect.appendChild(option);

    respuesta.departamentos.forEach((departamento) => {
      const option = document.createElement("option");
      option.value = departamento.idDepartamento; // Asumiendo que tu objeto role tiene un idRole
      option.textContent = departamento.nombreDepartamento;
      idSelect.appendChild(option);
    });
  });
}

function cargarPuestos(idSelect, mensajeQuemado) {
  window.api.obtenerPuestosTrabajo(pageSize = null, currentPage = null, estado = 1, valorBusqueda = null, (respuesta) => {

    //const departamentoSelect = document.getElementById(idSelect);
    idSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    idSelect.appendChild(option);

    respuesta.puestos.forEach((puesto) => {
      const option = document.createElement("option");
      option.value = puesto.idPuestoTrabajo; // Asumiendo que tu objeto role tiene un idRole
      option.textContent = puesto.nombrePuestoTrabajo;
      idSelect.appendChild(option);
    });
  });
}

function cargarCategoriasTabla(pageSize = 10, currentPage = 1, estado = 1, valorBusqueda = null) {
  const selectEstado = document.getElementById('estado-filtro');
  const selectPageSize = document.getElementById('selectPageSize');
  if (estado === 0 || estado === 1) {
    selectEstado.value = estado;
  } else {
    selectEstado.value = 2;
  }
  selectPageSize.value = pageSize;
  setTimeout(() => {
    window.api.obtenerCategorias(pageSize, currentPage, estado, valorBusqueda, (respuesta) => {

      const tbody = document.getElementById("categoriesBody");
      tbody.innerHTML = ""; // Limpiar contenido previo
      respuesta.categorias.forEach((categoria) => {
        const estadoCategoria = categoria.estado === 1 ? "Activo" : "Inactivo";
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${categoria.nombreCategoria}</td>
                  <td>${categoria.descripcionCategoria}</td>
                  <td>${estadoCategoria}</td>
                  <td class="action-icons">
                      <button class="tooltip" value="${categoria.idCategoria}" onclick="editarCategoria(this.value, this)">
                          <span class="material-icons">edit</span>
                          <span class="tooltiptext">Editar categoría</span>
                      </button>
                      <button class="tooltip" value="${categoria.idCategoria}" onclick="${categoria.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando categoría', '¿Está seguro que desea eliminar esta categoría?', 4)` : `actualizarEstado(this.value, 1, 'Reactivando categoría', '¿Está seguro que desea reactivar esta categoría?', 4)`}">
                          <span class="material-icons">
                              ${categoria.estado === 1 ? 'delete' : 'restore'}
                          </span>
                          <span class="tooltiptext">
                              ${categoria.estado === 1 ? 'Eliminar categoría' : 'Reactivar categoría'}
                          </span>
                      </button>
                  </td>
              `;
        tbody.appendChild(row);
      });
      actualizarPaginacion(respuesta.paginacion, ".pagination", 4);
      cerrarModal("editarCategoriaModal", "editarCategoriaForm");
    });
  }, 100);
}

function agregarCategoria() {
  document.getElementById("modalTitle").innerText = "Crear Categoría";
  document.getElementById("buttonModal").onclick = enviarCreacionCategoria;
  // Mostrar el modal
  document.getElementById("editarCategoriaModal").style.display = "block";
}

function enviarCreacionCategoria() {
  const nombre = document.getElementById("nombreCategoria").value;
  const descripcion = document.getElementById("Descripcion").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  const inputs = [
    { value: nombre, element: document.getElementById("nombreCategoria") },
    { value: descripcion, element: document.getElementById("Descripcion") }
  ];

  // Marcar los campos vacíos y llenar el array camposVacios
  inputs.forEach(input => {
    if (!input.value) {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error
  }

  // Crear el objeto categoría con los datos del formulario
  const categoriaData = {
    nombre: nombre,
    descripcion: descripcion
  };

  Swal.fire({
    title: "Creando categoría",
    text: "¿Está seguro que desea crear esta nueva categoría?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.crearCategoria(categoriaData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaCrearCategoria((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(4);
            cerrarModal("editarCategoriaModal", "editarCategoriaForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

async function editarCategoria(id, boton) {

  // Obtener la fila del botón clicado
  const fila = boton.closest('tr');

  // Extraer la información de la fila
  const nombreCategoria = fila.children[0].textContent;
  const descripcionCategoria = fila.children[1].textContent;

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idCategoria").value = id;
  document.getElementById("nombreCategoria").value = nombreCategoria;
  document.getElementById("Descripcion").value = descripcionCategoria;
  // Cambiar el título del modal a "Editar Proveedor"
  document.getElementById("modalTitle").innerText = "Editar Categoría";
  document.getElementById("buttonModal").onclick = enviarEdicionCategoria;
  // Mostrar el modal
  document.getElementById("editarCategoriaModal").style.display = "block";
}

function enviarEdicionCategoria() {
  const id = document.getElementById("idCategoria").value;
  const nombre = document.getElementById("nombreCategoria").value;
  const descripcion = document.getElementById("Descripcion").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  const inputs = [
    { value: nombre, element: document.getElementById("nombreCategoria") },
    { value: descripcion, element: document.getElementById("Descripcion") }
  ];

  // Marcar los campos vacíos y llenar el array camposVacios
  inputs.forEach(input => {
    if (!input.value) {
      input.element.style.border = "2px solid red"; // Marcar el borde en rojo
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error
  }

  // Crear el objeto categoría con los datos del formulario
  const categoriaData = {
    id: id,
    nombre: nombre,
    descripcion: descripcion
  };

  Swal.fire({
    title: "Editando categoría",
    text: "¿Está seguro que desea editar esta categoría?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.editarCategoria(categoriaData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaActualizarCategoria((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(4);
            cerrarModal("editarCategoriaModal", "editarCategoriaForm");
          }, 2000);
          // Aquí puedes hacer alguna acción adicional, como redirigir o limpiar el formulario
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    } else {
      mostrarToastError(respuesta.message);
    }
  });
}
/* --------------------------------                   ------------------------------------------
   -------------------------------- PUESTO DE TRABAJO ------------------------------------------
   --------------------------------                   ------------------------------------------ */
function cargarPuestosTrabajo(pageSize = 10, currentPage = 1, estado = 1, valorBusqueda = null) {
  window.api.obtenerPuestosTrabajo(pageSize, currentPage, estado, valorBusqueda, (respuesta) => {
    const tbody = document.getElementById("puestos-body");
    tbody.innerHTML = ""; // Limpiar contenido previo

    respuesta.puestos.forEach((puesto) => {
      const estadoPuesto = puesto.estado === 1 ? "Activo" : "Inactivo";

      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${puesto.nombrePuestoTrabajo}</td>
              <td>${puesto.descripcionPuestoTrabajo}</td>
              <td>${estadoPuesto}</td>
              <td class="action-icons">
                  <button class="tooltip" value="${puesto.idPuestoTrabajo}" onclick="editarPuesto(this.value, this)">
                      <span class="material-icons">edit</span>
                      <span class="tooltiptext">Editar puesto</span>
                  </button>
                  <button class="tooltip" value="${puesto.idPuestoTrabajo}" onclick="${puesto.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando puesto', '¿Está seguro que desea eliminar este puesto?', 5)` : `actualizarEstado(this.value, 1, 'Reactivando puesto', '¿Está seguro que desea reactivar este puesto?', 5)`}">
                      <span class="material-icons">${puesto.estado === 1 ? 'delete' : 'restore'}</span>
                      <span class="tooltiptext">${puesto.estado === 1 ? 'Eliminar puesto' : 'Reactivar puesto'}</span>
                  </button>
              </td>
          `;
      tbody.appendChild(row);
    });

    actualizarPaginacion(respuesta.paginacion, ".pagination", 5);
  });
}

function agregarPuesto() {
  // Lógica para agregar un nuevo puesto
}

function enviarCreacionPuesto() {
  const nombre = document.getElementById("nombrePuesto").value;
  const descripcion = document.getElementById("descripcionPuesto").value;
  const estado = document.getElementById("estadoPuesto").checked ? 1 : 0;

  const puestoData = { nombre, descripcion, estado };

  Swal.fire({
    title: "Creando puesto",
    text: "¿Está seguro que desea crear este nuevo puesto?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.crearPuesto(puestoData);

      window.api.onRespuestaCrearPuesto((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            cargarPuestosTrabajo();
            cerrarModal("crearPuestoModal", "crearPuestoForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

async function editarPuesto(id, boton) {
  // Lógica para editar un puesto
}

function enviarEdicionPuesto() {
  const idPuestoTrabajo = document.getElementById("idPuestoTrabajo").value;
  const nombre = document.getElementById("nombrePuesto").value;
  const descripcion = document.getElementById("descripcionPuesto").value;
  const estado = document.getElementById("estadoPuesto").checked ? 1 : 0;

  const puestoData = { idPuestoTrabajo, nombre, descripcion, estado };

  Swal.fire({
    title: "Editando puesto",
    text: "¿Está seguro que desea editar este puesto?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.editarPuesto(puestoData);

      window.api.onRespuestaActualizarPuesto((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            cargarPuestosTrabajo();
            cerrarModal("editarPuestoModal", "editarPuestoForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

/* --------------------------------                    ------------------------------------------
   -------------------------------- ENTIDAD FINANCIERA ------------------------------------------
   --------------------------------                    ------------------------------------------ */
function cargarEntidadesFinancierasTabla(pageSize = 10, currentPage = 1, estado = 1, valorBusqueda = null) {
  const selectEstado = document.getElementById('estado-filtro');
  const selectPageSize = document.getElementById('selectPageSize');

  // Validar pageNumber
  if (typeof currentPage !== 'number' || currentPage <= 0) {
    currentPage = 1; // Establecer el valor predeterminado
  }

  // Verificar el valor del estado y establecerlo
  estado = (estado === 0 || estado === 1) ? estado : 0;
  selectEstado.value = estado;
  selectPageSize.value = pageSize;

  window.api.obtenerEntidadesFinancieras(pageSize, currentPage, estado, valorBusqueda, (respuesta) => {
    const tbody = document.getElementById("entidades-financieras-body");
    tbody.innerHTML = ""; // Limpiar contenido previo

    // Manejo de errores en la respuesta
    if (respuesta.error) {
      const mensajeError = document.createElement("tr");
      mensajeError.innerHTML = `
            <td colspan="3" style="text-align: center; color: red; font-style: italic;">
                Error: ${respuesta.error}
            </td>
        `;
      tbody.appendChild(mensajeError);
      return; // Terminar la función si hay un error
    }

    // Verificar que 'entidadesFinancieras' es un arreglo
    if (!Array.isArray(respuesta.entidadesFinancieras)) {
      const mensajeError = document.createElement("tr");
      mensajeError.innerHTML = `
            <td colspan="3" style="text-align: center; color: red; font-style: italic;">
                Error: La respuesta no contiene una lista de entidades financieras válida.
            </td>
        `;
      tbody.appendChild(mensajeError);
      return; // Terminar la función si hay un error
    }

    // Iterar sobre las entidades y agregarlas a la tabla
    if (respuesta.entidadesFinancieras.length === 0) {
      const mensaje = document.createElement("tr");
      mensaje.innerHTML = `
            <td colspan="3" style="text-align: center; color: gray; font-style: italic;">
                No hay entidades financieras registradas
            </td>
        `;
      tbody.appendChild(mensaje);
      actualizarPaginacion(respuesta.paginacion, ".pagination", 5);
      return;
    } else {
      respuesta.entidadesFinancieras.forEach((entidadFinanciera) => {
        const nombre = `${entidadFinanciera.nombre}`;
        const estadoTexto = entidadFinanciera.estado === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${nombre}</td>
            <td>${estadoTexto}</td>
            <td class="action-icons">
                <button class="tooltip" value="${entidadFinanciera.idEntidadFinanciera}" onclick="editarEntidadFinanciera(this.value, this)">
                    <span class="material-icons">edit</span>
                    <span class="tooltiptext">Editar Entidad Financiera</span>
                </button>
                <button class="tooltip" value="${entidadFinanciera.idEntidadFinanciera}" onclick="${entidadFinanciera.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando entidad financiera', '¿Está seguro que desea eliminar a esta entidad financiera?', 5)` : `actualizarEstado(this.value, 1, 'Reactivando entidad financiera', '¿Está seguro que desea reactivar a esta entidad financiera?', 5)`}">
                    <span class="material-icons">${entidadFinanciera.estado === 1 ? 'delete' : 'restore'}</span>
                    <span class="tooltiptext">${entidadFinanciera.estado === 1 ? 'Eliminar entidad financiera' : 'Reactivar entidad financiera'}</span>
                </button>
            </td>
            <!-- Información adicional oculta -->
            
            <td class="hidden-info" style="display:none;">${entidadFinanciera.telefono}</td>
            <td class="hidden-info" style="display:none;">${entidadFinanciera.correo}</td>
            <td class="hidden-info" style="display:none;">${entidadFinanciera.tipo}</td>
            <td class="hidden-info" style="display:none;">${entidadFinanciera.fechaInicioFinanciamiento}</td>
  
          `;
        tbody.appendChild(row);
      });
    }

    if (respuesta.paginacion) {
      actualizarPaginacion(respuesta.paginacion, ".pagination", 5);
    } else {
      console.warn('No se proporcionaron datos de paginación o respuesta está vacía.');
    }
    // Cerrar cualquier modal activo
    cerrarModal("editarEntidadFinancieraModal", "editarEntidadFinancieraForm");
  });
}

function agregarEntidadFinanciera() {

  // Cambiar el título del modal a "Crear Colaborador"
  document.getElementById("modalTitle").innerText = "Crear Entidad Financiera";
  document.getElementById("buttonModal").onclick = enviarCreacionEntidadFinanciera;
  document.getElementById("editarEntidadFinancieraModal").style.display = "block";
}

function enviarCreacionEntidadFinanciera() {
  // Asignar los elementos de los inputs
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const correoInput = document.getElementById("correo");
  const tipoInput = document.getElementById("tipo");
  const fechaInicioFinanciamientoInput = document.getElementById("fechaInicioFinanciamiento");

  const camposVacios = [];

  const inputs = [
    { element: nombreInput, obligatorio: true },
    { element: telefonoInput, obligatorio: false },
    { element: correoInput, obligatorio: false },
    { element: tipoInput, obligatorio: true },
    { element: fechaInicioFinanciamientoInput, obligatorio: false },
  ];

  // Asignar "N/A" a los campos vacíos y verificar obligatoriedad
  inputs.forEach(input => {
    if (!input.element.value.trim()) {
      if (input.obligatorio) {
        input.element.style.border = "2px solid red";
        camposVacios.push(input.element);
      } else {
        input.element.value = "N/A";
        input.element.style.border = "";
      }
    } else {
      input.element.style.border = "";
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");

  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos obligatorios.";
    return;
  } else {
    // Validar teléfono directamente desde el valor del input
    if (telefonoInput.value.trim() !== "N/A" && telefonoInput.value.trim().length < 8) {
      telefonoInput.style.border = "2px solid red";
      errorMessage.textContent = "El teléfono ingresado no es válido.";
      return;
    }

    // Validar correo directamente desde el valor del input
    if (correoInput.value.trim() !== "N/A" && !validateEmail(correoInput.value.trim())) {
      correoInput.style.border = "2px solid red";
      errorMessage.textContent = "El correo ingresado no es válido.";
      return;
    }

    // Si todo es válido, limpiamos el mensaje de error
    errorMessage.textContent = "";
  }

  // Obtener los valores de los inputs
  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const correo = correoInput.value.trim();
  const tipo = tipoInput.value.trim();
  const fechaInicioFinanciamiento = fechaInicioFinanciamientoInput.value.trim();

  // Crear el objeto entidadFinanciera con los valores
  const entidadFinancieraData = {
    nombre: nombre,
    telefono: telefono !== "N/A" ? telefono : null,  // Si es "N/A", lo dejamos como null
    correo: correo !== "N/A" ? correo : null,        // Si es "N/A", lo dejamos como null
    tipo: tipo,                                      // El tipo nunca debe ser "N/A"
    fechaInicioFinanciamiento: fechaInicioFinanciamiento !== "N/A" ? fechaInicioFinanciamiento : null, // Si es "N/A", lo dejamos como null
  };

  // Confirmación antes de crear la entidad financiera
  Swal.fire({
    title: "Creando Entidad Financiera",
    text: "¿Está seguro que desea crear esta nueva entidad financiera?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.crearEntidadFinanciera(entidadFinancieraData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaCrearEntidadFinanciera((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          filterTable(5); // Actualiza la tabla inmediatamente
          cerrarModal("editarEntidadFinancieraModal", "editarEntidadFinancieraForm"); // Cierra el modal
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

async function editarEntidadFinanciera(id, boton) {
  // Obtener la fila del botón clicado
  const fila = boton.closest('tr');

  // Extraer la información de la fila
  const nombre = fila.children[0].textContent;
  const telefono = (fila.children[3] && (fila.children[3].textContent.trim() !== "" && fila.children[3].textContent !== "null"))
    ? fila.children[3].textContent.trim()
    : "N/A";

  const correo = (fila.children[4] && (fila.children[4].textContent.trim() !== "" && fila.children[4].textContent !== "null"))
    ? fila.children[4].textContent.trim()
    : "N/A";

  const tipo = fila.children[5].textContent;
  const fechaInicioFinanciamiento = (fila.children[6] && fila.children[6].textContent.trim()) ? fila.children[6].textContent.trim() : null;

  // Si la fecha es válida, formatearla a 'dd-mm-yyyy', si es nula, dejarla vacía
  let fechaFormateada = "";
  if (fechaInicioFinanciamiento) {
    fechaFormateada = formatearFechaParaInput(new Date(fechaInicioFinanciamiento));
  }

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idEntidadFinanciera").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("telefono").value = telefono;
  document.getElementById("correo").value = correo;
  document.getElementById("tipo").value = tipo;
  document.getElementById("fechaInicioFinanciamiento").value = fechaFormateada;  // Si es null, el campo quedará vacío

  // Cambiar el título del modal a "Editar Entidad Financiera"
  document.getElementById("modalTitle").innerText = "Editar Entidad Financiera";
  document.getElementById("buttonModal").onclick = enviarEdicionEntidadFinanciera;

  // Mostrar el modal
  document.getElementById("editarEntidadFinancieraModal").style.display = "block";
}

function enviarEdicionEntidadFinanciera() {
  // Obtener valores del formulario
  const id = document.getElementById("idEntidadFinanciera").value.trim();
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const correoInput = document.getElementById("correo");
  const tipoInput = document.getElementById("tipo");
  const fechaInicioFinanciamientoInput = document.getElementById("fechaInicioFinanciamiento");


  // Validar campos vacíos y espacios en blanco
  // Asignar los elementos de los inputs y verificar obligatoriedad
  const inputs = [
    { element: nombreInput, obligatorio: true },
    { element: telefonoInput, obligatorio: false },
    { element: correoInput, obligatorio: false },
    { element: tipoInput, obligatorio: true },
    { element: fechaInicioFinanciamientoInput, obligatorio: false },
  ];

  const camposVacios = [];

  // Manejo de bordes y mensajes de error
  const errorMessage = document.getElementById("errorMessage");

  // Verificar los valores de los inputs y asignar "N/A" si es necesario
  inputs.forEach(input => {
    if (!input.element.value.trim()) {
      if (input.obligatorio) {
        input.element.style.border = "2px solid red";
        camposVacios.push(input.element);
      } else {
        input.element.value = "N/A";
        input.element.style.border = "";
      }
    } else {
      input.element.style.border = "";
    }
  });

  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos obligatorios.";
    return;
  } else {
    // Validar teléfono directamente desde el valor del input
    if (telefonoInput.value.trim() !== "N/A" && telefonoInput.value.trim().length < 8) {
      telefonoInput.style.border = "2px solid red";
      errorMessage.textContent = "El teléfono ingresado no es válido.";
      return;
    }

    // Validar correo directamente desde el valor del input
    if (correoInput.value.trim() !== "N/A" && !validateEmail(correoInput.value.trim())) {
      correoInput.style.border = "2px solid red";
      errorMessage.textContent = "El correo ingresado no es válido.";
      return;
    }

    // Si todo es válido, limpiamos el mensaje de error
    errorMessage.textContent = "";
  }

  const fechaInicioFinanciamiento = fechaInicioFinanciamientoInput.value.trim();
  const fechaFinal = fechaInicioFinanciamiento === "N/A" || !fechaInicioFinanciamiento ? null : fechaInicioFinanciamiento;

  // Crear objeto entidadFinanciera con los valores obtenidos
  const entidadFinancieraData = {
    idEntidadFinanciera: id,
    nombre: nombreInput.value.trim(),
    telefono: telefonoInput.value.trim() !== "N/A" ? telefonoInput.value.trim() : null, // Si es "N/A", se dejará como null
    correo: correoInput.value.trim() !== "N/A" ? correoInput.value.trim() : null,       // Si es "N/A", se dejará como null
    tipo: tipoInput.value.trim(),                                                       // El tipo nunca debe ser "N/A"
    fechaInicioFinanciamiento: fechaFinal,                                              // Si es "N/A", se dejará como null
  };

  // Confirmar la edición
  Swal.fire({
    title: "Editando Entidad Financiera",
    text: "¿Está seguro que desea editar esta entidad financiera?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.api.editarEntidadFinanciera(entidadFinancieraData);

      // Manejar la respuesta de la edición
      window.api.onRespuestaActualizarEntidadFinanciera((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          cerrarModal("editarEntidadFinancieraModal", "editarEntidadFinancieraForm");
          filterTable(5);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}



/* --------------------------------          ------------------------------------------
   -------------------------------- PRODUCTO ------------------------------------------
   --------------------------------          ------------------------------------------ */
function cargarCategorias(idSelect, mensajeQuemado, estado = 1, validarCategoriasInactivas = 0) {
  window.api.obtenerCategorias(pageSize = null, currentPage = null, estado, valorBusqueda = null, (respuesta) => {
    if (respuesta && respuesta.categorias) {
      idSelect.innerHTML = ""; // Limpiar las opciones existentes
      const option = document.createElement("option");
      option.value = "0";
      option.textContent = mensajeQuemado;
      option.selected = true;
      idSelect.appendChild(option);

      respuesta.categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.idCategoria;

        // Si se debe validar si las categorías están deshabilitadas
        if (validarCategoriasInactivas === 1 && categoria.estado === 0) {
          option.textContent = `Categoría ${categoria.nombreCategoria} Inactiva`;
          option.disabled = true; // Deshabilitar la opción
          option.classList.add("categoria-inactiva"); // Añadir clase para aplicar estilos específicos
        } else {
          option.textContent = categoria.nombreCategoria;
        }

        idSelect.appendChild(option);
      });
    } else {
      console.log("No se pudieron cargar las categorías.");
    }
  });
}

function cargarProductosTabla(pageSize = 10, currentPage = 1, estado = 1, idCategoriaFiltro = 0, valorBusqueda = null) {
  // Obtener el select por su id
  const selectEstado = document.getElementById('estado-filtro');
  if (!selectEstado) {
    console.error("Elemento 'estadoFiltro' no encontrado en el DOM.");
    return;
  }
  const selectPageSize = document.getElementById('selectPageSize');
  const selectCategoria = document.getElementById("categoria-filtro");

  // Verificar el valor del estado
  if (estado == 0 || estado == 1) {
    selectEstado.value = estado;
  } else {
    selectEstado.value = 2;
  }

  selectPageSize.value = pageSize;

  cargarCategorias(selectCategoria, "Filtrar por categoría");

  setTimeout(() => {
    selectCategoria.value = idCategoriaFiltro;
    // Cargar los productos
    window.api.obtenerProductos(pageSize, currentPage, estado, idCategoriaFiltro, valorBusqueda, (respuesta) => {
      const tbody = document.getElementById("productos-body");
      tbody.innerHTML = ""; // Limpiar contenido previo

      // Iterar sobre los colaboradores y generar las filas de la tabla
      respuesta.productos.forEach((producto) => {
        const estado = producto.estadoProducto === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");

        // Verificar si la cantidad es menor o igual a 10 para aplicar el color rojo
        if (producto.cantidad <= 10) {
          row.classList.add("low-stock"); // Agregar la clase 'low-stock' a la fila
        }

        row.innerHTML = `
          <td>${producto.nombreProducto}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.nombreUnidadMedicion}</td>
          <td>${estado}</td>
          <td class="action-icons">
              <button class="tooltip" value="${producto.idProducto}" onclick="editarProducto(this.value, this)">
                  <span class="material-icons">edit</span>
                  <span class="tooltiptext">Editar producto</span>
              </button>                                                                                        
              <button class="tooltip" value="${producto.idProducto}" onclick="${producto.estadoProducto === 1 ? `actualizarEstado(this.value, 0, 'Eliminando producto', '¿Está seguro que desea eliminar este producto?', 7)` : `actualizarEstado(this.value, 1, 'Reactivando producto', '¿Está seguro que desea reactivar este producto?', 7)`}">
                  <span class="material-icons">
                      ${producto.estadoProducto === 1 ? 'delete' : 'restore'} <!-- Cambia el icono dependiendo del estado -->
                  </span>
                  <span class="tooltiptext">
                      ${producto.estadoProducto === 1 ? 'Eliminar producto' : 'Reactivar producto'} <!-- Cambia el tooltip dependiendo del estado -->
                  </span>
              </button>
          </td>
        `;

        tbody.appendChild(row);

        // Actualizar los botones de paginación
        actualizarPaginacion(respuesta.paginacion, ".pagination", 7);

        cerrarModal("editarProductoModal", "editarProductoForm"); // Cerrar cualquier modal activo
      });
    }, 500);
  });
}

function desplegarAgregarProducto() {
  // Inicializar el moduleSelector para "unidad-medicion" y forzar reinicio
  initModuleSelector(1, true); // '1' corresponde a Unidades de Medición

  const categoriaSelect = document.getElementById("categorias");
  cargarCategorias(categoriaSelect, "Seleccionar categoría");

  // Limpiar campos del formulario si es necesario
  document.getElementById("editarProductoForm").reset();
  document.getElementById("idProducto").value = "";
  document.getElementById("errorMessage").textContent = "";

  // Cambiar el título del modal a "Crear Producto"
  document.getElementById("modalTitle").innerText = "Crear Producto";
  document.getElementById("buttonModal").onclick = enviarCreacionProducto;

  // Mostrar el modal
  document.getElementById("editarProductoModal").style.display = "block";
}

function enviarCreacionProducto() {

  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value || "N/A";
  const cantidad = document.getElementById("cantidad").value;
  const unidadMedicion = moduleSelector.getSelectedId();
  const categoria = document.getElementById("categorias").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  const inputs = [
    { value: nombre, element: document.getElementById("nombre") },
    { value: unidadMedicion, element: document.getElementById("selected-module") },
    { value: categoria, element: document.getElementById("categorias") },

    // ES OPCIONAL AGREGAR LA DESCRIPCIÓN Y LA CANTIDAD
    // Si quieren registrar un nuevo producto y luego asignarle la cantidad el sistema debe soportarlo

    // { value: descripcion, element: document.getElementById("descripcion") }, 
    { value: cantidad, element: document.getElementById("cantidad") }
  ];

  inputs.forEach(input => {
    if (!input.value || (input.value == 0 && input.element.id === "categorias") || (input.value < 0 && input.element.id === "cantidad")) {
      // Si el valor es nulo o cero y el campo es 'categorias', marcar el borde en rojo
      input.element.style.border = "2px solid red";
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde si no está vacío o es válido
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error si no hay campos vacíos
  }

  // Crear el objeto categoría con los datos del formulario
  const productoData = {
    nombre: nombre,
    descripcion: descripcion,
    cantidad: cantidad,
    unidadMedicion: unidadMedicion,
    categoria: categoria
  };

  Swal.fire({
    title: "Creando producto",
    text: "¿Está seguro que desea crear este nuevo producto?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.crearProducto(productoData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaCrearProducto((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(7);
            cerrarModal("editarProductoModal", "editarProductoForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

async function editarProducto(id, boton) {
  const selectCategoria = document.getElementById("categorias");
  cargarCategorias(selectCategoria, 'Seleccionar categoría', estado = null, validarCategoriasInactivas = 1);

  window.api.obtenerProductoPorId(id);

  window.api.onRespuestaObtenerProductoPorId((producto) => {
    if (producto) {
      // Asignar valores extraídos a los campos del formulario de edición
      document.getElementById("idProducto").value = producto.idProducto;
      document.getElementById("nombre").value = producto.nombre;
      document.getElementById("descripcion").value = producto.descripcion;
      document.getElementById("cantidad").value = producto.cantidad;
      
      initModuleSelector(1, true, creatable = false, editable = false, () => {
        moduleSelector.setSelectedById(producto.idUnidadMedicion); // Deselecciona si fuera necesario
      });

      // Usar setTimeout para esperar un poco y luego asignar el valor al select
      setTimeout(() => {
        selectCategoria.value = producto.idCategoria; // Asignamos el valor después de un pequeño retraso
      }, 100);

      // Cambiar el título del modal a "Detalles del Producto"
      document.getElementById("modalTitle").innerText = "Detalles del Producto";

      document.getElementById("buttonModal").onclick = enviarEdicionProducto;

      // Mostrar el modal
      document.getElementById("editarProductoModal").style.display = "block";
    } else {
      console.log("Error al obtener el producto, viene nulo");
    }
  });
}

function enviarEdicionProducto() {
  const id = document.getElementById("idProducto").value;
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value || "N/A";
  const cantidad = document.getElementById("cantidad").value;
  const unidadMedicion = moduleSelector.getSelectedId();
  const categoria = document.getElementById("categorias").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  const inputs = [
    { value: nombre, element: document.getElementById("nombre") },
    { value: unidadMedicion, element: document.getElementById("selected-module") },
    { value: categoria, element: document.getElementById("categorias") },

    // ES OPCIONAL AGREGAR LA DESCRIPCIÓN Y LA CANTIDAD
    // Si quieren editar un producto y luego asignarle la cantidad el sistema debe soportarlo
    { value: cantidad, element: document.getElementById("cantidad") }
  ];

  inputs.forEach(input => {
    if (!input.value || (input.value == 0 && input.element.id === "categorias") || (input.value < 0 && input.element.id === "cantidad")) {
      // Si el valor es nulo o cero y el campo es 'categorias', marcar el borde en rojo
      input.element.style.border = "2px solid red";
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde si no está vacío o es válido
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error si no hay campos vacíos
  }

  // Crear el objeto categoría con los datos del formulario
  const productoData = {
    idProducto: id,
    nombre: nombre,
    descripcion: descripcion,
    cantidad: cantidad,
    unidadMedicion: unidadMedicion,
    categoria: categoria
  };

  Swal.fire({
    title: "Editando producto",
    text: "¿Está seguro que desea actualizar este producto?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.actualizarProducto(productoData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaActualizarProducto((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable(7);
            cerrarModal("editarProductoModal", "editarProductoForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

function toggleModuleList() {
  const container = document.getElementById("module-list");
  container.classList.toggle("open");
}

function initModuleSelector(tipo, force = false, creatable = true, editable = true, callback = null) {
  if (!moduleSelector || force) {
    const container = document.getElementById("module-container");

    if (container) {
      container.innerHTML = `
        <div id="select-wrapper">
            <div id="selected-module" onclick="toggleModuleList()">
                Selección
                <span class="dropdown-icon"></span>
            </div>
            <div id="module-list"></div>
        </div>
        <button id="add-module-btn" title="Agregar">＋</button>
      `;
    }

    moduleSelector = new ModuleSelector({
      containerId: "module-container",
      moduleId: tipo,
      handlers: getHandlersForType(tipo),
      creatable: creatable,
      editable: editable,
    });

    // Espera a que los módulos se carguen antes de ejecutar el callback
    moduleSelector.fetchModules(callback);
  } else if (callback) {
    callback(); // Si ya estaba inicializado, ejecutamos el callback directo
  }
}

// Función para obtener los handlers según el tipo de módulo con un switch
function getHandlersForType(tipo) {
  switch (tipo) {
    case 1:
      // Módulo de Unidades de Medición
      return {
        list: (moduleId, callback) => {
          window.api.obtenerUnidadesMedicion((unidades) => {
            callback(unidades);
          });
        },
        create: (moduleId, newName, callback) => {
          window.api.crearUnidadMedicion(newName, (response) => {
            if (response.success) {
              // Llamar al método de listar para actualizar los datos desde la base de datos
              window.api.obtenerUnidadesMedicion((unidades) => {
                callback(unidades); // Pasar las unidades actualizadas al callback
              });
            } else {
              console.error("Error al crear una unidad de medición", response.message);
            }
          });
        },
        update: (moduleId, id, newName, callback) => {
          window.api.actualizarUnidadMedicion(id, newName, (response) => {
            if (response.success) callback(response);
            else console.error("Error al actualizar unidad de medición", response.message);
          });
        },
        delete: (moduleId, id, callback) => {
          window.api.eliminarUnidadMedicion(id, (response) => {
            if (response.success) callback(response);
            else console.error("Error al eliminar unidad de medición", response.message);
          });
        },
        undoDelete: (moduleId, name, index, callback) => {
          window.api.revertirUnidadMedicion(name, index, (response) => {
            if (response.success) callback(response);
            else console.error("Error al restaurar unidad de medición", response.message);
          });
        }
      };

    default:
      console.error(`Tipo de módulo no soportado: ${tipo}`);
      return {}; // Retorna un objeto vacío si el tipo no se reconoce
  }
}


/* --------------------------------          ------------------------------------------
   -------------------------------- FACTURAS ------------------------------------------
   --------------------------------          ------------------------------------------ */
function cargarFacturasTabla(pageSize = 10, pageNumber = 1, estadoFactura = 1, idProveedor = null, fechaInicio = null, fechaFin = null, idComprobantePago = null, searchValue = null) {
  // Obtener los elementos del DOM
  const selectPageSize = document.getElementById('selectPageSize'); // Tamaño de página
  const selectEstado = document.getElementById('estadoFiltro'); // Estado
  const inputFechaInicio = document.getElementById('fechaInicialFiltro');
  const inputFechaFin = document.getElementById('fechaFinalFiltro');
  const selectProveedor = document.getElementById('proveedorFiltro'); // Proveedor
  const selectComprobante = document.getElementById('comprobanteFiltro'); // Comprobante
  const searchInput = document.getElementById('search-bar');

  // Configurar valores iniciales en los filtros
  selectPageSize.value = pageSize;

  // Configurar el select de estado
  if (estadoFactura === 1) selectEstado.value = 1;
  else if (estadoFactura === 0 || estadoFactura === null) selectEstado.value = 0;
  else selectEstado.value = 2;

  if (fechaInicio) inputFechaInicio.value = fechaInicio;
  if (fechaFin) inputFechaFin.value = fechaFin;

  if (searchValue) searchInput.value = searchValue;
  cargarPtroveedores("proveedorFiltro", "Filtrar por proveedor");
  cargarComprobantesPago("comprobanteFiltro", "Filtrar por Comprobante");

  setTimeout(function () {
    if (idProveedor) selectProveedor.value = idProveedor;
    if (idComprobantePago) selectComprobante.value = idComprobantePago;

    window.api.obtenerFacturas(pageSize, pageNumber, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue, (respuesta) => {
      const tbody = document.getElementById("facturas-table-body");
      tbody.innerHTML = ""; // Limpiar contenido previo

      // Iterar sobre las facturas y agregarlas a la tabla
      respuesta.facturas.forEach((factura) => {
        const fechaFactura = factura.fechaFactura ? new Date(factura.fechaFactura).toLocaleDateString('es-ES') : 'Sin fecha';
        const estadoTexto = factura.estadoFactura === 1 ? "Activo" : "Inactivo";

        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${factura.nombreProveedor || 'Sin proveedor'}</td>
                  <td>${factura.numeroFactura || 'Sin número'}</td>
                  <td>${fechaFactura}</td>
                  <td>${factura.numeroComprobantePago || 'Sin comprobante'}</td>
                  <td class="action-icons">
                      <button class="tooltip" value="${factura.idFactura}" onclick="verDetallesFactura(this.value, '/factura-view/editar-factura.html', 2)">
                          <span class="material-icons">edit</span>
                          <span class="tooltiptext">Editar factura</span>
                      </button>
                      <button class="tooltip" value="${factura.idFactura}" onclick="verDetallesFactura(this.value, '/factura-view/detalles-factura.html', 1)">
                          <span class="material-icons">info</span>
                          <span class="tooltiptext">Ver detalles</span>
                      </button>
                      <button class="tooltip" value="${factura.idFactura}" onclick="${factura.estadoFactura === 1 ? `actualizarEstadoFactura(this.value, 0, 'Eliminando factura', '¿Está seguro que desea eliminar esta factura?', 1)` : `actualizarEstadoFactura(this.value, 1, 'Reactivando factura', '¿Está seguro que desea reactivar esta factura?', 1)`}">
                          <span class="material-icons">
                              ${factura.estadoFactura === 1 ? 'delete' : 'restore'}
                          </span>
                          <span class="tooltiptext">
                              ${factura.estadoFactura === 1 ? 'Eliminar factura' : 'Reactivar factura'}
                          </span>
                      </button>
                  </td>
              `;
        tbody.appendChild(row);
      });

      // Actualizar los botones de paginación
      actualizarPaginacion(respuesta.paginacion, ".pagination", 6);
    });
  }, 100);
}


function cargarPtroveedores(idSelect, mensajeQuemado) {
  window.api.obtenerProveedores(null, null, 1, null, (respuesta) => {
    const proveedorSelect = document.getElementById(idSelect);
    proveedorSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    proveedorSelect.appendChild(option);

    respuesta.proveedores.forEach((proveedor) => {
      const option = document.createElement("option");
      option.value = proveedor.idProveedor;
      option.textContent = proveedor.nombre;
      proveedorSelect.appendChild(option);
    });
  });
}

function cargarComprobantesPago(idSelect, mensajeQuemado) {
  window.api.obtenerComprobantesPago(null, null, null, null, null, null, 1, (respuesta) => {
    const comprobantePagoSelect = document.getElementById(idSelect);
    comprobantePagoSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    comprobantePagoSelect.appendChild(option);

    respuesta.comprobantes.forEach((comprobante) => {
      const option = document.createElement("option");
      option.value = comprobante.idComprobantePago;
      option.textContent = comprobante.numeroComprobantePago;
      comprobantePagoSelect.appendChild(option);
    });
  });
}

function cargarColaboradores(idSelect, mensajeQuemado) {
  window.api.obtenerColaboradores(null, null, 1, null, null, null, (respuesta) => {
    const colaboradorSelect = document.getElementById(idSelect);
    colaboradorSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    colaboradorSelect.appendChild(option);

    respuesta.colaboradores.forEach((colaborador) => {
      const option = document.createElement("option");
      option.value = colaborador.idColaborador;
      option.textContent = `${colaborador.nombreColaborador} ${colaborador.primerApellidoColaborador} ${colaborador.segundoApellidoColaborador || ''}`;
      option.setAttribute("data-correo", colaborador.correo);
      option.setAttribute("data-telefono", colaborador.numTelefono);
      option.setAttribute("data-departamento", colaborador.nombreDepartamento);
      option.setAttribute("data-puesto", colaborador.nombrePuesto);
      colaboradorSelect.appendChild(option);
    });
    console.log("Respuesta de colaboradores:", respuesta);
  });
}
function actualizarDatosColaborador(select) {
  const selectedOption = select.options[select.selectedIndex]; // La opción seleccionada

  // Determinar si es el colaborador que entrega o recibe según el ID del select
  const esColaboradorSacando = select.id === 'colaborador-entregando';
  const prefijo = esColaboradorSacando ? 'sacando' : 'recibiendo';

  // Obtener los inputs correspondientes
  const correoInput = document.getElementById(`correo-${prefijo}`);
  const telefonoInput = document.getElementById(`telefono-${prefijo}`);
  const departamentoInput = document.getElementById(`departamento-${prefijo}`);
  const puestoInput = document.getElementById(`puesto-${prefijo}`);

  // Si se selecciona "Seleccione un colaborador" (value="0"), limpiar los inputs
  if (selectedOption.value === "0") {
    correoInput.value = '';
    telefonoInput.value = '';
    departamentoInput.value = '';
    puestoInput.value = '';
  } else {
    // Llenar los inputs con los datos de los atributos data-*
    correoInput.value = selectedOption.dataset.correo || '';
    telefonoInput.value = selectedOption.dataset.telefono || '';
    departamentoInput.value = selectedOption.dataset.departamento || '';
    puestoInput.value = selectedOption.dataset.puesto || '';
  }
}

/* SALIDA PRODUCTOOOO*/

function cargarSalidasTabla(
  pageSize = 10,
  currentPage = 1,
  estado = 1,
  valorBusqueda = null,
  filtroColaboradorSacando = null,
  filtroColaboradorRecibiendo = null,
  fechaInicio = null,
  fechaFin = null,
  filtroUsuario = null
) {
  cargarColaboradores("colaboradorSacando", "Filtrar por colaborador");
  cargarColaboradores("colaboradorRecibiendo", "Filtrar por colaborador");

  setTimeout(() => {
    if (filtroColaboradorSacando) {
      document.getElementById("colaboradorSacando").value = filtroColaboradorSacando;
    }
    if (filtroColaboradorRecibiendo) {
      document.getElementById("colaboradorRecibiendo").value = filtroColaboradorRecibiendo;
    }
    window.api.obtenerSalidas(
      pageSize, currentPage, estado, valorBusqueda,
      filtroColaboradorSacando, filtroColaboradorRecibiendo,
      fechaInicio, fechaFin, filtroUsuario,
      (respuesta) => {
        const tbody = document.querySelector("#salidas-table-body");
        tbody.innerHTML = "";

        if (!respuesta.salidas || respuesta.salidas.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">No se encontraron resultados</td></tr>`;
          return;
        }

        respuesta.salidas.forEach(salida => {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>${salida.nombreColaboradorSacando || 'Sin colaborador'}</td>
                    <td>${salida.nombreColaboradorRecibiendo || 'Sin colaborador'}</td>
                    <td>${new Date(salida.fechaSalida).toLocaleDateString()}</td>
                    <td>${salida.nombreUsuario || 'Desconocido'}</td>
                    <td>
                        <button class="tooltip" value="${salida.idSalida}" onclick="verDetallesSalida(this.value, '/salida-producto/editar-salida.html', 2)">
                            <span class="material-icons">edit</span>
                            <span class="tooltiptext">Editar factura</span>
                        </button>
                    </td>
                `;
          tbody.appendChild(row);
        });

        actualizarPaginacion(respuesta, ".pagination", 8);
      }
    );

  }, 100);
}
function llenarSelectsColaboradores() {
  window.api.obtenerColaboradores(null, null, null, null, null, null, (colaboradores) => {
      // Llenar el <select> del colaborador que entrega
      const selectSacando = document.getElementById('colaborador-entregando');
      selectSacando.innerHTML = '<option value="0">Seleccione un colaborador</option>' +
          colaboradores.colaboradores.map(col => `
              <option value="${col.idColaborador}" 
                      data-correo="${col.correo}" 
                      data-telefono="${col.numTelefono}" 
                      data-departamento="${col.nombreDepartamento}" 
                      data-puesto="${col.nombrePuesto}">
                  ${col.nombreColaborador} ${col.primerApellidoColaborador} ${col.segundoApellidoColaborador || ''}
              </option>
          `).join('');

      // Llenar el <select> del colaborador que recibe
      const selectRecibiendo = document.getElementById('colaborador-recibiendo');
      selectRecibiendo.innerHTML = '<option value="0">Seleccione un colaborador</option>' +
          colaboradores.colaboradores.map(col => `
              <option value="${col.idColaborador}" 
                      data-correo="${col.correo}" 
                      data-telefono="${col.numTelefono}" 
                      data-departamento="${col.nombreDepartamento}" 
                      data-puesto="${col.nombrePuesto}">
                  ${col.nombreColaborador} ${col.primerApellidoColaborador} ${col.segundoApellidoColaborador || ''}
              </option>
          `).join('');

      // Agregar eventos onchange para actualizar los datos al seleccionar un colaborador
      selectSacando.addEventListener('change', () => actualizarDatosColaborador(selectSacando));
      selectRecibiendo.addEventListener('change', () => actualizarDatosColaborador(selectRecibiendo));
  });
}
function actualizarDatosColaborador(select) {
  const selectedOption = select.options[select.selectedIndex]; // La opción seleccionada

  // Determinar si es el colaborador que entrega o recibe según el ID del select
  const esColaboradorSacando = select.id === 'colaborador-entregando';
  const prefijo = esColaboradorSacando ? 'sacando' : 'recibiendo';

  // Obtener los inputs correspondientes
  const correoInput = document.getElementById(`correo-${prefijo}`);
  const telefonoInput = document.getElementById(`telefono-${prefijo}`);
  const departamentoInput = document.getElementById(`departamento-${prefijo}`);
  const puestoInput = document.getElementById(`puesto-${prefijo}`);

  // Si se selecciona "Seleccione un colaborador" (value="0"), limpiar los inputs
  if (selectedOption.value === "0") {
      correoInput.value = '';
      telefonoInput.value = '';
      departamentoInput.value = '';
      puestoInput.value = '';
  } else {
      // Llenar los inputs con los datos de los atributos data-*
      correoInput.value = selectedOption.dataset.correo || '';
      telefonoInput.value = selectedOption.dataset.telefono || '';
      departamentoInput.value = selectedOption.dataset.departamento || '';
      puestoInput.value = selectedOption.dataset.puesto || '';
  }
}

function cargarProductos(idSelect, mensajeQuemado) {
  console.log("📢 Solicitando productos para el select:", idSelect);

  window.api.obtenerProductos(null, null, 1, null, null, (respuesta) => {
    console.log("✅ Productos recibidos en el frontend:", respuesta);

    const productoSelect = document.getElementById(idSelect);
    productoSelect.innerHTML = ""; // Limpiar las opciones existentes

    const option = document.createElement("option");
    option.value = "0";
    option.textContent = mensajeQuemado;
    productoSelect.appendChild(option);

    respuesta.productos.forEach((producto) => {
      console.log("➡️ Procesando producto:", producto);

      const option = document.createElement("option");
      option.value = producto.idProducto;
      option.textContent = producto.nombreProducto;
      option.setAttribute("data-unidad", producto.unidadMedicion);
      option.setAttribute("data-cantidad", producto.cantidad);
      productoSelect.appendChild(option);
    });
  });
}
function cargarProductosSalida(idSalida) {
  console.log("Iniciando carga de productos para la salida con ID:", idSalida); // Depuración inicial

  window.api.obtenerProductosPorSalida(idSalida, (productos) => {
    console.log("Productos recibidos desde el backend:", productos); // Verificar los datos recibidos

    const tbody = document.querySelector("#productos-salida-table-body");
    if (!tbody) {
      console.error("El elemento #productos-salida-table-body no existe en el DOM."); // Depuración
      return;
    }

    tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    if (!productos || productos.length === 0) {
      console.warn("No se encontraron productos para la salida con ID:", idSalida); // Advertencia si no hay productos
      const row = document.createElement("tr");
      row.innerHTML = `
              <td colspan="7" style="text-align: center; color: gray; font-style: italic;">
                  No hay productos registrados para esta salida.
              </td>
          `;
      tbody.appendChild(row);
      return;
    }

    productos.forEach(producto => {
      console.log("Procesando producto:", producto); // Depuración para cada producto
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${producto.idSalidaProducto}</td>
              <td>${producto.idProducto}</td>
              <td>${producto.nombreProducto}</td>
              <td>${producto.cantidadAnterior}</td>
              <td>${producto.cantidadSaliendo}</td>
              <td>${producto.cantidadNueva}</td>
              <td>${producto.estado === 1 ? 'Activo' : 'Inactivo'}</td>
          `;
      tbody.appendChild(row);
    });
  });
}

function verDetallesSalida(idSalida) {
  console.log("Cargando detalles para la salida con ID:", idSalida); // Depuración inicial

  adjuntarHTML('/salida-producto/salida-producto.html', () => {
    console.log("Vista salida-producto.html cargada correctamente."); // Confirmar que la vista se cargó
    cargarProductosSalida(idSalida);
  });
}

function agregarProducto() {
  const productsBody = document.getElementById('products-body');
  const row = document.createElement('tr');
  row.className = 'product-row';
  row.innerHTML = `
      <td>
          <select class="form-select product-select" onchange="actualizarCamposProducto(this)" required>
              <option value="">Seleccione un producto</option>
              <!-- Opciones cargadas dinámicamente -->
          </select>
      </td>
      <td><input type="text" class="form-control product-unit" readonly></td>
      <td><input type="number" class="form-control product-prev-qty" readonly></td>
      <td><input type="number" class="form-control product-out-qty" min="1" required></td>
      <td><input type="number" class="form-control product-new-qty" readonly></td>
      <td class="no-print"><i class="material-icons delete-product" onclick="this.closest('tr').remove()">delete</i></td>
  `;
  productsBody.appendChild(row);

  // Cargar productos en el nuevo select
  cargarProductos();
}
function actualizarCamposProducto(select) {
  const selectedOption = select.options[select.selectedIndex];
  console.log("📢 Producto seleccionado:", selectedOption);

  const unidad = selectedOption.getAttribute("data-unidad") || "N/A";
  const cantidadAnterior = selectedOption.getAttribute("data-cantidad") || 0;

  // Obtener la fila actual del producto
  const row = select.closest('tr');
  const unidadInput = row.querySelector('.product-unit');
  const cantidadAnteriorInput = row.querySelector('.product-prev-qty');

  // Actualizar los valores de los campos
  unidadInput.value = unidad;
  cantidadAnteriorInput.value = cantidadAnterior;
}
function cargarVistaCrearSalida() {
  llenarSelectsColaboradores();
  cargarProductos('productosComboBox', 'Seleccione un producto');
  window.api.obtenerUsuarioLogueado((respuesta) => {
    const usuario = respuesta.usuario;
    console.log(usuario);
    document.getElementById('nombreUsuarioRegistro').textContent = usuario.nombreUsuario;
    document.getElementById("idUsuario").value = usuario.idUsuario;
  });
}

