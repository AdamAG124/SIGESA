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
        if (idCuentaBancaria) document.getElementById("cuentaFiltro").value = idCuentaBancaria;

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
                            <td>${comprobante.numeroComprobantePago || 'Sin número'}</td>
                            <td>${fechaPago}</td>
                            <td>₡${comprobante.monto.toLocaleString('es-CR', { minimumFractionDigits: 2 })}</td>
                            <td class="action-icons">
                                <button class="tooltip" value="${comprobante.idComprobantePago}" onclick="verDetallesComprobante(this.value, '/comprobante-view/editar-comprobante.html', 2)">
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

function desplegarFormCrearComprobante() {
    const form = document.getElementById("crearComprobanteForm");
    form.reset()

    const selectCuentasBancarias = document.getElementById("cuenta");
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

    document.getElementById("crearComprobanteModal").style.display = "block";
}

function validarFormularioComprobante() {
    // Obtener los elementos del formulario
    const cuenta = document.getElementById("cuenta");
    const fechaPago = document.getElementById("fechaPago");
    const numero = document.getElementById("numero");
    const montoComprobante = document.getElementById("montoComprobante");
    const errorMessage = document.getElementById("errorMessage");

    // Bandera para rastrear si hay campos vacíos
    let hayErrores = false;

    // Limpiar estilos de error previos
    cuenta.style.border = "";
    fechaPago.style.border = "";
    numero.style.border = "";
    montoComprobante.style.border = "";
    errorMessage.textContent = "";

    // Validar el select de cuenta bancaria
    if (cuenta.value === "0") {
        cuenta.style.border = "2px solid red";
        hayErrores = true;
    }

    // Validar fecha de pago
    if (!fechaPago.value) {
        fechaPago.style.border = "2px solid red";
        hayErrores = true;
    }

    // Validar número de comprobante
    if (!numero.value.trim()) {
        numero.style.border = "2px solid red";
        hayErrores = true;
    }

    // Validar monto del comprobante
    if (!montoComprobante.value || montoComprobante.value <= 0) {
        montoComprobante.style.border = "2px solid red";
        hayErrores = true;
    }

    // Mostrar mensaje de error si hay campos vacíos
    if (hayErrores) {
        errorMessage.textContent = "Por favor, complete todos los campos.";
        return false;
    }



    if (hayErrores === false) {
        Swal.fire({
            title: "Creando Comprobante de Pago",
            text: "¿Realmente desea crear este Comprobante de Pago?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                const comprobantePagoData = {
                    cuentaBancaria: cuenta.value.trim(),
                    fechaPago: fechaPago.value.trim(),
                    numero: numero.value.trim(),
                    montoComprobante: montoComprobante.value.trim()
                };
                console.log(comprobantePagoData);
                errorMessage.textContent = '';
                window.api.crearComprobantePago(comprobantePagoData);
                window.api.onRespuestaCrearComprobantePago((respuesta) => {
                    if (respuesta.success) {
                        mostrarToastConfirmacion(respuesta.message);
                        setTimeout(() => {
                            adjuntarHTML('/comprobantes-pago/comprobantes-pago.html', cargarComprobantesPagoTabla);
                        }, 2000);
                    } else {
                        mostrarToastError(respuesta.message);
                    }
                }
                );
            }
        }).catch((error) => {
            mostrarToastError("A ocurrido un erro mientras se enviaba el formulario.");
            console.error("Error:", error);
        });
    }
}