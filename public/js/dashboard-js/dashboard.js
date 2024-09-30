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