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
    });
}

function limpiarDIV(){
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