function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    submenu.classList.toggle('active');
    const arrow = document.getElementById(id + '-arrow');
    arrow.classList.toggle('rotate');
}

function showUserData() {
    window.api.receiveUserData((user) => {
        if (user) {
            document.getElementById('user-name').innerText = user.nombre + ' ' + user.primerApellido;
            document.getElementById('user-role').innerText = user.roleName;
        } else {
            console.log('No se encontraron datos de usuario.');
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
    })
}

// renderer.js
function adjuntarHTML(filePath) {
    window.api.loadHTML(filePath);  // Solicita cargar el archivo HTML
    // Recibir el contenido del archivo HTML y adjuntarlo a innerHTML
    window.api.onHTMLLoaded((data) => {
        document.getElementById('inner-div').innerHTML = data;
        cargarUsuariosTabla();
    });
}

function limpiarDIV() {
    document.getElementById('inner-div').innerHTML = '';
}


function mostrarToastError(mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000
    });
    Toast.fire({
        icon: 'error',
        title: mensaje
    });
}

// Función para mostrar un Toast de confirmación
function mostrarToastConfirmacion(titulo) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000
    });
    Toast.fire({
        icon: 'success',
        title: titulo
    });
}

function cargarUsuariosTabla() {
    window.api.obtenerUsuarios((usuarios) => {
        const tbody = document.getElementById('usuarios-body');
        tbody.innerHTML = ''; // Limpiar contenido previo

        usuarios.forEach(usuario => {
            // Concatenar el nombre del colaborador con los apellidos
            const nombreCompleto = `${usuario.nombreColaborador} ${usuario.primerApellidoColaborador} ${usuario.segundoApellidoColaborador}`;

            // Verificar el estado del usuario
            const estadoUsuario = usuario.estado === 1 ? 'Activo' : 'Inactivo';

            const row = document.createElement('tr');
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
                    <button class="tooltip" value="${usuario.idUsuario}" onclick="verDetallesUsuario(this.value)">
                        <span class="material-icons">info</span>
                        <span class="tooltiptext">Ver detalles</span>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Funciones de acción (debes implementarlas según tu lógica)
function editarUsuario(id) {
    window.api.obtenerUsuarios((usuarios) => {
        usuarios.forEach(usuario => {
            if (usuario.idUsuario === Number(id)) {
                document.getElementById('nombreUsuario').value = usuario.nombreUsuario;

                // Cargar la lista de roles y preseleccionar el rol del usuario
                window.api.obtenerRoles((roles) => {
                    const roleSelect = document.getElementById('roleName');
                    roleSelect.innerHTML = ''; // Limpiar las opciones existentes

                    roles.forEach(role => {
                        const option = document.createElement('option');
                        option.value = role.idRole; // Asumiendo que tu objeto role tiene un idRole
                        option.textContent = role.roleName; // Asumiendo que tu objeto role tiene un roleName
                        roleSelect.appendChild(option);
                    });

                    // Preseleccionar el rol del usuario
                    roleSelect.value = usuario.role.toString(); // Suponiendo que el rol del usuario tiene una propiedad idRole
                    
                });

                // Mostrar el modal
                document.getElementById('editarUsuarioModal').style.display = 'block';
            }
        });
    });
}


function eliminarUsuario(id) {
    console.log(`Eliminar usuario con ID: ${id}`);
    // Lógica para eliminar el usuario
}

function verDetallesUsuario(id) {
    console.log(`Ver detalles del usuario con ID: ${id}`);
    // Lógica para ver los detalles del usuario
}

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById('editarUsuarioModal').style.display = 'none';
}

function cargarRoles() {
    window.api.obtenerRoles((roles) => {
        const roleSelect = document.getElementById('roleName');
        roleSelect.innerHTML = ''; // Limpiar las opciones existentes

        roles.forEach(role => {
            const option = document.createElement('option');
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
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye-slash'); // Ojo cerrado
        icon.classList.add('fa-eye'); // Ojo abierto
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye'); // Ojo abierto
        icon.classList.add('fa-eye-slash'); // Ojo cerrado
    }
}
