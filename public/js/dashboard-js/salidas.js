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
                document.getElementById("idUsuario").value = datosGenerales.idUsuario;

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
          <select class="form-select product-select product-name" id="${idSelect}" onchange="selectProductosOptionValidationSalida(this)">      <option value="0">Seleccione un producto</option>
                <option value="crear">+ Agregar Nuevo</option>
       
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


function validarYRecolectarDatosSalidaProducto() {
    // Limpiar mensajes de error previos y estilos
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => input.style.border = '');

    // Seleccionar todos los inputs y selects no deshabilitados dentro del formulario
    const form = document.getElementById('output-form');
    const inputs = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    let isValid = true;

    // Arrays para cada tipo de SalidaProducto y datos de salida
    const nuevosSalidaProducto = [];
    const actualizarSalidaProducto = [];
    const eliminarSalidaProducto = [];
    let salidaData = null;

    // Validar campos generales obligatorios
    inputs.forEach(input => {
        const value = input.value.trim();
        const isSelect = input.tagName === 'SELECT';
        const isNumber = input.type === 'number';
        const isEmpty = value === '' || (isSelect && value === '0');

        // Validar campos obligatorios
        if (isEmpty && input.id !== 'notas' && input.id !== 'id-salida' && input.id !== 'id-salida-producto') {
            if (input.id === 'fecha-salida' || input.id === 'colaborador-entregando' || input.id === 'colaborador-recibiendo') {
                isValid = false;
                input.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Este campo es obligatorio';
                input.parentElement.appendChild(errorMessage);
            }
        }
    });

    // Validar y recolectar datos de productos dinámicos
    const productRows = document.querySelectorAll('#products-body .product-row');
    productRows.forEach(row => {
        const selectProducto = row.querySelector('.product-select');
        const inputCantidadAnterior = row.querySelector('.product-prev-qty');
        const inputCantidadSaliendo = row.querySelector('.product-out-qty');
        const inputCantidadNueva = row.querySelector('.product-new-qty');

        const idProducto = selectProducto.value;
        const cantidadAnterior = Number(inputCantidadAnterior.value);
        const cantidadSaliendo = inputCantidadSaliendo.value.trim();
        const cantidadSaliendoNum = Number(cantidadSaliendo);

        // Validar campos no deshabilitados
        if (!selectProducto.disabled) {
            if (idProducto === '0') {
                isValid = false;
                selectProducto.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Seleccione un producto';
                selectProducto.parentElement.appendChild(errorMessage);
            }
        }

        if (!inputCantidadSaliendo.disabled) {
            if (cantidadSaliendo === '') {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Ingrese la cantidad saliente';
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            } else if (cantidadSaliendoNum <= 0) {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'La cantidad saliente debe ser mayor a 0';
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            } else if (cantidadSaliendoNum > cantidadAnterior) {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = `No puede salir más de lo disponible (${cantidadAnterior})`;
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            }
        }

        // Recolectar datos si es válido
        if (
            idProducto !== '0' &&
            cantidadSaliendo !== '' &&
            cantidadSaliendoNum > 0 &&
            cantidadSaliendoNum <= cantidadAnterior
        ) {
            const productoData = {
                idProducto: Number(idProducto),
                cantidadAnterior: cantidadAnterior,
                cantidadSaliendo: cantidadSaliendoNum,
                cantidadNueva: Number(inputCantidadNueva.value),
                idUsuario: Number(document.getElementById('idUsuario').value)
            };

            if (!selectProducto.disabled) {
                nuevosSalidaProducto.push(productoData);
            } else {
                const idSalidaProducto = row.querySelector('.delete-product')?.getAttribute('onclick')?.match(/\d+/)?.[0];
                if (idSalidaProducto) {
                    productoData.idSalidaProducto = Number(idSalidaProducto);
                    actualizarSalidaProducto.push(productoData);
                }
            }
        }
    });

    // Recolectar productos a eliminar
    const productosEliminar = form.querySelectorAll('input[name="productosEliminar[]"]');
    productosEliminar.forEach(input => {
        eliminarSalidaProducto.push({
            idSalidaProducto: Number(input.value)
        });
    });

    // Si todo es válido, recolectar datos de la salida
    if (isValid) {
        const idSalida = document.getElementById('id-salida').value;
        const fechaSalida = document.getElementById('fecha-salida').value;
        const idColaboradorEntregando = document.getElementById('colaborador-entregando').value;
        const idColaboradorRecibiendo = document.getElementById('colaborador-recibiendo').value;
        const notas = document.getElementById('notas').value;

        salidaData = {
            idSalida: idSalida ? Number(idSalida) : null,
            fechaSalida,
            idColaboradorEntregando: Number(idColaboradorEntregando),
            idColaboradorRecibiendo: Number(idColaboradorRecibiendo),
            notas
        };

        nuevosSalidaProducto.forEach(producto => producto.idSalida = salidaData.idSalida);
        actualizarSalidaProducto.forEach(producto => producto.idSalida = salidaData.idSalida);
    }

    if (isValid) {
        Swal.fire({
            title: "Creando Salida",
            text: "¿Está seguro que desea actualizar esta salida?, algunos de los cambios no son reversibles!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                window.api.actualizarSalidaYProductos(
                    nuevosSalidaProducto,
                    actualizarSalidaProducto,
                    eliminarSalidaProducto,
                    salidaData,
                    (respuesta) => {
                        if (respuesta.success) {
                            mostrarToastConfirmacion(respuesta.message);
                            setTimeout(() => {
                                cargarEdicionSalida(document.getElementById('id-salida').value);
                            }, 2000);
                        } else {
                            mostrarToastError(respuesta.message);
                        }
                    }
                );
            }
        });
    }
}

