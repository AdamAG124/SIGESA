function cargarCuentasTabla(pageSize = 10, pageNumber = 1, searchValue = null, idEntidadFinanciera = null, tipoDivisa = null, estado = 1) {
    cargarEntidadesFinancierasEnSelect()
    setTimeout(() => {
        if (idEntidadFinanciera !== null) {
            document.getElementById("entidad-financiera-filtro").value = idEntidadFinanciera;
        }
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
                            <td class="hidden-info" style="display:none;">${cuenta.idEntidadFinanciera}</td>
                            <td>${cuenta.estado ? 'Activo' : 'Inactivo'}</td>
                            <td class="action-icons">
                                <button class="tooltip" value="${cuenta.idCuentaBancaria}" onclick="desplegarModalEditarCuenta(this.value, this)">
                                    <span class="material-icons">edit</span>
                                    <span class="tooltiptext">Editar cuenta bancaria.</span>
                                </button>
                                <button class="tooltip" value="${cuenta.idCuentaBancaria}" onclick="${cuenta.estado ? `actualizarEstadoCuentaBancaria(this.value, 0, 'Deshabilitando cuenta bancaria', '¿Realmente desea deshabilitar esta cuenta bancaria?')` : `actualizarEstadoCuentaBancaria(this.value, 1, 'Habilitando cuenta bancaria', '¿Realmente desea habilitar esta cuenta bancaria?')`}">
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
    }, 100);
}

function mostrarFormCrearCuentaBancaria() {
    initModuleSelector(2, true, true, false, false);
    document.getElementById("modalTitle").innerText = "Crear Cuenta Bancaria";
    document.getElementById("buttonModal").onclick = validarYCrearCuentaBancaria;
    document.getElementById("crearEditarCuentaBancariaModal").style.display = "block";
}

// renderer.js (o tu archivo JS del frontend)

function cargarEntidadesFinancierasEnSelect() {
    const selectEntidadFinanciera = document.getElementById('entidad-financiera-filtro');
    //cargarEntidadesFinancierasEnSelect();

    window.api.obtenerEntidadesFinancieras(null, null, null, null, (respuesta) => {
        if (respuesta.error) {
            console.error('Error al cargar las entidades financieras:', respuesta.error);
            alert(respuesta.error);
            return;
        }

        // No eliminamos las opciones existentes, solo agregamos las nuevas
        respuesta.entidadesFinancieras.forEach(entidad => {
            const option = document.createElement('option');
            option.value = entidad.idEntidadFinanciera;
            option.textContent = entidad.estado ? entidad.nombre : `${entidad.nombre} (Inactiva)`;
            selectEntidadFinanciera.appendChild(option);
        });
    });
}

