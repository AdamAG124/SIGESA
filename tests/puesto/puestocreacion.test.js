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
    <input id="nombrePuesto" value=""/>
    <textarea id="descripcionPuesto"></textarea>
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
    <div id="crearPuestoModal" class="modal">
      <form id="crearPuestoForm"></form>
    </div>
  `;

  // Limpia mocks
  jest.clearAllMocks();
});

describe('Pruebas para enviarCreacionPuesto', () => {
  test('debería mostrar mensaje de error si hay campos vacíos', () => {
    enviarCreacionPuesto();

    const errorMessage = document.getElementById('errorMessage');
    const camposVacios = ['Nombre del Puesto', 'Descripción'];

    expect(errorMessage.textContent).toBe(`Por favor complete los siguientes campos: ${camposVacios.join(", ")}`);
    expect(window.api.crearPuesto).not.toHaveBeenCalled();
    expect(confirmFireMock).not.toHaveBeenCalled();
  });


  test('debería marcar bordes rojos en campos vacíos', () => {
    const nombrePuesto = document.getElementById('nombrePuesto');
    const descripcionPuesto = document.getElementById('descripcionPuesto');

    enviarCreacionPuesto();

    expect(nombrePuesto.style.border).toBe('2px solid red');
    expect(descripcionPuesto.style.border).toBe('2px solid red');
  });

  test('debería no marcar bordes rojos si los campos están llenos', () => {
    const nombrePuesto = document.getElementById('nombrePuesto');
    const descripcionPuesto = document.getElementById('descripcionPuesto');

    nombrePuesto.value = 'Puesto Test';
    descripcionPuesto.value = 'Descripción del puesto';

    enviarCreacionPuesto();

    expect(nombrePuesto.style.border).toBe('');
    expect(descripcionPuesto.style.border).toBe('');
  });
});