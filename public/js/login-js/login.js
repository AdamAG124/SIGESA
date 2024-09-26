// login.js
document.querySelector('.login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var usuario = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    // Aquí iría la lógica de autenticación
    alert('Nombre de usuario: ' + usuario + '\nContraseña: ' + password);
});
