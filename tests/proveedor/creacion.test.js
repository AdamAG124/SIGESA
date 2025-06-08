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
  onRespuestaCrearProveedor: jest.fn(), // Necesario aunque no lo probemos directamente
  obtenerProveedores: jest.fn((pageSize, currentPage, estado, valorBusqueda, callback) => {
    callback({ success: true, data: [] });
  }),
};

const { enviarCreacionProveedor } = require('../../public/js/dashboard-js/dashboard.js');

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
});

describe('Prueba unitaria para enviarCreacionProveedor', () => {
  test('debería validar campos y enviar datos correctamente', async () => {
    // Ejecuta la función
    enviarCreacionProveedor();

    // Espera a que se resuelva la confirmación de SweetAlert
    await Promise.resolve(); // Necesario para esperar el .then() de Swal.fire

    // Verifica que se mostró la confirmación de SweetAlert
    expect(confirmFireMock).toHaveBeenCalledWith({
      title: 'Creando Proveedor',
      text: '¿Está seguro que desea crear este nuevo proveedor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4a4af4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });

    // Verifica que crearProveedor fue llamado con los datos correctos
    expect(window.api.crearProveedor).toHaveBeenCalledWith({
      nombre: 'Proveedor Test',
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Calle 123',
    });
  });

  test('debería mostrar mensaje de error si hay campos vacíos', () => {
    // Simula un campo vacío
    document.getElementById('nombreProveedor').value = '';

    // Ejecuta la función
    enviarCreacionProveedor();

    // Verifica que se mostró el mensaje de error
    expect(document.getElementById('errorMessage').textContent).toBe('Por favor, llene todos los campos.');
    // Verifica que no se llamó a crearProveedor
    expect(window.api.crearProveedor).not.toHaveBeenCalled();
    // Verifica que no se mostró la confirmación de SweetAlert
    expect(confirmFireMock).not.toHaveBeenCalled();
  });

  test('debería marcar campos vacíos con borde rojo', () => {
    // Simula campos vacíos
    document.getElementById('nombreProveedor').value = '';
    document.getElementById('provincia').value = '';

    // Ejecuta la función
    enviarCreacionProveedor();

    // Verifica que los campos vacíos tienen borde rojo
    expect(document.getElementById('nombreProveedor').style.border).toBe('2px solid red');
    expect(document.getElementById('provincia').style.border).toBe('2px solid red');
    // Verifica que un campo lleno no tiene borde rojo
    expect(document.getElementById('canton').style.border).toBe('');
    // Verifica el mensaje de error
    expect(document.getElementById('errorMessage').textContent).toBe('Por favor, llene todos los campos.');
    // Verifica que no se llamó a crearProveedor
    expect(window.api.crearProveedor).not.toHaveBeenCalled();
  });
});