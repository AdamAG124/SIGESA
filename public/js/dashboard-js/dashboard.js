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

// renderer.js
function adjuntarHTML(filePath) {
  window.api.loadHTML(filePath); // Solicita cargar el archivo HTML
  // Recibir el contenido del archivo HTML y adjuntarlo a innerHTML
  window.api.onHTMLLoaded((data) => {
    document.getElementById("inner-div").innerHTML = data;
    cargarUsuariosTabla();
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

function cargarUsuariosTabla() { 
  window.api.obtenerUsuarios((usuarios) => {
    const tbody = document.getElementById("usuarios-body");
    tbody.innerHTML = ""; // Limpiar contenido previo

    usuarios.forEach((usuario) => {
      // Concatenar el nombre del colaborador con los apellidos
      const nombreCompleto = `${usuario.nombreColaborador} ${usuario.primerApellidoColaborador} ${usuario.segundoApellidoColaborador}`;

      // Verificar el estado del usuario
      const estadoUsuario = usuario.estado === 1 ? "Activo" : "Inactivo";

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${nombreCompleto}</td>
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.roleName}</td>
                <td>${estadoUsuario}</td> <!-- Aquí se imprime el estado -->
                <td class="action-icons">
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="editarUsuario(this.value)">
                        <span class="material-icons">edit</span>
                        <span class="tooltiptext">Editar usuario</span>
                    </button>
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="eliminarUsuario(this.value)">
                        <span class="material-icons">delete</span>
                        <span class="tooltiptext">Eliminar usuario</span>
                    </button>
                    <!--<button class="tooltip" value="${usuario.idUsuario}" onclick="verDetallesUsuario(this.value)">
                        <span class="material-icons">info</span>
                        <span class="tooltiptext">Ver detalles</span>
                    </button>-->
                </td>
            `;
      tbody.appendChild(row);
    });
    cerrarModal();
  });
}

function editarUsuario(id) {
  const colaboradorSelect = document.getElementById("colaboradorName");
  const colaboradorSelectLabel = document.getElementById("colaboradorSelectLabel");
  colaboradorSelect.style.display = "none";
  colaboradorSelectLabel.style.display = "none";
  window.api.obtenerUsuarios((usuarios) => {
    usuarios.forEach((usuario) => {
      if (usuario.idUsuario === Number(id)) {
        document.getElementById("idUsuario").value = usuario.idUsuario;
        document.getElementById("nombreUsuario").value = usuario.nombreUsuario;

        // Cargar la lista de roles y preseleccionar el rol del usuario
        window.api.obtenerRoles((roles) => {
          const roleSelect = document.getElementById("roleName");
          roleSelect.innerHTML = ""; // Limpiar las opciones existentes
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "Selecciona un rol";
          roleSelect.appendChild(option);

          roles.forEach((role) => {
            const option = document.createElement("option");
            option.value = role.idRole; // Asumiendo que tu objeto role tiene un idRole
            option.textContent = role.roleName; // Asumiendo que tu objeto role tiene un roleName
            roleSelect.appendChild(option);
          });

          // Preseleccionar el rol del usuario
          roleSelect.value = usuario.role; // Suponiendo que el rol del usuario tiene una propiedad idRole
        });

        document.getElementById("modalTitle").innerText = "Editar Usuario";
        document.getElementById("buttonModal").onclick = enviarEdicionUsuario;
        // Mostrar el modal
        document.getElementById("editarUsuarioModal").style.display = "block";
      }
    });
  });
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
            adjuntarHTML('/usuarios/usuarios-admin.html');
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
      console.log(jsonData);
    }
  });
}


function eliminarUsuario(id) {
  Swal.fire({
    title: "Eliminando usuario",
    text: "¿Esta seguro que desea eliminar a este usuario?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Enviar los datos al proceso principal a través de preload.js
      window.api.eliminarUsuario(Number(id));

      // Mostrar el resultado de la actualización al recibir la respuesta
      window.api.onRespuestaEliminarUsuario((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => {
            cargarUsuariosTabla();
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}

function agregarUsuario() {
  // Cargar la lista de roles y preseleccionar el rol del usuario
  window.api.obtenerRoles((roles) => {
    const roleSelect = document.getElementById("roleName");
    roleSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona un rol";
    roleSelect.appendChild(option);

    roles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.idRole; // Asumiendo que tu objeto role tiene un idRole
      option.textContent = role.roleName; // Asumiendo que tu objeto role tiene un roleName
      roleSelect.appendChild(option);
    });
  });

  window.api.obtenerColaboradores((colaboradores) => {
    const colaboradorSelect = document.getElementById("colaboradorName");
    const colaboradorSelectLabel = document.getElementById("colaboradorSelectLabel");
    colaboradorSelect.style.display = "block";
    colaboradorSelectLabel.style.display = "block";
    colaboradorSelect.innerHTML = ""; // Limpiar las opciones existentes
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona un colaborador";
    colaboradorSelect.appendChild(option);

    colaboradores.forEach((colaborador) => {
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

  window.api.obtenerUsuarios((usuarios) => {
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
    }

    // Si todas las validaciones son exitosas, crear el objeto JSON con los datos del usuario
    const jsonData = {
      colaborador: colaborador,
      nombreUsuario: nombreUsuario,
      newPassword: newPassword,
      roleName: roleName,
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
              adjuntarHTML('/usuarios/usuarios-admin.html');
            }, 2000);
          } else {
            mostrarToastError(respuesta.message);
          }
        });
        console.log(jsonData);
      }
    });
  });
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
}

function cargarRoles() {
  window.api.obtenerRoles((roles) => {
    const roleSelect = document.getElementById("roleName");
    roleSelect.innerHTML = ""; // Limpiar las opciones existentes

    roles.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.idRole; // Asumiendo que tu objeto role tiene un idRole
      option.textContent = role.roleName; // Asumiendo que tu objeto role tiene un roleName
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
