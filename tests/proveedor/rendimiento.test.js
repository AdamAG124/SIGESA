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

// Mock para funciones de efectos secundarios
global.mostrarToastConfirmacion = jest.fn();
global.mostrarToastError = jest.fn();
global.filterTable = jest.fn();
global.cerrarModal = jest.fn();

const { enviarCreacionProveedor } = require('C:/SIGESA/public/js/dashboard-js/dashboard.js');

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

  // Configura el mock de onRespuestaCrearProveedor
  let callbackGuardar;
  global.window.api.onRespuestaCrearProveedor.mockImplementation((cb) => {
    callbackGuardar = cb;
  });

  // Configura el mock de crearProveedor
  global.window.api.crearProveedor.mockImplementation((data) => {
    if (callbackGuardar) {
      callbackGuardar({ success: true, message: 'Insertado' });
    }
  });
});

describe('Pruebas de rendimiento para enviarCreacionProveedor', () => {
  test('debería manejar 150 solicitudes sin errores y en tiempo razonable', async () => {
    // Configura datos iniciales
    const proveedorData = {
      nombre: 'Proveedor Test',
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Calle 123',
    };

    // Número de solicitudes
    const numRequests = 150;

    // Inicia medición de tiempo
    const startTime = performance.now();

    // Ejecuta 150 solicitudes
    for (let i = 0; i < numRequests; i++) {
      // Actualiza los valores de los inputs con un identificador único para simular variación
      document.getElementById('nombreProveedor').value = `Proveedor Test ${i}`;
      document.getElementById('provincia').value = proveedorData.provincia;
      document.getElementById('canton').value = proveedorData.canton;
      document.getElementById('distrito').value = proveedorData.distrito;
      document.getElementById('direccion').value = proveedorData.direccion;

      // Ejecuta la función
      enviarCreacionProveedor();
      // Espera la resolución del .then() de Swal.fire
      await Promise.resolve();
    }

    // Finaliza medición de tiempo
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Verifica que crearProveedor fue llamado 150 veces
    expect(window.api.crearProveedor).toHaveBeenCalledTimes(numRequests);

    // Verifica que los datos enviados en la última solicitud son correctos
    expect(window.api.crearProveedor).toHaveBeenLastCalledWith({
      nombre: `Proveedor Test ${numRequests - 1}`,
      provincia: proveedorData.provincia,
      canton: proveedorData.canton,
      distrito: proveedorData.distrito,
      direccion: proveedorData.direccion,
    });

    // Verifica que no se mostraron mensajes de error
    expect(document.getElementById('errorMessage').textContent).toBe('');

    // Verifica que el tiempo total es razonable (por ejemplo, menos de 5 segundos)
    const maxAllowedTime = 5000; // 5 segundos
    expect(totalTime).toBeLessThan(maxAllowedTime);
    console.log(`Tiempo total para ${numRequests} solicitudes: ${totalTime.toFixed(2)} ms`);
  });

  test('debería manejar 150 solicitudes con cadenas largas sin errores', async () => {
    // Configura una cadena larga
    const longString = 'A'.repeat(10000);
    const proveedorData = {
      nombre: longString,
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen',
      direccion: 'Calle 123',
    };

    // Número de solicitudes
    const numRequests = 150;

    // Inicia medición de tiempo
    const startTime = performance.now();

    // Ejecuta 150 solicitudes
    for (let i = 0; i < numRequests; i++) {
      // Actualiza los valores de los inputs
      document.getElementById('nombreProveedor').value = `${longString}_${i}`;
      document.getElementById('provincia').value = proveedorData.provincia;
      document.getElementById('canton').value = proveedorData.canton;
      document.getElementById('distrito').value = proveedorData.distrito;
      document.getElementById('direccion').value = proveedorData.direccion;

      // Ejecuta la función
      enviarCreacionProveedor();
      // Espera la resolución del .then() de Swal.fire
      await Promise.resolve();
    }

    // Finaliza medición de tiempo
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Verifica que crearProveedor fue llamado 150 veces
    expect(window.api.crearProveedor).toHaveBeenCalledTimes(numRequests);

    // Verifica que los datos enviados en la última solicitud son correctos
    expect(window.api.crearProveedor).toHaveBeenLastCalledWith({
      nombre: `${longString}_${numRequests - 1}`,
      provincia: proveedorData.provincia,
      canton: proveedorData.canton,
      distrito: proveedorData.distrito,
      direccion: proveedorData.direccion,
    });

    // Verifica que no se mostraron mensajes de error
    expect(document.getElementById('errorMessage').textContent).toBe('');

    // Verifica que el tiempo total es razonable (por ejemplo, menos de 10 segundos para cadenas largas)
    const maxAllowedTime = 10000; // 10 segundos
    expect(totalTime).toBeLessThan(maxAllowedTime);
    console.log(`Tiempo total para ${numRequests} solicitudes con cadenas largas: ${totalTime.toFixed(2)} ms`);
  });
});