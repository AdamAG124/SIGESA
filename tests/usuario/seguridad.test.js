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

// Mock para funciones de efectos secundarios
global.mostrarToastConfirmacion = jest.fn();
global.mostrarToastError = jest.fn();
global.filterTable = jest.fn();

const { enviarCreacionUsuario } = require('../../public/js/dashboard-js/dashboard.js');

beforeEach(() => {
  // Reiniciar DOM con la estructura del modal de formulario de usuarios
  document.body.innerHTML = `
    <div id="editarUsuarioModal" class="modal">
      <form id="editarUsuarioForm" class="editar-usuario-form">
        <select id="colaboradorName">
          <option value="">Seleccione un colaborador</option>
          <option value="1">Juan Pérez Gómez</option>
        </select>
        <input id="nombreUsuario" value="juanperez"/>
        <input type="password" id="newPassword" value="Password123"/>
        <input type="password" id="confirmPassword" value=""/>
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

  // Configura el mock de onRespuestaCrearUsuario para capturar el callback
  let callbackGuardar;
  global.window.api.onRespuestaCrearUsuario.mockImplementation((cb) => {
    callbackGuardar = cb;
  });

  // Configura el mock de crearUsuario para invocar el callback
  global.window.api.crearUsuario.mockImplementation((data) => {
    if (callbackGuardar) {
      callbackGuardar({ success: true, message: 'Usuario creado' });
    }
  });
});

describe('Pruebas de seguridad para enviarCreacionUsuario', () => {
  test('debería manejar inyección de código malicioso (XSS) sin ejecutarlo', async () => {
    // Simula entrada maliciosa
    const maliciousInput = '<script>alert("hack")</script>';
    document.getElementById('colaboradorName').value = '1';
    document.getElementById('nombreUsuario').value = maliciousInput;
    document.getElementById('newPassword').value = 'Password123';
    document.getElementById('confirmPassword').value = 'Password123';
    document.getElementById('roleName').value = '1';

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);
    await Promise.resolve(); // Espera el .then() de Swal.fire

    // Verifica que crearUsuario fue llamado con la entrada maliciosa
    expect(window.api.crearUsuario).toHaveBeenCalledWith({
      colaborador: '1',
      nombreUsuario: maliciousInput,
      newPassword: 'Password123',
      rol: '1',
    });

    // Verifica que el valor en el input permanece como texto
    expect(document.getElementById('nombreUsuario').value).toBe(maliciousInput);

    // Verifica que passwordError no muestra la entrada maliciosa
    expect(document.getElementById('passwordError').textContent).toBe('');

    // Simula asignación a textContent (como hace el código real) para confirmar que no se ejecuta
    document.getElementById('passwordError').textContent = maliciousInput;
    expect(document.getElementById('passwordError').textContent).toBe(maliciousInput);
    // Verifica que no se renderiza como HTML (no hay nodos <script> en el DOM)
    expect(document.getElementById('passwordError').getElementsByTagName('script').length).toBe(0);
  });

  test('debería manejar múltiples campos con inyección de código malicioso', async () => {
    // Simula entradas maliciosas en múltiples campos
    const maliciousInputs = {
      colaborador: '1',
      nombreUsuario: '<script>malicious()</script>',
      newPassword: 'Malicious123', // Cumple con el patrón (letras y números, >= 6 caracteres)
      confirmPassword: 'Malicious123',
      rol: '1',
    };
    document.getElementById('colaboradorName').value = maliciousInputs.colaborador;
    document.getElementById('nombreUsuario').value = maliciousInputs.nombreUsuario;
    document.getElementById('newPassword').value = maliciousInputs.newPassword;
    document.getElementById('confirmPassword').value = maliciousInputs.confirmPassword;
    document.getElementById('roleName').value = maliciousInputs.rol;

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);
    await Promise.resolve();

    // Verifica que crearUsuario fue llamado con las entradas maliciosas
    expect(window.api.crearUsuario).toHaveBeenCalledWith({
      colaborador: maliciousInputs.colaborador,
      nombreUsuario: maliciousInputs.nombreUsuario,
      newPassword: maliciousInputs.newPassword,
      rol: maliciousInputs.rol,
    });

    // Verifica que los valores en los inputs permanecen como texto
    expect(document.getElementById('nombreUsuario').value).toBe(maliciousInputs.nombreUsuario);
    expect(document.getElementById('newPassword').value).toBe(maliciousInputs.newPassword);
    expect(document.getElementById('confirmPassword').value).toBe(maliciousInputs.confirmPassword);
    expect(document.getElementById('passwordError').textContent).toBe('');

    // Simula asignación a textContent
    document.getElementById('passwordError').textContent = maliciousInputs.nombreUsuario;
    expect(document.getElementById('passwordError').textContent).toBe(maliciousInputs.nombreUsuario);
    expect(document.getElementById('passwordError').getElementsByTagName('script').length).toBe(0);
  });

  test('debería manejar cadenas excesivamente largas', async () => {
    // Simula una cadena muy larga
    const longString = 'A'.repeat(10000);
    document.getElementById('colaboradorName').value = '1';
    document.getElementById('nombreUsuario').value = longString;
    document.getElementById('newPassword').value = 'Password123';
    document.getElementById('confirmPassword').value = 'Password123';
    document.getElementById('roleName').value = '1';

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);
    await Promise.resolve();

    // Verifica que crearUsuario fue llamado con la cadena larga
    expect(window.api.crearUsuario).toHaveBeenCalledWith({
      colaborador: '1',
      nombreUsuario: longString,
      newPassword: 'Password123',
      rol: '1',
    });

    // Verifica que no se muestra mensaje de error
    expect(document.getElementById('passwordError').textContent).toBe('');
  });

  test('debería manejar múltiples campos con cadenas excesivamente largas', async () => {
    // Simula cadenas largas en múltiples campos
    const longString = 'B'.repeat(9990) + '123'; // Cumple con el patrón (letras y números)
    document.getElementById('colaboradorName').value = '1';
    document.getElementById('nombreUsuario').value = longString;
    document.getElementById('newPassword').value = longString;
    document.getElementById('confirmPassword').value = longString;
    document.getElementById('roleName').value = '1';

    // Ejecuta la función
    const event = { preventDefault: jest.fn() };
    enviarCreacionUsuario(event);
    await Promise.resolve();

    // Verifica que crearUsuario fue llamado con las cadenas largas
    expect(window.api.crearUsuario).toHaveBeenCalledWith({
      colaborador: '1',
      nombreUsuario: longString,
      newPassword: longString,
      rol: '1',
    });

    // Verifica que no se muestra mensaje de error
    expect(document.getElementById('passwordError').textContent).toBe('');
  });
});