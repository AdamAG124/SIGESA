function cargarComprobantesPagoTabla(pageSize, currentPage, searchValue, idEntidadFinanciera, fechaInicio, fechaFin, estado, idCuentaBancaria) {
    document.getElementById("pageFilter").value = pageSize;
    document.getElementById("page").value = currentPage;
    document.getElementById("fechaInicial").value = fechaInicio;
    document.getElementById("fechaFinal").value = fechaFin;
    document.getElementById("estadoFiltro").value = estado;
    document.getElementById("searchBar").value = searchValue;

    setTimeout(() => {
        // Establecer el valor del select de cuenta bancaria si se proporciona
        document.getElementById("cuentaFiltro").value = idCuentaBancaria;

        // Llamar al método del API para obtener los comprobantes de pago
        window.api.obtenerComprobantesPago(
            pageSize,
            pageNumber,
            searchValue,
            null, // idEntidadFinanciera (no se usa en los filtros del HTML, pero se incluye por compatibilidad)
            fechaInicio,
            fechaFin,
            Number(estadoComprobante) === 2 ? null : estadoComprobante, // Si es 2, pasamos null para obtener todos
            idCuentaBancaria,
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
                                <button class="tooltip" value="${comprobante.idComprobantePago}" onclick="verDetallesComprobante(this.value, '/comprobante-view/detalles-comprobante.html', 1)">
                                    <span class="material-icons">info</span>
                                    <span class="tooltiptext">Ver detalles</span>
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