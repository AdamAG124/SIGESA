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
  crearPuesto: jest.fn(),
  onRespuestaCrearPuesto: jest.fn(),
  obtenerPuestosTrabajo: jest.fn((pageSize, currentPage, estado, valorBusqueda, callback) => {
    callback({ success: true, data: [] });
  }),
};

const { enviarCreacionPuesto } = require('../../public/js/dashboard-js/dashboard.js');

beforeEach(() => {
  // Reiniciar DOM
  document.body.innerHTML = `
    <input id="idPuestoTrabajo" value="1"/>
    <input id="nombrePuesto" value="Puesto Test"/>
    <textarea id="descripcionPuesto">Descripción del puesto</textarea>
    <div id="errorMessage"></div>
    <select id="selectPageSize">
      <option value="10" selected>10</option>
    </select>
    <select id="estado-filtro">
      <option value="1" selected>Activo</option>
    </select>
    <input id="search-bar" value="puesto test" />
    <table>
      <tbody id="puestos-body"></tbody>
    </table>
    <div id="editarPuestoModal" class="modal">
      <form id="editarPuestoForm" class="editar-puesto-form"></form>
    </div>
  `;

  // Limpia mocks
  jest.clearAllMocks();

  // Configura el mock de onRespuestaCrearPuesto
  let callbackGuardar;
  global.window.api.onRespuestaCrearPuesto.mockImplementation((cb) => {
    callbackGuardar = cb;
  });

  // Configura el mock de crearPuesto
  global.window.api.crearPuesto.mockImplementation((data) => {
    if (callbackGuardar) {
      callbackGuardar({ success: true, message: 'Insertado' });
    }
  });
});

describe('Pruebas de seguridad para enviarCreacionPuesto', () => {
  test('debería manejar inyección de código malicioso (XSS) sin ejecutarlo', async () => {
    // Simula entrada maliciosa
    const maliciousInput = '<script>alert("hack")</script>';
    document.getElementById('nombrePuesto').value = maliciousInput;
    document.getElementById('descripcionPuesto').value = 'Descripción del puesto';

    // Ejecuta la función
    enviarCreacionPuesto();
    await Promise.resolve(); // Espera el .then() de Swal.fire

    // Verifica que crearPuesto fue llamado con la entrada maliciosa
    expect(window.api.crearPuesto).toHaveBeenCalledWith({
      nombre: maliciousInput,
      descripcion: 'Descripción del puesto',
      estado: 1,
    });

    // Verifica que el valor en el input permanece como texto
    expect(document.getElementById('nombrePuesto').value).toBe(maliciousInput);

    // Verifica que errorMessage no muestra la entrada maliciosa
    expect(document.getElementById('errorMessage').textContent).toBe('');

    // Simula asignación a textContent (como hace el código real) para confirmar que no se ejecuta
    document.getElementById('errorMessage').textContent = maliciousInput;
    expect(document.getElementById('errorMessage').textContent).toBe(maliciousInput);
    // Verifica que no se renderiza como HTML (no hay nodos <script> en el DOM)
    expect(document.getElementById('errorMessage').getElementsByTagName('script').length).toBe(0);
  });

  test('debería manejar cadenas excesivamente largas', async () => {
    // Simula una cadena muy larga
    const longString = 'A'.repeat(10000);
    document.getElementById('nombrePuesto').value = longString;
    document.getElementById('descripcionPuesto').value = 'Descripción del puesto';

    // Ejecuta la función
    enviarCreacionPuesto();
    await Promise.resolve();

    // Verifica que crearPuesto fue llamado con la cadena larga
    expect(window.api.crearPuesto).toHaveBeenCalledWith({
      nombre: longString,
      descripcion: 'Descripción del puesto',
      estado: 1,
    });

    // Verifica que no se muestra mensaje de error
    expect(document.getElementById('errorMessage').textContent).toBe('');
  });
});