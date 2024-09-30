// login.js
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    validarInicioSesion();
});

function validarInicioSesion() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Enviar los datos de inicio de sesión al proceso principal
    window.api.sendLogin(username, password);

    // Manejar el resultado del inicio de sesión
    window.api.onLoginResult((result) => {
        if (result.success) {
            // Mostrar alerta de éxito
            mostrarToastConfirmacion(result.message);
            // Enviar un mensaje al proceso principal para cambiar la vista
            setTimeout(() => {
                window.api.sendView(result);
            }, 2000); // Tiempo de espera antes de la redirección
        } else {
            // Mostrar alerta de error
            mostrarToastError(result.message);
        }
    });
}


// Función para mostrar un Toast de error
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

// renderer.js
function adjuntarHTML() {
    const filePath = 'views/dashboard/holaxd.html';  // La ruta relativa del archivo HTML
    window.api.loadHTML(filePath);  // Solicita cargar el archivo HTML
    // Recibir el contenido del archivo HTML y adjuntarlo a innerHTML
    window.api.onHTMLLoaded((data) => {
        document.getElementById('holaxd').innerHTML = data;
    });
}