function validarYRecolectarDatosNuevaSalidaProducto() {
    // Limpiar mensajes de error previos y estilos
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => input.style.border = '');

    // Seleccionar todos los inputs y selects no deshabilitados dentro del formulario
    const form = document.getElementById('output-form');
    const inputs = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    let isValid = true;

    // Array para nuevos SalidaProducto
    const nuevosSalidaProducto = [];
    let salidaData = null;

    // Validar campos generales obligatorios
    inputs.forEach(input => {
        const value = input.value.trim();
        const isSelect = input.tagName === 'SELECT';
        const isNumber = input.type === 'number';
        const isEmpty = value === '' || (isSelect && value === '0');

        // Validar campos obligatorios
        if (isEmpty && input.id !== 'notas' && input.id !== 'id-salida' && input.id !== 'id-salida-producto') {
            if (input.id === 'fecha-salida' || input.id === 'colaborador-entregando' || input.id === 'colaborador-recibiendo') {
                isValid = false;
                input.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Este campo es obligatorio';
                input.parentElement.appendChild(errorMessage);
            }
        }
    });

    // Validar y recolectar datos de productos dinámicos
    const productRows = document.querySelectorAll('#products-body .product-row');
    productRows.forEach(row => {
        const selectProducto = row.querySelector('.product-select');
        const inputCantidadAnterior = row.querySelector('.product-prev-qty');
        const inputCantidadSaliendo = row.querySelector('.product-out-qty');
        const inputCantidadNueva = row.querySelector('.product-new-qty');

        const idProducto = selectProducto.value;
        const cantidadAnterior = Number(inputCantidadAnterior.value);
        const cantidadSaliendo = inputCantidadSaliendo.value.trim();
        const cantidadSaliendoNum = Number(cantidadSaliendo);

        // Validar campos no deshabilitados
        if (!selectProducto.disabled) {
            if (idProducto === '0') {
                isValid = false;
                selectProducto.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Seleccione un producto';
                selectProducto.parentElement.appendChild(errorMessage);
            }
        }

        if (!inputCantidadSaliendo.disabled) {
            if (cantidadSaliendo === '') {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'Ingrese la cantidad saliente';
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            } else if (cantidadSaliendoNum <= 0) {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = 'La cantidad saliente debe ser mayor a 0';
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            } else if (cantidadSaliendoNum > cantidadAnterior) {
                isValid = false;
                inputCantidadSaliendo.style.border = '2px solid red';
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.style.color = 'red';
                errorMessage.style.fontSize = '12px';
                errorMessage.textContent = `No puede salir más de lo disponible (${cantidadAnterior})`;
                inputCantidadSaliendo.parentElement.appendChild(errorMessage);
            }
        }

        // Recolectar datos si es válido
        if (
            idProducto !== '0' &&
            cantidadSaliendo !== '' &&
            cantidadSaliendoNum > 0 &&
            cantidadSaliendoNum <= cantidadAnterior
        ) {
            const productoData = {
                idProducto: Number(idProducto),
                cantidadAnterior: cantidadAnterior,
                cantidadSaliendo: cantidadSaliendoNum,
                cantidadNueva: Number(inputCantidadNueva.value),
                idUsuario: Number(document.getElementById('idUsuario').value)
            };

            if (!selectProducto.disabled) {
                nuevosSalidaProducto.push(productoData);
            }
        }
    });

    // Si todo es válido, recolectar datos de la salida
    if (isValid) {
        const fechaSalida = document.getElementById('fecha-salida').value;
        const idUsuarioRegistro = document.getElementById("idUsuario").value;
        const idColaboradorEntregando = document.getElementById('colaborador-entregando').value;
        const idColaboradorRecibiendo = document.getElementById('colaborador-recibiendo').value;
        const notas = document.getElementById('notas').value;

        salidaData = {
            fechaSalida,
            idUsuario: Number(idUsuarioRegistro),
            idColaboradorEntregando: Number(idColaboradorEntregando),
            idColaboradorRecibiendo: Number(idColaboradorRecibiendo),
            notas
        };
    }

    if (isValid) {
        Swal.fire({
            title: "Creando Salida",
            text: "¿Está seguro que desea crear esta salida? Algunos de los cambios no son reversibles.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                window.api.crearSalidaYProductos(
                    nuevosSalidaProducto,
                    salidaData,
                    (respuesta) => {
                        if (respuesta.success) {
                            mostrarToastConfirmacion(respuesta.message);
                            setTimeout(() => {
                                // Redirigir o recargar el formulario según tu flujo
                                adjuntarHTML('/salida-producto/salida-admin.html', cargarSalidasTabla) // Ajusta según tu estructura
                            }, 2000);
                        } else {
                            mostrarToastError(respuesta.message);
                        }
                    }
                );
            }
        });
    }
}

