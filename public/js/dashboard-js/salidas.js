function verDetallesSalida(idSalida, ruta, option) {
    adjuntarHTML(ruta, false);
    if (option === 1) {
        cargarSalida(idSalida);
    } else if (option === 2) {
        cargarEdicionSalida(idSalida);
    }
}

function cargarEdicionSalida(idSalida) {
    llenarSelectsColaboradores();
    setTimeout(function () {

        window.api.obtenerProductosPorSalida(idSalida)
            .then((productosPorSalida) => {
                console.log('Datos obtenidos:', productosPorSalida);

                if (!productosPorSalida || productosPorSalida.length === 0) {
                    console.error('No se recibieron productos para la salida');
                    alert('No se encontraron datos para la salida con ID: ' + idSalida);
                    return;
                }

                const datosGenerales = productosPorSalida[0];

                // Título
                document.getElementById('output-title').textContent = `Editar Salida #${datosGenerales.idSalida}`;

                // Campos ocultos
                document.getElementById('id-salida-producto').value = datosGenerales.idSalidaProducto;
                document.getElementById('id-salida').value = datosGenerales.idSalida;
                document.getElementById('id-usuario').value = datosGenerales.idUsuario;

                // Información general
                document.getElementById('fecha-salida').value = new Date(datosGenerales.fechaSalida).toISOString().slice(0, 16);
                const estadoBadge = document.querySelector('.status-badge');
                estadoBadge.textContent = datosGenerales.estadoSalida ? 'Activo' : 'Inactivo';
                estadoBadge.className = `status-badge ${datosGenerales.estadoSalida ? 'status-active' : 'status-inactive'}`;
                document.getElementById('nombreUsuarioRegistro').textContent = datosGenerales.nombreUsuario;

                // Preseleccionar y actualizar datos del colaborador sacando
                const selectSacando = document.getElementById('colaborador-entregando');
                selectSacando.value = datosGenerales.idColaboradorSacando;
                const selectedSacando = selectSacando.options[selectSacando.selectedIndex];
                if (selectedSacando && selectedSacando.value !== "0") {
                    document.getElementById('correo-sacando').value = selectedSacando.dataset.correo;
                    document.getElementById('telefono-sacando').value = selectedSacando.dataset.telefono;
                    document.getElementById('departamento-sacando').value = selectedSacando.dataset.departamento;
                    document.getElementById('puesto-sacando').value = selectedSacando.dataset.puesto;
                }

                // Preseleccionar y actualizar datos del colaborador recibiendo
                const selectRecibiendo = document.getElementById('colaborador-recibiendo');
                selectRecibiendo.value = datosGenerales.idColaboradorRecibiendo;
                const selectedRecibiendo = selectRecibiendo.options[selectRecibiendo.selectedIndex];
                if (selectedRecibiendo && selectedRecibiendo.value !== "0") {
                    document.getElementById('correo-recibiendo').value = selectedRecibiendo.dataset.correo;
                    document.getElementById('telefono-recibiendo').value = selectedRecibiendo.dataset.telefono;
                    document.getElementById('departamento-recibiendo').value = selectedRecibiendo.dataset.departamento;
                    document.getElementById('puesto-recibiendo').value = selectedRecibiendo.dataset.puesto;
                }

                // Productos
                const productsBody = document.getElementById('products-body');
                productsBody.innerHTML = '';
                productosPorSalida.forEach((producto, index) => {
                    const row = document.createElement('tr');
                    row.className = 'product-row';
                    row.innerHTML = `
                        <td>
                            <select class="form-select product-select" id="product-select-${index}" disabled>
                                <option value="0">Seleccione un producto</option>
                            </select>
                        </td>
                        <td><input type="text" class="form-control product-unit" value="${producto.unidadMedicion}" readonly></td>
                        <td><input type="number" class="form-control product-prev-qty" value="${producto.cantidadAnterior}" onchange="updateNewQuantity(this.closest('tr'))" disabled></td>
                        <td><input type="number" class="form-control product-out-qty" value="${producto.cantidadSaliendo}" min="1" onchange="updateNewQuantity(this.closest('tr'))"></td>
                        <td><input type="number" class="form-control product-new-qty" value="${producto.cantidadNueva}" readonly></td>
                        <td class="no-print"><i class="material-icons delete-product" onclick="marcarProductosFacturaEliminar(this, ${producto.idSalidaProducto}, 'output-form')">delete</i></td>
                    `;
                    llenarProductosSelect(`product-select-${index}`, null);
                    setTimeout(() => {
                        document.getElementById(`product-select-${index}`).value = producto.idProducto;
                    }, 100);
                    productsBody.appendChild(row);
                });

                // Detalles adicionales
                document.getElementById('notas').value = datosGenerales.detalleSalida || '';
            })
            .catch((error) => {
                console.error('Error al cargar productos de la salida:', error.message);
                alert('Error al cargar los datos: ' + error.message);
            });
    }, 100);
}

