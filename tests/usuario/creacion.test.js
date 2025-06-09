/**
 * @jest-environment jsdom
 */

const confirmFireMock = jest.fn().mockResolvedValue({ isConfirmed: true });

jest.mock('sweetalert2', () => ({
  fire: confirmFireMock,
  mixin: jest.fn(() => ({
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  })),
}));

const Swal = require('sweetalert2');
global.Swal = Swal;

// Mocks globales para Electron API
global.window = Object.create(window);
global.window.api = {
  crearUsuario: jest.fn(),
  onRespuestaCrearUsuario: jest.fn(),
  obtenerColaboradores: jest.fn((pageSize, currentPage, estadoColaborador, idPuestoFiltro, idDepartamentoFiltro, valorBusqueda, callback) => {
    callback({ colaboradores: [{ idColaborador: 1, nombreColaborador: 'Juan', primerApellidoColaborador: 'Pérez', segundoApellidoColaborador: 'Gómez' }] });
  }),
};

// Mock funciones globales que podrían estar en dashboard.js
global.mostrarToastConfirmacion = jest.fn();
global.mostrarToastError = jest.fn();
global.filterTable = jest.fn();

beforeEach(() => {
  // Reiniciar DOM con la estructura del modal de usuarios
  document.body.innerHTML = `
    <div id="editarUsuarioModal" class="modal">
      <form id="editarUsuarioForm" class="editar-usuario-form">
        <select id="colaboradorName">
          <option value="">Seleccione un colaborador</option>
          <option value="1">Juan Pérez Gómez</option>
        </select>
        <input id="nombreUsuario" value="juanperez"/>
        <input type="password" id="newPassword" value="Password123"/>
        <input type="password" id="confirmPassword" value="Password123"/>
        <select id="roleName">
          <option value="">Selecciona un rol</option>
          <option value="1">Admin</option>
        </select>
        <p id="passwordError" style="display: none;"></p>
      </form>
    </div>
  `;

  // Limpia mocks
  jest.clearAllMocks();
});

describe('Pruebas unitarias para enviarCreacionUsuario', () => {
  test('debería mostrar mensaje de error si hay campos vacíos', () => {
    // Simula campos vacíos
    document.getElementById('colaboradorName').value = '';
    document.getElementById('nombreUsuario').value = '';

    // Importa la función a probar
    const { enviarCreacionUsuario } = require('../../public/js/dashboard-js/dashboard.js');

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);

    // Verifica que preventDefault fue llamado
    expect(event.preventDefault).toHaveBeenCalled();

    // Verifica que se mostró el mensaje de error
    expect(document.getElementById('passwordError').innerText).toBe('Por favor, complete todos los campos.');
    expect(document.getElementById('passwordError').style.display).toBe('block');

    // Verifica que no se llamó a crearUsuario
    expect(window.api.crearUsuario).not.toHaveBeenCalled();
    // Verifica que no se mostró la confirmación de SweetAlert
    expect(confirmFireMock).not.toHaveBeenCalled();
  });

  test('debería no marcar campos vacíos con borde rojo', () => {
    // Simula campos vacíos
    document.getElementById('colaboradorName').value = '';
    document.getElementById('nombreUsuario').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('roleName').value = '';

    // Importa la función a probar
    const { enviarCreacionUsuario } = require('../../public/js/dashboard-js/dashboard.js');

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);

    // Verifica que los campos vacíos no tienen borde rojo
    expect(document.getElementById('colaboradorName').style.border).toBe('');
    expect(document.getElementById('nombreUsuario').style.border).toBe('');
    expect(document.getElementById('newPassword').style.border).toBe('');
    expect(document.getElementById('confirmPassword').style.border).toBe('');
    expect(document.getElementById('roleName').style.border).toBe('');

    // Verifica el mensaje de error
    expect(document.getElementById('passwordError').innerText).toBe('Por favor, complete todos los campos.');
    expect(document.getElementById('passwordError').style.display).toBe('block');

    // Verifica que no se llamó a crearUsuario
    expect(window.api.crearUsuario).not.toHaveBeenCalled();
  });

  test('debería mostrar mensaje de error si la contraseña no cumple con los requisitos', () => {
    // Simula una contraseña inválida
    document.getElementById('colaboradorName').value = '1';
    document.getElementById('nombreUsuario').value = 'juanperez';
    document.getElementById('newPassword').value = 'pass'; // Contraseña inválida
    document.getElementById('confirmPassword').value = 'pass';
    document.getElementById('roleName').value = '1';

    // Importa la función a probar
    const { enviarCreacionUsuario } = require('../../public/js/dashboard-js/dashboard.js');

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);

    // Verifica que preventDefault fue llamado
    expect(event.preventDefault).toHaveBeenCalled();

    // Verifica que se mostró el mensaje de error
    expect(document.getElementById('passwordError').innerText).toBe('La contraseña debe tener al menos 6 caracteres, incluyendo números y letras.');
    expect(document.getElementById('passwordError').style.display).toBe('block');

    // Verifica que el campo de contraseña tiene borde rojo
    expect(document.getElementById('newPassword').style.border).toBe('2px solid red');
    // Verifica que confirmPassword no tiene borde rojo (porque no llegó a esa validación)
    expect(document.getElementById('confirmPassword').style.border).toBe('');

    // Verifica que no se llamó a crearUsuario
    expect(window.api.crearUsuario).not.toHaveBeenCalled();
    // Verifica que no se mostró la confirmación de SweetAlert
    expect(confirmFireMock).not.toHaveBeenCalled();
  });

  test('debería mostrar mensaje de error si las contraseñas no coinciden', () => {
    // Simula contraseñas que no coinciden
    document.getElementById('colaboradorName').value = '1';
    document.getElementById('nombreUsuario').value = 'juanperez';
    document.getElementById('newPassword').value = 'Password123';
    document.getElementById('confirmPassword').value = 'Different123';
    document.getElementById('roleName').value = '1';

    // Importa la función a probar
    const { enviarCreacionUsuario } = require('../../public/js/dashboard-js/dashboard.js');

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);

    // Verifica que preventDefault fue llamado
    expect(event.preventDefault).toHaveBeenCalled();

    // Verifica que se mostró el mensaje de error
    expect(document.getElementById('passwordError').innerText).toBe('Las contraseñas no coinciden.');
    expect(document.getElementById('passwordError').style.display).toBe('block');

    // Verifica que ambos campos de contraseña tienen borde rojo
    expect(document.getElementById('newPassword').style.border).toBe('2px solid red');
    expect(document.getElementById('confirmPassword').style.border).toBe('2px solid red');

    // Verifica que no se llamó a crearUsuario
    expect(window.api.crearUsuario).not.toHaveBeenCalled();
    // Verifica que no se mostró la confirmación de SweetAlert
    expect(confirmFireMock).not.toHaveBeenCalled();
  });
});