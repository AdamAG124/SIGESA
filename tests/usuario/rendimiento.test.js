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

  // Configura el mock de onRespuestaCrearUsuario
  let callbackGuardar;
  global.window.api.onRespuestaCrearUsuario.mockImplementation((cb) => {
    callbackGuardar = cb;
  });

  // Configura el mock de crearUsuario
  global.window.api.crearUsuario.mockImplementation((data) => {
    if (callbackGuardar) {
      callbackGuardar({ success: true, message: 'Usuario creado' });
    }
  });
});

// Función para calcular el percentil
function calculatePercentile(arr, percentile) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

describe('Pruebas de rendimiento para enviarCreacionUsuario', () => {
  test('debería manejar 150 solicitudes con reportes de tiempo y tasa de error < 1%', async () => {
    // Configura datos iniciales
    const usuarioData = {
      colaborador: '1',
      nombreUsuario: 'juanperez',
      newPassword: 'Password123',
      confirmPassword: 'Password123',
      rol: '1',
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
      document.getElementById('colaboradorName').value = usuarioData.colaborador;
      document.getElementById('nombreUsuario').value = `juanperez${i}`;
      document.getElementById('newPassword').value = usuarioData.newPassword;
      document.getElementById('confirmPassword').value = usuarioData.confirmPassword;
      document.getElementById('roleName').value = usuarioData.rol;

      // Mide el tiempo de la solicitud individual
      const requestStart = performance.now();
      try {
        const event = { preventDefault: jest.fn() };
        enviarCreacionUsuario(event);
        await Promise.resolve(); // Espera el .then() de Swal.fire
        if (!window.api.crearUsuario.mock.calls[i]) {
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
    // Verifica que crearUsuario fue llamado 150 veces
    expect(window.api.crearUsuario).toHaveBeenCalledTimes(numRequests);

    // Verifica que los datos enviados en la última solicitud son correctos
    expect(window.api.crearUsuario).toHaveBeenLastCalledWith({
      colaborador: usuarioData.colaborador,
      nombreUsuario: `juanperez${numRequests - 1}`,
      newPassword: usuarioData.newPassword,
      rol: usuarioData.rol,
    });

    // Verifica que no se mostraron mensajes de error
    expect(document.getElementById('passwordError').textContent).toBe('');

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
    const usuarioData = {
      colaborador: '1',
      nombreUsuario: longString,
      newPassword: 'Password123',
      confirmPassword: 'Password123',
      rol: '1',
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
      document.getElementById('colaboradorName').value = usuarioData.colaborador;
      document.getElementById('nombreUsuario').value = `${longString}_${i}`;
      document.getElementById('newPassword').value = usuarioData.newPassword;
      document.getElementById('confirmPassword').value = usuarioData.confirmPassword;
      document.getElementById('roleName').value = usuarioData.rol;

      // Mide el tiempo de la solicitud individual
      const requestStart = performance.now();
      try {
        const event = { preventDefault: jest.fn() };
        enviarCreacionUsuario(event);
        await Promise.resolve(); // Espera el .then() de Swal.fire
        if (!window.api.crearUsuario.mock.calls[i]) {
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
    expect(window.api.crearUsuario).toHaveBeenCalledTimes(numRequests);
    expect(window.api.crearUsuario).toHaveBeenLastCalledWith({
      colaborador: usuarioData.colaborador,
      nombreUsuario: `${longString}_${numRequests - 1}`,
      newPassword: usuarioData.newPassword,
      rol: usuarioData.rol,
    });
    expect(document.getElementById('passwordError').textContent).toBe('');
    expect(percentile95).toBeLessThan(2000);

    const errorRate = (errorCount / numRequests) * 100;
    console.log(`- Tasa de error: ${errorRate.toFixed(2)}% (${errorCount} errores)`);
    expect(errorRate).toBeLessThan(1);
  });
});