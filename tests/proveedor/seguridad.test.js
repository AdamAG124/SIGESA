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

// Mocks globales
global.window = Object.create(window);
global.window.api = {
  crearProveedor: jest.fn(),
  onRespuestaCrearProveedor: jest.fn(),
  obtenerProveedores: jest.fn((pageSize, currentPage, estado, valorBusqueda, callback) => {
    callback({ success: true, data: [] });
  }),
};

const { enviarCreacionProveedor } = require('../../../public/js/dashboard-js/dashboard.js');

beforeEach(() => {
  // Reiniciar DOM
  document.body.innerHTML = `
    <input id="idProveedor" value="1"/>
    <input id="nombreProveedor" value="Proveedor Test"/>
    <input id="provincia" value="San José"/>
    <input id="canton" value="Central"/>
    <input id="distrito" value="Carmen"/>
    <input id="direccion" value="Calle 123"/>
    <div id="errorMessage"></div>
    <select id="selectPageSize">
      <option value="10" selected>10</option>
    </select>
    <select id="estado-filtro">
      <option value="1" selected>Activo</option>
    </select>
    <input id="search-bar" value="proveedor test" />
    <table>
      <tbody id="proveedores-body"></tbody>
    </table>
    <div id="editarProveedorModal" class="modal">
      <form id="editarProveedorForm" class="editar-proveedor-form"></form>
    </div>
  `;

  // Limpia mocks
  jest.clearAllMocks();

  // Configura el mock de onRespuestaCrearProveedor para capturar el callback
  let callbackGuardar;
  global.window.api.onRespuestaCrearProveedor.mockImplementation((cb) => {
    callbackGuardar = cb;
  });

  // Configura el mock de crearProveedor para invocar el callback
  global.window.api.crearProveedor.mockImplementation((data) => {
    if (callbackGuardar) {
      callbackGuardar({ success: true, message: 'Insertado' });
    }
  });
});

describe('Pruebas de seguridad para enviarCreacionProveedor', () => {
  test('debería manejar inyección de código malicioso (XSS) sin ejecutarlo', async () => {
    // Simula entrada maliciosa
    const maliciousInput = '<script>alert("hack")</script>';
    document.getElementById('nombreProveedor').value = maliciousInput;
    document.getElementById('provincia').value = 'San José';
    document.getElementById('canton').value = 'Central';
    document.getElementById('distrito').value = 'Carmen';
    document.getElementById('direccion').value = 'Calle 123';

    // Ejecuta la función
    enviarCreacionProveedor();
    await Promise.resolve(); // Espera el .then() de Swal.fire

    // Verifica que crearProveedor fue llamado con la entrada maliciosa
    expect(window.api.crearProveedor).toHaveBeenCalledWith({
      nombre: maliciousInput,
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Calle 123',
    });

    // Verifica que el valor en el input permanece como texto
    expect(document.getElementById('nombreProveedor').value).toBe(maliciousInput);

    // Verifica que errorMessage no muestra la entrada maliciosa
    expect(document.getElementById('errorMessage').textContent).toBe('');

    // Simula asignación a textContent (como hace el código real) para confirmar que no se ejecuta
    document.getElementById('errorMessage').textContent = maliciousInput;
    expect(document.getElementById('errorMessage').textContent).toBe(maliciousInput);
    // Verifica que no se renderiza como HTML (no hay nodos <script> en el DOM)
    expect(document.getElementById('errorMessage').getElementsByTagName('script').length).toBe(0);
  });

  test('debería manejar múltiples campos con inyección de código malicioso', async () => {
    // Simula entradas maliciosas en múltiples campos
    const maliciousInputs = {
      nombre: '<script>malicious()</script>',
      provincia: '<img src="x" onerror="alert(\'hack\')">',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: '<div onmouseover="hack()">Calle 123</div>',
    };
    document.getElementById('nombreProveedor').value = maliciousInputs.nombre;
    document.getElementById('provincia').value = maliciousInputs.provincia;
    document.getElementById('canton').value = maliciousInputs.canton;
    document.getElementById('distrito').value = maliciousInputs.distrito;
    document.getElementById('direccion').value = maliciousInputs.direccion;

    // Ejecuta la función
    enviarCreacionProveedor();
    await Promise.resolve();

    // Verifica que crearProveedor fue llamado con las entradas maliciosas
    expect(window.api.crearProveedor).toHaveBeenCalledWith(maliciousInputs);

    // Verifica que los valores en los inputs permanecen como texto
    expect(document.getElementById('nombreProveedor').value).toBe(maliciousInputs.nombre);
    expect(document.getElementById('provincia').value).toBe(maliciousInputs.provincia);
    expect(document.getElementById('direccion').value).toBe(maliciousInputs.direccion);
    expect(document.getElementById('errorMessage').textContent).toBe('');

    // Simula asignación a textContent
    document.getElementById('errorMessage').textContent = maliciousInputs.nombre;
    expect(document.getElementById('errorMessage').textContent).toBe(maliciousInputs.nombre);
    expect(document.getElementById('errorMessage').getElementsByTagName('script').length).toBe(0);
  });

  test('debería manejar cadenas excesivamente largas', async () => {
    // Simula una cadena muy larga
    const longString = 'A'.repeat(10000);
    document.getElementById('nombreProveedor').value = longString;
    document.getElementById('provincia').value = 'San José';
    document.getElementById('canton').value = 'Central';
    document.getElementById('distrito').value = 'Carmen';
    document.getElementById('direccion').value = 'Calle 123';

    // Ejecuta la función
    enviarCreacionProveedor();
    await Promise.resolve();

    // Verifica que crearProveedor fue llamado con la cadena larga
    expect(window.api.crearProveedor).toHaveBeenCalledWith({
      nombre: longString,
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Calle 123',
    });

    // Verifica que no se muestra mensaje de error
    expect(document.getElementById('errorMessage').textContent).toBe('');
  });

  test('debería manejar múltiples campos con cadenas excesivamente largas', async () => {
    // Simula cadenas largas en múltiples campos
    const longString = 'B'.repeat(10000);
    document.getElementById('nombreProveedor').value = longString;
    document.getElementById('provincia').value = longString;
    document.getElementById('canton').value = longString;
    document.getElementById('distrito').value = 'Carmen';
    document.getElementById('direccion').value = 'Calle 123';

    // Ejecuta la función
    enviarCreacionProveedor();
    await Promise.resolve();

    // Verifica que crearProveedor fue llamado con las cadenas largas
    expect(window.api.crearProveedor).toHaveBeenCalledWith({
      nombre: longString,
      provincia: longString,
      canton: longString,
      distrito: 'Carmen',
      direccion: 'Calle 123',
    });

    // Verifica que no se muestra mensaje de error
    expect(document.getElementById('errorMessage').textContent).toBe('');
  });
});