function selectProductosOptionValidationSalida(select) {
    if (select.value === 'crear') {
        const form = document.getElementById("editarProductoForm");
        form.reset();

        // Llenar selects de categorías y unidades de medición
        const categoriaSelect = document.getElementById("categorias");
        cargarCategorias(categoriaSelect, "Seleccionar categoría");
        const unidadMedicionSelect = document.getElementById("unidadMedicion");
        cargarUnidadesMedición(unidadMedicionSelect, "Seleccionar");

        var selectIdInput = document.createElement("input");
        selectIdInput.setAttribute("type", "hidden");
        selectIdInput.setAttribute("id", "idSelectProductoDesdeSalida");
        selectIdInput.value = select.id;

        form.appendChild(selectIdInput);

        document.getElementById("idProducto").value = "";
        document.getElementById("errorMessage").textContent = "";

        document.getElementById("modalTitle").innerText = "Crear Producto";
        document.getElementById("buttonModal").onclick = enviarCreacionProductoDesdeSalida;

        document.getElementById("editarProductoModal").style.display = "block";
    } else {
        actualizarCantidadPreviaSalida(select);
    }
}
function actualizarCantidadPreviaSalida(select) {
    const selectedOption = select.options[select.selectedIndex];
    const cantidad = selectedOption.getAttribute('data-cantidad') || 0;
    const unidadMedicion = selectedOption.getAttribute('data-unidad-medicion') || 'Unidad';
    const row = select.closest('tr');
    const prevQtyInput = row.querySelector('.product-prev-qty');
    const unitInput = row.querySelector('.product-unit');
    prevQtyInput.value = cantidad;
    unitInput.value = unidadMedicion;
}
function enviarCreacionProductoDesdeSalida() {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value || "N/A";
    const cantidad = document.getElementById("cantidad").value;
    const unidadMedicion = document.getElementById("unidadMedicion").value;
    const categoria = document.getElementById("categorias").value;
    const errorMessage = document.getElementById("errorMessage");

    // Validación básica
    if (!nombre || !unidadMedicion || !categoria) {
        errorMessage.textContent = "Por favor, llene todos los campos obligatorios.";
        return;
    } else {
        errorMessage.textContent = "";
    }

    const productoData = {
        nombre,
        descripcion,
        cantidad,
        unidadMedicion,
        categoria
    };

    Swal.fire({
        title: "Creando producto",
        text: "¿Está seguro que desea crear este nuevo producto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4a4af4",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            window.api.crearProducto(productoData);
            window.api.onRespuestaCrearProducto((respuesta) => {
                if (respuesta.success) {
                    mostrarToastConfirmacion(respuesta.message);
                    setTimeout(() => {
                        llenarProductosSelectByClass(".product-name", 1);
                        cerrarModal("editarProductoModal", "editarProductoForm");
                    }, 2000);
                } else {
                    mostrarToastError(respuesta.message);
                }
            });
        }
    });
}