function validarYCrearCuentaBancaria() {
    const selectedModule = document.getElementById('selected-module');
    const nombreBancoInput = document.getElementById('nombreBanco');
    const numeroCuentaInput = document.getElementById('numeroCuenta');
    const divisaSelect = document.getElementById('divisa');
    const errorMessage = document.getElementById('errorMessage');

    // Estilo para los bordes rojos
    const errorStyle = '2px solid red';
    const defaultStyle = '1px solid #ccc'; // Ajusta esto según el estilo por defecto de tus inputs

    // Limpiar estilos y mensajes de error previos
    nombreBancoInput.style.border = defaultStyle;
    numeroCuentaInput.style.border = defaultStyle;
    divisaSelect.style.border = defaultStyle;
    selectedModule.style.border = defaultStyle;
    errorMessage.textContent = '';

    // Bandera para indicar si todos los campos están llenos
    let isValid = true;

    // Validar entidad financiera (selected-module)
    if (selectedModule.textContent.trim() === 'Selección') {
        selectedModule.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, seleccione una entidad financiera.';
        isValid = false;
        return; // Salir si hay un error
    }

    // Validar nombre del banco
    if (!nombreBancoInput.value.trim()) {
        nombreBancoInput.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, rellene el nombre del banco.';
        isValid = false;
        return;
    }

    // Validar número de cuenta bancaria
    if (!numeroCuentaInput.value.trim()) {
        numeroCuentaInput.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, rellene el número de cuenta bancaria.';
        isValid = false;
        return;
    }

    // Validar tipo de divisa (asegurarse de que no esté vacío, aunque el select siempre tendrá un valor por defecto)
    if (!divisaSelect.value) {
        divisaSelect.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, seleccione un tipo de divisa.';
        isValid = false;
        return;
    }

    // Si todos los campos están llenos, crear el array cuentaBancariaData
    if (isValid) {
        Swal.fire({
            title: "Creando Cuenta Bancaria",
            text: "¿Realmente desea crear esta Cuenta Bancaria?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                const cuentaBancariaData = {
                    entidadFinanciera: moduleSelector.getSelectedId(),
                    nombreBanco: nombreBancoInput.value.trim(),
                    numeroCuenta: numeroCuentaInput.value.trim(),
                    tipoDivisa: divisaSelect.value
                };
                errorMessage.textContent = '';
                window.api.crearCuentaBancaria(cuentaBancariaData);
                window.api.onRespuestaCrearCuentaBancaria((respuesta) => {
                    if (respuesta.success) {
                        mostrarToastConfirmacion(respuesta.message);
                        setTimeout(() => {
                            adjuntarHTML('/configuration-panel/cuentas-bancarias-admin.html', () => cargarCuentasTabla());
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

function desplegarModalEditarCuenta(idCuenta, button) {
    document.getElementById("idCuentaBancaria").value = idCuenta;

    const row = button.closest('tr');
    const dscBanco = row.cells[0].textContent;
    const numCuentaBancaria = row.cells[1].textContent;
    const tipoDivisa = row.cells[2].textContent;
    const idEntidadFinanciera = row.cells[4].textContent;

    document.getElementById("modalTitle").innerText = "Editar Cuenta Bancaria";

    initModuleSelector(2, true, true, false, true, () => {
        moduleSelector.setSelectedById(Number(idEntidadFinanciera));
    });
    document.getElementById("nombreBanco").value = dscBanco;
    document.getElementById("numeroCuenta").value = numCuentaBancaria;
    document.getElementById("divisa").value = tipoDivisa;

    document.getElementById("buttonModal").onclick = validarYEditarCuentaBancaria;
    document.getElementById("crearEditarCuentaBancariaModal").style.display = "block";
}

function validarYEditarCuentaBancaria() {
    const selectedModule = document.getElementById('selected-module');
    const nombreBancoInput = document.getElementById('nombreBanco');
    const numeroCuentaInput = document.getElementById('numeroCuenta');
    const divisaSelect = document.getElementById('divisa');
    const errorMessage = document.getElementById('errorMessage');

    // Estilo para los bordes rojos
    const errorStyle = '2px solid red';
    const defaultStyle = '1px solid #ccc'; // Ajusta esto según el estilo por defecto de tus inputs

    // Limpiar estilos y mensajes de error previos
    nombreBancoInput.style.border = defaultStyle;
    numeroCuentaInput.style.border = defaultStyle;
    divisaSelect.style.border = defaultStyle;
    selectedModule.style.border = defaultStyle;
    errorMessage.textContent = '';

    // Bandera para indicar si todos los campos están llenos
    let isValid = true;

    // Validar entidad financiera (selected-module)
    if (selectedModule.textContent.trim() === 'Selección') {
        selectedModule.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, seleccione una entidad financiera.';
        isValid = false;
        return; // Salir si hay un error
    }

    // Validar nombre del banco
    if (!nombreBancoInput.value.trim()) {
        nombreBancoInput.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, rellene el nombre del banco.';
        isValid = false;
        return;
    }

    // Validar número de cuenta bancaria
    if (!numeroCuentaInput.value.trim()) {
        numeroCuentaInput.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, rellene el número de cuenta bancaria.';
        isValid = false;
        return;
    }

    // Validar tipo de divisa (asegurarse de que no esté vacío, aunque el select siempre tendrá un valor por defecto)
    if (!divisaSelect.value) {
        divisaSelect.style.border = errorStyle;
        errorMessage.textContent = 'Por favor, seleccione un tipo de divisa.';
        isValid = false;
        return;
    }

    // Si todos los campos están llenos, crear el array cuentaBancariaData
    if (isValid) {
        Swal.fire({
            title: "Editando Cuenta Bancaria",
            text: "¿Realmente desea editar esta Cuenta Bancaria?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                const cuentaBancariaData = {
                    idCuentaBancaria: document.getElementById("idCuentaBancaria").value,
                    entidadFinanciera: moduleSelector.getSelectedId(),
                    nombreBanco: nombreBancoInput.value.trim(),
                    numeroCuenta: numeroCuentaInput.value.trim(),
                    tipoDivisa: divisaSelect.value
                };
                errorMessage.textContent = '';
                window.api.editarCuentaBancaria(cuentaBancariaData);
                window.api.onRespuestaEditarCuentaBancaria((respuesta) => {
                    if (respuesta.success) {
                        mostrarToastConfirmacion(respuesta.message);
                        setTimeout(() => {
                            adjuntarHTML('/configuration-panel/cuentas-bancarias-admin.html', () => cargarCuentasTabla());
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

function actualizarEstadoCuentaBancaria(idCuentaBancaria, estado, title, message) {
    Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4a4af4",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            window.api.eliminarCuentaBancaria(idCuentaBancaria, estado);
            window.api.onRespuestaEliminarCuentaBancaria((respuesta) => {
                if (respuesta.success) {
                    mostrarToastConfirmacion(respuesta.message);
                    setTimeout(() => {
                        adjuntarHTML('/configuration-panel/cuentas-bancarias-admin.html', () => cargarCuentasTabla());
                    }, 2000);
                } else {
                    mostrarToastError(respuesta.message);
                }
            });
        }
    }).catch((error) => {
        mostrarToastError("A ocurrido un erro mientras se enviaba el formulario.");
        console.error("Error:", error);
    });
}