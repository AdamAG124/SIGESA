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

      cerrarModal("editarUsuarioModal", "editarUsuarioForm"); // Cerrar cualquier modal activo
    });
  }, 100);
}

function checkEmpty(event) {
  const searchValue = document.getElementById("search-bar").value.trim();

  if (searchValue === "") {
    filterTable(3); // Llama a filterTable solo si el campo está vacío
  }

  if (event.key === "Enter") {
    filterTable(3); // Llama a filterTable cuando se presiona "Enter"
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
        cargarUsuariosTabla(pagination.pageSize, page, pagination.estado, pagination.idRol);
        break;
      case 2:
        cargarColaboradoresTabla(pagination.pageSize, page, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda);
        break;
      case 3:
        cargarProveedoresTabla(pagination.pageSize, page, pagination.estado, pagination.valorBusqueda);
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
  pageSpan.textContent = `${pagination.currentPage} de ${pagination.totalPages}`;
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

  // Cargar la lista de roles y preseleccionar el rol del usuario
  /*roleSelectDestino.innerHTML = ""; // Limpiar las opciones existentes
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecciona un rol";
  roleSelectDestino.appendChild(defaultOption);*/

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
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.getElementById("passwordError");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

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
    icon: "question",
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

  window.api.obtenerColaboradores(pageSize = null, currentPage = null, estadoColaborador = null, idPuestoFiltro = null, idDepartamentoFiltro = null, valorBusqueda = null, (respuesta) => {
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

  /*window.api.obtenerUsuarios((usuarios) => {
    for (const usuario of usuarios) {
      if (usuario.idColaborador === Number(colaborador)) {
        passwordError.innerText = "El colaborador ya tiene un usuario asociado.";
        passwordError.style.display = "block";
        return; // Detener el envío del formulario si el colaborador ya tiene un usuario asociado
      }
      if (usuario.nombreUsuario === nombreUsuario) {
        passwordError.innerText = "El nombre de usuario ya existe.";
        passwordError.style.display = "block";
        return; // Detener el envío del formulario si el nombre de usuario ya existe
      }
    }*/

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
// Función para formatear las fechas en yyyy-MM-dd
function formatearFecha(fecha) {
  if (!fecha) return 'N/A'; // Maneja el caso de fecha vacía o nula
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Añadir ceros iniciales
  const day = ('0' + date.getDate()).slice(-2); // Añadir ceros iniciales
  return `${year}-${month}-${day}`;
}

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