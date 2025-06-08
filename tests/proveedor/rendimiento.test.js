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

// Función para calcular el percentil
function calculatePercentile(arr, percentile) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

describe('Pruebas de rendimiento para enviarCreacionProveedor', () => {
  test('debería manejar 150 solicitudes con reportes de tiempo y tasa de error < 1%', async () => {
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
    const times = []; // Almacena tiempos de cada solicitud
    let errorCount = 0; // Contador de errores

    // Inicia medición de tiempo total
    const startTime = performance.now();

    // Ejecuta 150 solicitudes
    for (let i = 0; i < numRequests; i++) {
      // Actualiza los valores de los inputs
      document.getElementById('nombreProveedor').value = `Proveedor Test ${i}`;
      document.getElementById('provincia').value = proveedorData.provincia;
      document.getElementById('canton').value = proveedorData.canton;
      document.getElementById('distrito').value = proveedorData.distrito;
      document.getElementById('direccion').value = proveedorData.direccion;

      // Mide el tiempo de la solicitud individual
      const requestStart = performance.now();
      try {
        enviarCreacionProveedor();
        await Promise.resolve(); // Espera el .then() de Swal.fire
        if (!window.api.crearProveedor.mock.calls[i]) {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Error en solicitud ${i}:`, error);
      }
      const requestEnd = performance.now();
      times.push(requestEnd - requestStart);
    }

    // Finaliza medición de tiempo total
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Árbol de resultados: Tiempos de respuesta por transacción
    console.log('Árbol de resultados: Tiempos de respuesta por transacción (ms)');
    times.forEach((time, index) => {
      console.log(`Solicitud ${index + 1}: ${time.toFixed(2)} ms`);
    });

    // Tabla agregada: Promedios y percentiles
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const percentile95 = calculatePercentile(times, 95);
    console.log('\nTabla agregada:');
    console.log(`- Promedio: ${averageTime.toFixed(2)} ms`);
    console.log(`- Percentil 95: ${percentile95.toFixed(2)} ms`);
    console.log(`- Tiempo total: ${totalTime.toFixed(2)} ms`);

    // Aserciones
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

    // Verifica que el percentil 95 es menor a 2 segundos (2000 ms)
    expect(percentile95).toBeLessThan(2000);

    // Verifica que la tasa de error es menor al 1%
    const errorRate = (errorCount / numRequests) * 100;
    console.log(`- Tasa de error: ${errorRate.toFixed(2)}% (${errorCount} errores)`);
    expect(errorRate).toBeLessThan(1);
  });

  test('debería manejar 150 solicitudes con cadenas largas y reportes', async () => {
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
    const times = [];
    let errorCount = 0;

    // Inicia medición de tiempo total
    const startTime = performance.now();

    // Ejecuta 150 solicitudes
    for (let i = 0; i < numRequests; i++) {
      // Actualiza los valores de los inputs
      document.getElementById('nombreProveedor').value = `${longString}_${i}`;
      document.getElementById('provincia').value = proveedorData.provincia;
      document.getElementById('canton').value = proveedorData.canton;
      document.getElementById('distrito').value = proveedorData.distrito;
      document.getElementById('direccion').value = proveedorData.direccion;

      // Mide el tiempo de la solicitud individual
      const requestStart = performance.now();
      try {
        enviarCreacionProveedor();
        await Promise.resolve();
        if (!window.api.crearProveedor.mock.calls[i]) {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Error en solicitud ${i}:`, error);
      }
      const requestEnd = performance.now();
      times.push(requestEnd - requestStart);
    }

    // Finaliza medición de tiempo total
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Árbol de resultados: Tiempos de respuesta por transacción
    console.log('Árbol de resultados: Tiempos de respuesta por transacción (ms) - Cadenas largas');
    times.forEach((time, index) => {
      console.log(`Solicitud ${index + 1}: ${time.toFixed(2)} ms`);
    });

    // Tabla agregada: Promedios y percentiles
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const percentile95 = calculatePercentile(times, 95);
    console.log('\nTabla agregada (cadenas largas):');
    console.log(`- Promedio: ${averageTime.toFixed(2)} ms`);
    console.log(`- Percentil 95: ${percentile95.toFixed(2)} ms`);
    console.log(`- Tiempo total: ${totalTime.toFixed(2)} ms`);

    // Aserciones
    expect(window.api.crearProveedor).toHaveBeenCalledTimes(numRequests);
    expect(window.api.crearProveedor).toHaveBeenLastCalledWith({
      nombre: `${longString}_${numRequests - 1}`,
      provincia: proveedorData.provincia,
      canton: proveedorData.canton,
      distrito: proveedorData.distrito,
      direccion: proveedorData.direccion,
    });
    expect(document.getElementById('errorMessage').textContent).toBe('');
    expect(percentile95).toBeLessThan(2000);

    const errorRate = (errorCount / numRequests) * 100;
    console.log(`- Tasa de error: ${errorRate.toFixed(2)}% (${errorCount} errores)`);
    expect(errorRate).toBeLessThan(1);
  });
});