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

function cargarUsuariosTabla(pageSize = 10, pageNumber = 1, estado = 2, idRolFiltro = 0, valorBusqueda = null) {

  // Obtener el select por su id
  const selectEstado = document.getElementById('filtrado-estado');
  const selectPageSize = document.getElementById('selectPageSize');
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
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="${usuario.estado === 1 ? `eliminarUsuario(this.value, 0, 'Eliminando usuario', '¿Está seguro que desea eliminar a este usuario?')` : `eliminarUsuario(this.value, 1, 'Reactivando usuario', '¿Está seguro que desea reactivar a este usuario?')`}">
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

      cerrarModal(); // Cerrar cualquier modal activo
    });
  }, 100);
}


function actualizarPaginacion(pagination, idInnerDiv, moduloPaginar) {
  const paginacionDiv = document.querySelector(idInnerDiv);

  // Limpiar el contenido previo de paginación
  paginacionDiv.innerHTML = "";

  // Botón "Primera página"
  const firstPageButton = document.createElement("button");
  firstPageButton.innerHTML = `<span class="material-icons">first_page</span>`;
  firstPageButton.disabled = pagination.currentPage === 1; // Deshabilitar si ya estamos en la primera página
  firstPageButton.addEventListener("click", () => {
    if (moduloPaginar === 1) {
      cargarUsuariosTabla(pagination.pageSize, 1, pagination.estado, pagination.idRol);
    }else if(moduloPaginar === 2){
      cargarColaboradoresTabla(pagination.pageSize, 1, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda)
    }
  });
  paginacionDiv.appendChild(firstPageButton);

  // Botón "Página anterior"
  const prevPageButton = document.createElement("button");
  prevPageButton.innerHTML = `<span class="material-icons">navigate_before</span>`;
  prevPageButton.disabled = pagination.currentPage === 1; // Deshabilitar si ya estamos en la primera página
  prevPageButton.addEventListener("click", () => {
    if (moduloPaginar === 1) {
      cargarUsuariosTabla(pagination.pageSize, pagination.currentPage - 1, pagination.estado, pagination.idRol);
    }else if(moduloPaginar === 2){
      cargarColaboradoresTabla(pagination.pageSize, pagination.currentPage - 1, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda)
    }
  });
  paginacionDiv.appendChild(prevPageButton);

  // Páginas numeradas
  //for (let i = 1; i <= pagination.totalPages; i++) {
  const pageSpan = document.createElement("span");
  pageSpan.textContent = pagination.currentPage + ' de ' + pagination.totalPages;
  pageSpan.setAttribute('data-value', pagination.currentPage);
  pageSpan.classList.add("currentPage");
  /*if (i === pagination.currentPage) {
    pageSpan.classList.add("active"); // Añadir clase activa para la página actual
  }
  pageSpan.addEventListener("click", () => {
    cargarUsuariosTabla(pagination.pageSize, i, pagination.estado);
  });
  paginacionDiv.appendChild(pageSpan);
}*/
  paginacionDiv.appendChild(pageSpan);

  // Botón "Siguiente página"
  const nextPageButton = document.createElement("button");
  nextPageButton.innerHTML = `<span class="material-icons">navigate_next</span>`;
  nextPageButton.disabled = pagination.currentPage === pagination.totalPages; // Deshabilitar si ya estamos en la última página
  nextPageButton.addEventListener("click", () => {
    if (moduloPaginar === 1) {
      cargarUsuariosTabla(pagination.pageSize, pagination.currentPage + 1, pagination.estado, pagination.idRol);
    }else if(moduloPaginar === 2){
      cargarColaboradoresTabla(pagination.pageSize, pagination.currentPage + 1, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda)
    }
  });
  paginacionDiv.appendChild(nextPageButton);

  // Botón "Última página"
  const lastPageButton = document.createElement("button");
  lastPageButton.innerHTML = `<span class="material-icons">last_page</span>`;
  lastPageButton.disabled = pagination.currentPage === pagination.totalPages; // Deshabilitar si ya estamos en la última página
  lastPageButton.addEventListener("click", () => {
    if(moduloPaginar === 1){
      cargarUsuariosTabla(pagination.pageSize, pagination.totalPages, pagination.estado, pagination.idRol);
    }else if(moduloPaginar === 2){
      cargarColaboradoresTabla(pagination.pageSize, 1, pagination.estado, pagination.idPuesto, pagination.idDepartamento, pagination.valorBusqueda)
    }
  });
  paginacionDiv.appendChild(lastPageButton);
}

function filterTable() {
  cargarUsuariosTabla(Number(document.getElementById("selectPageSize").value), Number(document.querySelector('.currentPage').getAttribute('data-value')), Number(document.getElementById("filtrado-estado").value), Number(document.getElementById("filtrado-role").value), document.getElementById("search-bar").value);
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
            filterTable();
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


function eliminarUsuario(id, estado, title, message) {
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
      // Enviar los datos al proceso principal a través de preload.js
      window.api.eliminarUsuario(Number(id), Number(estado));

      // Mostrar el resultado de la actualización al recibir la respuesta
      window.api.onRespuestaEliminarUsuario((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            filterTable();
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
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
            filterTable();
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
function cerrarModal() {
  console.log("se llamo a la función cerrar modal");
  document.getElementById("editarUsuarioModal").style.display = "none";
  // Limpiar los campos del formulario y resetear mensajes de error
  document.getElementById("editarUsuarioForm").reset();
  document.getElementById("passwordError").style.display = "none";
  document.getElementById("newPassword").style.border = "";
  document.getElementById("confirmPassword").style.border = "";
  document.getElementById("nombreUsuario").style.border = "";
  document.getElementById("colaboradorName").style.border = "";
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

function cargarColaboradoresTabla(pageSize = 10, currentPage = 1, estadoColaborador = 2, idPuestoFiltro = 0, idDepartamentoFiltro = 0, valorBusqueda = null) {

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
              <button class="tooltip" value="${colaborador.idColaborador}" onclick="${colaborador.estado === 1 ? `eliminarColaborador(this.value, 0, 'Eliminando colaborador', '¿Está seguro que desea eliminar a este colaborador?')` : `eliminarColaborador(this.value, 1, 'Reactivando colaborador', '¿Está seguro que desea reactivar a este colaborador?')`}">
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
      `;
      tbody.appendChild(row);
    });

    // Actualizar los botones de paginación
    actualizarPaginacion(respuesta.paginacion, ".pagination", 2);

    cerrarModal(); // Cerrar cualquier modal activo
  });
}