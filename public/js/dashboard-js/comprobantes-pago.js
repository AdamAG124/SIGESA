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