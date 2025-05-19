function cargarComprobantesPagoTabla(pageSize = 10, currentPage = 1, searchValue = null, idEntidadFinanciera = null, fechaInicio = null, fechaFin = null, estado = 1, idCuentaBancaria = null) {
    const searchBar = document.getElementById("searchBar");
    if (searchValue !== null && searchBar) searchBar.value = searchValue;

    const tipoFiltro = document.getElementById("estadoFiltro");
    if (estado !== null && tipoFiltro) tipoFiltro.value = estado;

    const fechaInicial = document.getElementById("fechaInicial");
    if (fechaInicio && fechaInicial) fechaInicial.value = fechaInicio;

    const fechaFinal = document.getElementById("fechaFinal");
    if (fechaFin && fechaFinal) fechaFinal.value = fechaFin;

    const pageFiltro = document.getElementById("selectPageSize");
    if (pageSize && pageFiltro) pageFiltro.value = pageSize;
    cargarCuentasBancariasEnSelect();
    setTimeout(() => {
        // Establecer el valor del select de cuenta bancaria si se proporciona
        if(idCuentaBancaria) document.getElementById("cuentaFiltro").value = idCuentaBancaria;

        // Llamar al método del API para obtener los comprobantes de pago
        window.api.obtenerComprobantesPago(
            pageSize,
            currentPage,
            searchValue,
            null, // idEntidadFinanciera (no se usa en los filtros del HTML, pero se incluye por compatibilidad)
            fechaInicio,
            fechaFin,
            Number(estado) === 2 ? null : estado, // Si es 2, pasamos null para obtener todos
            idCuentaBancaria === 0 ? null : idCuentaBancaria, // Si es 0, pasamos null para obtener todos
            (respuesta) => {
                const tbody = document.getElementById("comprobanteBody");
                tbody.innerHTML = ""; // Limpiar contenido previo

                // Verificar si hay comprobantes
                if (respuesta.comprobantes.length === 0) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td colspan="4" style="text-align: center; color: gray; font-style: italic;">
                            No hay comprobantes de pago registrados
                        </td>
                    `;
                    tbody.appendChild(row);
                } else {
                    // Iterar sobre los comprobantes y agregarlos a la tabla
                    respuesta.comprobantes.forEach((comprobante) => {
                        const fechaPago = comprobante.fechaPago ? new Date(comprobante.fechaPago).toLocaleDateString('es-ES') : 'Sin fecha';
                        const estadoTexto = comprobante.estadoComprobantePago === 1 ? "Activo" : "Inactivo";

                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td class="hidden-info" style="display:none;">${comprobante.idEntidadFinanciera}</td>
                            <td>${comprobante.numeroComprobantePago || 'Sin número'}</td>
                            <td>${fechaPago}</td>
                            <td>₡${comprobante.monto.toLocaleString('es-CR', { minimumFractionDigits: 2 })}</td>
                            <td class="action-icons">
                                <button class="tooltip" value="${comprobante.idComprobantePago}" onclick="desplegarModalEditarComprobantePago(this.value, this)">
                                    <span class="material-icons">edit</span>
                                    <span class="tooltiptext">Editar comprobante</span>
                                </button>
                                <button class="tooltip" value="${comprobante.idComprobantePago}" onclick="${comprobante.estadoComprobantePago === 1 ? `actualizarEstadoComprobante(this.value, 0, 'Eliminando comprobante', '¿Está seguro que desea eliminar este comprobante?', 1)` : `actualizarEstadoComprobante(this.value, 1, 'Reactivando comprobante', '¿Está seguro que desea reactivar este comprobante?', 1)`}">
                                    <span class="material-icons">
                                        ${comprobante.estadoComprobantePago === 1 ? 'delete' : 'restore'}
                                    </span>
                                    <span class="tooltiptext">
                                        ${comprobante.estadoComprobantePago === 1 ? 'Eliminar comprobante' : 'Reactivar comprobante'}
                                    </span>
                                </button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }

                // Actualizar los botones de paginación
                actualizarPaginacion(respuesta.paginacion, ".pagination", 12);
            }
        );
    }, 100);
}

function cargarCuentasBancariasEnSelect() {
    const selectCuentasBancarias = document.getElementById('cuentaFiltro');
    selectCuentasBancarias.innerHTML = ""; // Limpiar opciones previas
    const option = document.createElement('option');
    option.value = 0;
    option.textContent = 'Seleccionar cuenta bancaria';
    selectCuentasBancarias.appendChild(option);

    window.api.obtenerCuentasBancarias(null, null, null, null, null, 1, (respuesta) => {
        if (!respuesta.success) {
            console.error('Error al cargar las cuentas financieras.');
            return;
        }

        // No eliminamos las opciones existentes, solo agregamos las nuevas
        respuesta.data.forEach(cuenta => {
            const option = document.createElement('option');
            option.value = cuenta.idCuentaBancaria;
            option.textContent = cuenta.estado ? cuenta.dscBanco + ': ' + cuenta.numCuentaBancaria : `${cuenta.dscBanco + ': ' + cuenta.numCuentaBancaria} (Inactiva)`;
            selectCuentasBancarias.appendChild(option);
        });
    });
}

function desplegarModalEditarComprobantePago(idComprobantePago, boton) {
  const fila = boton.closest("tr");

  const idEntidadFinanciera = fila.querySelector("td:nth-child(1)").textContent;
  const numeroComprobantePago = fila.querySelector("td:nth-child(2)").textContent;
  const fechaPago = fila.querySelector("td:nth-child(3)").textContent;
  const montoComprobantePago = fila.querySelector("td:nth-child(4)").textContent;

  // Asignar valores extraídos a los campos del formulario de edición
  document.getElementById("idComprobantePago").value = idComprobantePago;
  document.getElementById("idEntidadFinanciera").value = idEntidadFinanciera;
  document.getElementById("fechaPago").value = fechaPago;
  document.getElementById("numeroComprobantePago").value = numeroComprobantePago;
  document.getElementById("montoComprobantePago").value = montoComprobantePago;

  // Cambiar el título del modal a "Detalles del Comprobante de Pago"
  document.getElementById("modalTitle").innerText = "Detalles del Comprobante de Pago";

  document.getElementById("buttonModal").onclick = enviarEdicionComprobante;

  // Mostrar el modal
  document.getElementById("editarProductoModal").style.display = "block";
}

function enviarEdicionComprobante() {
  const idComprobantePago = document.getElementById("idComprobantePago").value;
  const idEntidadFinanciera = document.getElementById("idEntidadFinanciera").value;
  const fechaPago = document.getElementById("fechaPago").value;
  const numeroComprobantePago = document.getElementById("numeroComprobantePago").value;
  const montoComprobantePago = document.getElementById("montoComprobantePago").value;

  // Array para almacenar los campos vacíos
  const camposVacios = [];

  const inputs = [
    { value: idEntidadFinanciera, element: document.getElementById("idEntidadFinanciera") },
    { value: fechaPago, element: document.getElementById("fechaPago") },
    { value: numeroComprobantePago, element: document.getElementById("numeroComprobantePago") },
    { value: montoComprobantePago, element: document.getElementById("montoComprobantePago") }
  ];

  inputs.forEach(input => {
    if (!input.value || (input.value == 0 && input.element.id === "categorias")) {
      // Si el valor es nulo o cero y el campo es 'categorias', marcar el borde en rojo
      input.element.style.border = "2px solid red";
      camposVacios.push(input.element);
    } else {
      input.element.style.border = ""; // Resetear el borde si no está vacío o es válido
    }
  });

  // Mostrar mensaje de error si hay campos vacíos
  const errorMessage = document.getElementById("errorMessage");
  if (camposVacios.length > 0) {
    errorMessage.textContent = "Por favor, llene todos los campos.";
    return; // Salir de la función si hay campos vacíos
  } else {
    errorMessage.textContent = ""; // Resetear mensaje de error si no hay campos vacíos
  }

  if (inputs.element.id === "montoComprobantePago" && parseFloat(inputs.value) < 0) {
    inputs.element.style.border = "2px solid red";
    camposVacios.push(input.element);
    errorMessage.textContent = "El monto no puede ser negativo.";
    return; // Salir de la función si el monto es negativo
  }

  // Crear el objeto categoría con los datos del formulario
  const comprobantePagoData = {
    idComprobantePago: idComprobantePago,
    idEntidadFinanciera: idEntidadFinanciera,
    fechaPago: fechaPago,
    numeroComprobantePago: numeroComprobantePago,
    montoComprobantePago: montoComprobantePago
  };

  Swal.fire({
    title: "Editando comprobante de pago",
    text: "¿Está seguro que desea actualizar este comprobante de pago?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a4af4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Usar el preload para enviar los datos al proceso principal
      window.api.actualizarComprobantePago(comprobantePagoData);

      // Manejar la respuesta del proceso principal
      window.api.onRespuestaActualizarComprobantePago((respuesta) => {
        if (respuesta.success) {
          mostrarToastConfirmacion(respuesta.message);
          setTimeout(() => { 
            filterTable(12);  
            cerrarModal("editarProductoModal", "editarProductoForm");
          }, 2000);
        } else {
          mostrarToastError(respuesta.message);
        }
      });
    }
  });
}