function cargarCuentasTabla(pageSize = 10, pageNumber = 1, searchValue = null, idEntidadFinanciera = null, tipoDivisa = null, estado = 1) {
    document.getElementById("estado-filtro").value = estado;
    document.getElementById("selectPageSize").value = pageSize;
    window.api.obtenerCuentasBancarias(pageSize, pageNumber, searchValue, idEntidadFinanciera, tipoDivisa, estado, (respuesta) => {
        if (respuesta.success) {
            console.log('Cuentas bancarias:', respuesta.data);
            console.log('Paginación:', respuesta.pagination);

            const tableBody = document.getElementById('cuentas-bancarias-body');
            tableBody.innerHTML = '';
            if (respuesta.data.length === 0) {
                const mensaje = document.createElement("tr");
                mensaje.innerHTML = `
                    <td colspan="6" style="text-align: center; color: gray; font-style: italic;">
                        No hay cuentas bancarias registradas
                    </td>
                `;
                tableBody.appendChild(mensaje);
            } else {
                respuesta.data.forEach(cuenta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cuenta.dscBanco}</td>
                        <td>${cuenta.numCuentaBancaria}</td>
                        <td>${cuenta.tipoDivisa}</td>
                        <td>${cuenta.dscNombreEntidadFinanciera}</td>
                        <td>${cuenta.estado ? 'Activo' : 'Inactivo'}</td>
                        <td class="action-icons">
                            <button class="tooltip" value="${cuenta.idCuentaBancaria}" onclick="desplegarModalEditarCuenta(this.value, this)">
                                <span class="material-icons">edit</span>
                                <span class="tooltiptext">Editar cuenta bancaria.</span>
                            </button>
                            <button class="tooltip" value="${cuenta.idCuentaBancaria}" onclick="${cuenta.estado === 1 ? `actualizarEstado(this.value, 0, 'Eliminando cuenta', '¿Está seguro que desea eliminar a esta cuenta?', 1)` : `actualizarEstado(this.value, 1, 'Reactivando cuenta', '¿Está seguro que desea reactivar esta cuenta?', 1)`}">
                                <span class="material-icons">
                                ${cuenta.estado ? 'delete' : 'restore'} <!-- Cambia el icono dependiendo del estado -->
                                </span>
                                <span class="tooltiptext">
                                ${cuenta.estado ? 'Eliminar cuenta' : 'Reactivar cuenta'} <!-- Cambia el tooltip dependiendo del estado -->
                                </span>
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            actualizarPaginacion(respuesta.pagination, ".pagination", 9);
        } else {
            console.error('Error:', respuesta.message);
            alert('Error al obtener las cuentas bancarias: ' + respuesta.message);
        }
    });
}