// Funciones auxiliares
function updateProductDetails(select) {
    const row = select.closest('tr');
    updateNewQuantity(row);
}

function updateNewQuantity(row) {
    const prevQty = parseFloat(row.querySelector('.product-prev-qty').value) || 0;
    const outQty = parseFloat(row.querySelector('.product-out-qty').value) || 0;
    row.querySelector('.product-new-qty').value = prevQty - outQty;
}

function deleteProduct(icon) {
    icon.closest('tr').remove();
}

function addProductSalida() {
    const productsBody = document.getElementById('products-body');
    const idSelect = `product-select-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
    const row = document.createElement('tr');
    row.className = 'product-row';
    row.innerHTML = `
        <td>
            <select class="form-select product-select" id=${idSelect} onchange="actualizarCantidadPrevia(this)">
                <option value="0">Seleccione un producto</option>
            </select>
        </td>
        <td><input type="text" class="form-control product-unit" readonly></td>
        <td><input type="number" class="form-control product-prev-qty" value="0" onchange="updateNewQuantity(this.closest('tr'))" disabled></td>
        <td><input type="number" class="form-control product-out-qty" value="0" min="1" onchange="updateNewQuantity(this.closest('tr'))"></td>
        <td><input type="number" class="form-control product-new-qty" value="0" readonly></td>
        <td class="no-print"><i class="material-icons delete-product" onclick="deleteProduct(this)">delete</i></td>
    `;
    llenarProductosSelect(idSelect, 1);
    productsBody.appendChild(row);
}

function printOutput() {
    window.print();
}

function saveOutput() {
    alert('Función de guardar no implementada aún');
}

function goBack() {
    window.history.back();
}

function llenarSelectsColaboradores() {
    window.api.obtenerColaboradores(null, null, null, null, null, null, (colaboradores) => {

        // Llenar el <select> del colaborador que entrega
        const selectSacando = document.getElementById('colaborador-entregando');
        selectSacando.innerHTML = '<option value="0">Seleccione un colaborador</option>' +
            colaboradores.colaboradores.map(col => `
                    <option value="${col.idColaborador}" 
                            data-correo="${col.correo}" 
                            data-telefono="${col.numTelefono}" 
                            data-departamento="${col.nombreDepartamento}" 
                            data-puesto="${col.nombrePuesto}">
                        ${col.nombreColaborador} ${col.primerApellidoColaborador} ${col.segundoApellidoColaborador || ''} ${col.estado? '' : ' (Inactivo)'}
                    </option>
                `).join('');

        // Llenar el <select> del colaborador que recibe
        const selectRecibiendo = document.getElementById('colaborador-recibiendo');
        console.log('select de colaboradores: ', selectRecibiendo);
        selectRecibiendo.innerHTML = '<option value="0">Seleccione un colaborador</option>' +
            colaboradores.colaboradores.map(col => `
                    <option value="${col.idColaborador}" 
                            data-correo="${col.correo}" 
                            data-telefono="${col.numTelefono}" 
                            data-departamento="${col.nombreDepartamento}" 
                            data-puesto="${col.nombrePuesto}">
                        ${col.nombreColaborador} ${col.primerApellidoColaborador} ${col.segundoApellidoColaborador || ''}
                    </option>
                `).join('');
    });
}

function actualizarDatosColaborador(select) {
    const selectedOption = select.options[select.selectedIndex]; // La opción seleccionada

    // Determinar si es el colaborador que entrega o recibe según el ID del select
    const esColaboradorSacando = select.id === 'colaborador-entregando';
    const prefijo = esColaboradorSacando ? 'sacando' : 'recibiendo';

    // Obtener los inputs correspondientes
    const correoInput = document.getElementById(`correo-${prefijo}`);
    const telefonoInput = document.getElementById(`telefono-${prefijo}`);
    const departamentoInput = document.getElementById(`departamento-${prefijo}`);
    const puestoInput = document.getElementById(`puesto-${prefijo}`);

    // Si se selecciona "Seleccione un colaborador" (value="0"), limpiar los inputs
    if (selectedOption.value === "0") {
        correoInput.value = '';
        telefonoInput.value = '';
        departamentoInput.value = '';
        puestoInput.value = '';
    } else {
        // Llenar los inputs con los datos de los atributos data-*
        correoInput.value = selectedOption.dataset.correo || '';
        telefonoInput.value = selectedOption.dataset.telefono || '';
        departamentoInput.value = selectedOption.dataset.departamento || '';
        puestoInput.value = selectedOption.dataset.puesto || '';
    }
}