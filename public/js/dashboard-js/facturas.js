
// Agregar nuevo producto
function addProduct() {
    const tbody = document.getElementById('products-body');
    const newRow = document.createElement('tr');
    const uniqueId = `product-select-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    newRow.className = 'product-row';
    newRow.innerHTML = `
        <td><select class="form-control product-name" id="${uniqueId}" onchange="actualizarCantidadPrevia(this)">
            <option value="0">Seleccione un producto</option>
        </select></td>
        <td><input type="text" class="form-control product-unit" disabled></td>
        <td><input type="number" class="form-control product-prev-qty" value="0" disabled></td>
        <td><input type="number" class="form-control product-new-qty" value="0"></td>
        <td><input type="number" class="form-control product-price" value="0.00" step="0.01"></td>
        <td class="no-print"><i class="material-icons delete-product" onclick="deleteProduct(this)">delete</i></td>
    `;
    tbody.appendChild(newRow);
    llenarProductosSelect(uniqueId, 1);
}

// Eliminar producto
function deleteProduct(icon) {
    const row = icon.closest('tr');
    row.remove();
}

function marcarProductosFacturaEliminar(icon, idFacturaProducto) {
    const row = icon.closest('tr');
    row.style.border = "2px solid red";
    const column = icon.closest('td');

    const formEditarFacturaProducto = document.getElementById('invoice-form');
    const inputProductosEliminar = document.createElement('input');
    inputProductosEliminar.type = 'hidden';
    inputProductosEliminar.name = 'productosEliminar[]';
    inputProductosEliminar.value = idFacturaProducto;
    formEditarFacturaProducto.appendChild(inputProductosEliminar);

    icon.remove();

    const botonCancerlaEliminacion = document.createElement('i');
    botonCancerlaEliminacion.className = 'material-icons remove-product';
    botonCancerlaEliminacion.textContent = 'remove';
    botonCancerlaEliminacion.addEventListener('click', () => { cancelarEliminacionProductosFactura(botonCancerlaEliminacion, idFacturaProducto) });
    botonCancerlaEliminacion.style.color = 'white';
    botonCancerlaEliminacion.style.backgroundColor = 'red';
    botonCancerlaEliminacion.style.cursor = 'pointer';
    column.appendChild(botonCancerlaEliminacion);
}

function cancelarEliminacionProductosFactura(icon, idFacturaProducto) {
    const row = icon.closest('tr');
    row.style.border = "";
    const column = icon.closest('td');

    const inputProductosEliminar = document.querySelectorAll('input[name="productosEliminar[]"]');
    inputProductosEliminar.forEach(elemento => {
        if (Number(elemento.value) === Number(idFacturaProducto)) {
            elemento.remove();
        }
    });
    icon.remove();

    const botonEliminar = document.createElement('i');
    botonEliminar.className = 'material-icons delete-product';
    botonEliminar.textContent = 'delete';
    botonEliminar.addEventListener('click', () => { marcarProductosFacturaEliminar(botonEliminar, idFacturaProducto) });
    column.appendChild(botonEliminar);
}

function cargarFacturasTabla(pageSize = 10, pageNumber = 1, estadoFactura = 1, idProveedor = null, fechaInicio = null, fechaFin = null, idComprobantePago = null, searchValue = null) {
    // Obtener los elementos del DOM
    const selectPageSize = document.getElementById('selectPageSize'); // Tamaño de página
    const selectEstado = document.getElementById('estadoFiltro'); // Estado
    const inputFechaInicio = document.getElementById('fechaInicialFiltro');
    const inputFechaFin = document.getElementById('fechaFinalFiltro');
    const selectProveedor = document.getElementById('proveedorFiltro'); // Proveedor
    const selectComprobante = document.getElementById('comprobanteFiltro'); // Comprobante
    const searchInput = document.getElementById('search-bar');

    // Configurar valores iniciales en los filtros
    selectPageSize.value = pageSize;

    // Configurar el select de estado
    if (estadoFactura === 1) selectEstado.value = 1;
    else if (estadoFactura === 0 || estadoFactura === null) selectEstado.value = 0;
    else selectEstado.value = 2;

    if (fechaInicio) inputFechaInicio.value = fechaInicio;
    if (fechaFin) inputFechaFin.value = fechaFin;

    if (searchValue) searchInput.value = searchValue;
    cargarPtroveedores("proveedorFiltro", "Filtrar por proveedor");
    cargarComprobantesPago("comprobanteFiltro", "Filtrar por Comprobante");

    setTimeout(function () {
        if (idProveedor) selectProveedor.value = idProveedor;
        if (idComprobantePago) selectComprobante.value = idComprobantePago;

        window.api.obtenerFacturas(pageSize, pageNumber, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue, (respuesta) => {
            const tbody = document.getElementById("facturas-table-body");
            tbody.innerHTML = ""; // Limpiar contenido previo

            // Iterar sobre las facturas y agregarlas a la tabla
            respuesta.facturas.forEach((factura) => {
                const fechaFactura = factura.fechaFactura ? new Date(factura.fechaFactura).toLocaleDateString('es-ES') : 'Sin fecha';
                const estadoTexto = factura.estadoFactura === 1 ? "Activo" : "Inactivo";

                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${factura.nombreProveedor || 'Sin proveedor'}</td>
                  <td>${factura.numeroFactura || 'Sin número'}</td>
                  <td>${fechaFactura}</td>
                  <td>${factura.numeroComprobantePago || 'Sin comprobante'}</td>
                  <td class="action-icons">
                      <button class="tooltip" value="${factura.idFactura}" onclick="verDetallesFactura(this.value, '/factura-view/editar-factura.html', 2)">
                          <span class="material-icons">edit</span>
                          <span class="tooltiptext">Editar factura</span>
                      </button>
                      <button class="tooltip" value="${factura.idFactura}" onclick="verDetallesFactura(this.value, '/factura-view/detalles-factura.html', 1)">
                          <span class="material-icons">info</span>
                          <span class="tooltiptext">Ver detalles</span>
                      </button>
                      <button class="tooltip" value="${factura.idFactura}" onclick="${factura.estadoFactura === 1 ? `actualizarEstadoFactura(this.value, 0, 'Eliminando factura', '¿Está seguro que desea eliminar esta factura?', 1)` : `actualizarEstadoFactura(this.value, 1, 'Reactivando factura', '¿Está seguro que desea reactivar esta factura?', 1)`}">
                          <span class="material-icons">
                              ${factura.estadoFactura === 1 ? 'delete' : 'restore'}
                          </span>
                          <span class="tooltiptext">
                              ${factura.estadoFactura === 1 ? 'Eliminar factura' : 'Reactivar factura'}
                          </span>
                      </button>
                  </td>
              `;
                tbody.appendChild(row);
            });

            // Actualizar los botones de paginación
            actualizarPaginacion(respuesta.paginacion, ".pagination", 6);
        });
    }, 100);
}

function verDetallesFactura(idFactura, ruta, option) {
    adjuntarHTML(ruta, false);
    if (option === 1) {
        cargarFactura(idFactura);
    } else if (option === 2) {
        cargarFacturaEditable(idFactura)
    }
}

function cargarFactura(idFactura) {
    window.api.obtenerFactura(idFactura, (respuesta) => {
        const productos = respuesta.productos;

        if (productos && productos.length > 0) {
            // Usar el primer objeto para la información general
            const primerProducto = productos[0];

            document.getElementById('buttonEditFactura').value = idFactura;
            // Título
            document.getElementById('numero-factura').textContent = primerProducto.numeroFactura;
            document.getElementById('numero-factura-info').textContent = primerProducto.numeroFactura;

            // Información general de la factura
            document.getElementById('fecha-factura').textContent = primerProducto.fechaFactura;
            document.getElementById('comprobante-pago').textContent = primerProducto.numeroComprobantePago || 'Sin comprobante';
            document.getElementById('estado-factura-info').textContent = primerProducto.estadoFactura === 1 ? 'Activa' : 'Inactiva';
            document.getElementById('estado-factura').textContent = primerProducto.estadoFactura === 1 ? 'Activa' : 'Inactiva';
            document.getElementById('estado-factura').classList.add(primerProducto.estadoFactura === 1 ? 'status-active' : 'status-inactive');

            // Información del proveedor y registrado por
            document.getElementById('proveedor').textContent = primerProducto.nombreProveedor; // Solo ID, ajusta si tienes el nombre
            document.getElementById('registrado-por').textContent = primerProducto.nombreUsuario;
            document.getElementById('departamento').textContent = primerProducto.nombreDepartamento; // No hay campo directo, ajusta si tienes esta info
            document.getElementById('telefono').textContent = primerProducto.numTelefono || ''; // Ajusta si tienes teléfono del proveedor

            // Información del colaborador
            document.getElementById('nombre-colaborador').textContent = `${primerProducto.nombreColaborador} ${primerProducto.primerApellido} ${primerProducto.segundoApellido}`;
            document.getElementById('cedula').textContent = primerProducto.cedulaColaborador;
            document.getElementById('puesto').textContent = primerProducto.nombrePuesto; // No hay campo directo, ajusta si tienes esta info
            document.getElementById('departamento-colaborador').textContent = primerProducto.nombreDepartamento; // No hay campo directo, ajusta si tienes esta info
            document.getElementById('correo').textContent = primerProducto.correoColaborador;
            document.getElementById('telefono-colaborador').textContent = primerProducto.numTelefono || ''; // Ajusta si tienes teléfono

            // Detalles adicionales
            document.getElementById('notas').textContent = primerProducto.detallesAdicionales;

            // Llenar la tabla de productos (iterar sobre todos los productos)
            var total = 0;
            const productosBody = document.getElementById('productos-body');
            productosBody.innerHTML = ''; // Limpiar el contenido previo
            productos.forEach(producto => {
                total += producto.cantidadEntrando * producto.precioNueva;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.nombreProducto}</td>
                    <td>${producto.descripcionProducto}</td>
                    <td>${producto.unidadMedicion}</td>
                    <td>${producto.cantidadAnterior}</td>
                    <td>${producto.cantidadEntrando}</td>
                    <td>₡${parseFloat(producto.precioNueva).toFixed(2)}</td>
                `;
                productosBody.appendChild(row);
            });

            document.getElementById('impuesto').textContent = `₡${primerProducto.impuesto.toFixed(2)}`;
            document.getElementById('descuento').textContent = `₡${primerProducto.descuento.toFixed(2)}`;
            document.getElementById('total').textContent = `₡${((total - primerProducto.descuento) + primerProducto.impuesto).toFixed(2)}`;
        } else {
            console.error('No se recibieron productos para la factura');
        }
    });
}

async function handlePrintPreview() {
    const pdfPath = await window.api.printToPDF();
}

function cargarFacturaEditable(idFactura) {
    cargarPtroveedores('proveedor', 'Seleccione un proveedor');
    cargarComprobantesPago('comprobante-pago', 'Seleccione un comprobante');
    setTimeout(function () {
        window.api.obtenerFactura(idFactura, (respuesta) => {
            const productos = respuesta.productos;

            if (productos && productos.length > 0) {
                // Usar el primer producto para la información general
                const primerProducto = productos[0];

                // Título
                document.getElementById('invoice-title').textContent = `Editar Factura #${primerProducto.numeroFactura}`;

                // Información general
                document.getElementById('numero-factura').value = primerProducto.numeroFactura;
                document.getElementById('idFactura').value = idFactura;
                document.getElementById('fecha-factura').value = new Date(primerProducto.fechaFactura).toISOString().slice(0, 16);
                document.getElementById('comprobante-pago').value = Number(primerProducto.idComprobantePago);
                document.getElementById('proveedor').value = Number(primerProducto.idProveedor);
                console.log(primerProducto.idComprobantePago);
                const estadoLabel = document.getElementById('estado-label');
                estadoLabel.textContent = primerProducto.estadoFactura === 1 ? 'ACTIVA' : 'INACTIVA';
                estadoLabel.className = `form-check-label status-badge ${primerProducto.estadoFactura === 1 ? 'status-active' : 'status-inactive'}`;

                // Información del colaborador (solo lectura)
                document.getElementById('registradoPor').textContent = primerProducto.nombreUsuario;
                document.getElementById('idUsuario').value = primerProducto.idUsuario;
                document.getElementById('departamento').textContent = primerProducto.nombreDepartamento; // Departamento
                document.getElementById('telefonoColaborador').textContent = primerProducto.numTelefono;
                document.getElementById('nombreColaborador').textContent = `${primerProducto.nombreColaborador} ${primerProducto.primerApellido} ${primerProducto.segundoApellido}`; // Nombre completo
                document.getElementById('puesto').textContent = primerProducto.nombrePuesto; // Puesto
                document.getElementById('correoColaborador').textContent = primerProducto.correoColaborador; // Correo
                document.getElementById('cedula').textContent = primerProducto.cedulaColaborador; // Cédula
                document.getElementById('departamentoColaborador').textContent = primerProducto.nombreDepartamento; // Departamento
                document.getElementById('telefonoColab').textContent = primerProducto.numTelefono;

                var total = 0;
                // Productos
                const productsBody = document.getElementById('products-body');
                productsBody.innerHTML = ''; // Limpiar tabla previa
                productos.forEach((producto, index) => {
                    total += producto.cantidadEntrando * producto.precioNueva;
                    const row = document.createElement('tr');
                    row.className = 'product-row';
                    row.innerHTML = `
                        <td><select class="form-control product-name" name="productosActualizar[]" id="product-select-${index}" disabled>
                            <option value="0">Seleccione un producto</option>
                        </select></td>
                        <td><input type="text" class="form-control product-unit" value="${producto.unidadMedicion}" disabled></td>
                        <td><input type="number" class="form-control product-prev-qty" value="${producto.cantidadAnterior}"disabled></td>
                        <td><input type="number" class="form-control product-new-qty" value="${producto.cantidadEntrando}"></td>
                        <td><input type="number" class="form-control product-price" value="${producto.precioNueva.toFixed(2)}" step="0.01"></td>
                        <td class="no-print"><i class="material-icons delete-product" onclick="marcarProductosFacturaEliminar(this, ${producto.idFacturaProducto})">delete</i></td>
                    `;
                    productsBody.appendChild(row);

                    llenarProductosSelect(`product-select-${index}`, null);

                    setTimeout(() => {
                        document.getElementById(`product-select-${index}`).value = producto.idProducto;
                    }, 100);
                });

                document.getElementById('invoice-tax').value = primerProducto.impuesto.toFixed(2);
                document.getElementById('invoice-discount').value = primerProducto.descuento.toFixed(2);
                document.getElementById('invoice-total').value = ((total - primerProducto.descuento) + primerProducto.impuesto).toFixed(2);

                // Detalles adicionales
                document.getElementById('notas').value = primerProducto.detallesAdicionales;
            } else {
                console.error('No se recibieron productos para la factura');
                alert('No se encontraron datos para la factura con ID: ' + idFactura);
            }
        });
    }, 100);
}
function llenarProductosSelect(selectId, estadoProducto) {
    window.api.obtenerProductos(null, null, estadoProducto, null, null, (respuesta) => {
        const select = document.getElementById(selectId);
        if (respuesta && respuesta.productos) {
            respuesta.productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto.idProducto;
                option.textContent = producto.estadoProducto != 0 ? producto.nombreProducto : producto.nombreProducto + ' (Producto Inactivo)';
                option.setAttribute('data-cantidad', producto.cantidad);
                option.setAttribute('data-unidad-medicion', producto.unidadMedicion);
                select.appendChild(option);
            });
        }
    });
}

function actualizarCantidadPrevia(select) {
    const selectedOption = select.options[select.selectedIndex];
    const cantidad = selectedOption.getAttribute('data-cantidad') || 0;
    const unidadMedicion = selectedOption.getAttribute('data-unidad-medicion') || 'Unidad';
    const row = select.closest('tr');
    const prevQtyInput = row.querySelector('.product-prev-qty');
    const unitInput = row.querySelector('.product-unit');
    prevQtyInput.value = cantidad;
    unitInput.value = unidadMedicion;
}

function validarYRecolectarDatosFactura() {
    // Limpiar mensajes de error previos y estilos
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => input.style.border = '');

    // Seleccionar todos los inputs y selects no deshabilitados dentro del formulario
    const form = document.getElementById('invoice-form');
    const inputs = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    let isValid = true;

    // Arrays para cada tipo de FacturaProducto y datos de factura
    const nuevosFacturaProducto = [];
    const actualizarFacturaProducto = [];
    const eliminarFacturaProducto = [];
    let facturaData = null;

    // Validar campos generales
    inputs.forEach(input => {
        const value = input.value.trim();
        const isSelect = input.tagName === 'SELECT';
        const isNumber = input.type === 'number';
        const isEmpty = value === '' || (isSelect && value === '0');
        const numericValue = isNumber ? Number(value) : null;

        // Validar campos obligatorios
        if (isEmpty && input.id !== 'notas' && input.id !== 'idFactura' && input.id !== 'comprobante-pago' && input.id !== 'invoice-discount' && input.id !== 'invoice-tax') {
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Este campo es obligatorio';
            input.parentElement.appendChild(errorMessage);
        }

        // Validar que los campos numéricos no sean negativos
        if (isNumber && value !== '' && numericValue < 0) {
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'El valor no puede ser negativo';
            input.parentElement.appendChild(errorMessage);
        }
    });

    // Validar y recolectar datos de productos
    const productRows = document.querySelectorAll('.product-row');
    productRows.forEach(row => {
        const selectProducto = row.querySelector('.product-name');
        const inputCantidadAnterior = row.querySelector('.product-prev-qty');
        const inputCantidadEntrando = row.querySelector('.product-new-qty');
        const inputPrecio = row.querySelector('.product-price');

        const idProducto = selectProducto.value;
        const cantidadEntrando = inputCantidadEntrando.value.trim();
        const precioNuevo = inputPrecio.value.trim();
        const cantidadEntrandoNum = Number(cantidadEntrando);
        const precioNuevoNum = Number(precioNuevo);

        // Validar campos no deshabilitados
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

        if (cantidadEntrando === '') {
            isValid = false;
            inputCantidadEntrando.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Ingrese la cantidad entrante';
            inputCantidadEntrando.parentElement.appendChild(errorMessage);
        } else if (cantidadEntrandoNum < 0) {
            isValid = false;
            inputCantidadEntrando.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'La cantidad entrante no puede ser negativa';
            inputCantidadEntrando.parentElement.appendChild(errorMessage);
        }

        if (precioNuevo === '') {
            isValid = false;
            inputPrecio.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Ingrese el precio unitario';
            inputPrecio.parentElement.appendChild(errorMessage);
        } else if (precioNuevoNum < 0) {
            isValid = false;
            inputPrecio.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'El precio no puede ser negativo';
            inputPrecio.parentElement.appendChild(errorMessage);
        }

        if (idProducto !== '0' && cantidadEntrando !== '' && precioNuevo !== '' && cantidadEntrandoNum >= 0 && precioNuevoNum >= 0) {
            const productoData = {
                idProducto: Number(idProducto),
                cantidadAnterior: Number(inputCantidadAnterior.value),
                cantidadEntrando: cantidadEntrandoNum,
                precioNuevo: precioNuevoNum,
                idUsuario: Number(document.getElementById('idUsuario').value)
            };

            if (!selectProducto.disabled) {
                nuevosFacturaProducto.push(productoData);
            } else {
                const idFacturaProducto = row.querySelector('.delete-product')?.getAttribute('onclick')?.match(/\d+/)?.[0];
                if (idFacturaProducto) {
                    productoData.idFacturaProducto = Number(idFacturaProducto);
                    actualizarFacturaProducto.push(productoData);
                }
            }
        }
    });

    // Recolectar productos a eliminar
    const productosEliminar = form.querySelectorAll('input[name="productosEliminar[]"]');
    productosEliminar.forEach(input => {
        eliminarFacturaProducto.push({
            idFacturaProducto: Number(input.value)
        });
    });

    // Si todo es válido, recolectar datos de la factura
    if (isValid) {
        const idFactura = document.getElementById('idFactura').value;
        const numeroFactura = document.getElementById('numero-factura').value;
        const fechaFactura = document.getElementById('fecha-factura').value;
        const idComprobantePago = document.getElementById('comprobante-pago').value;
        const idProveedor = document.getElementById('proveedor').value;
        const impuesto = document.getElementById('invoice-tax').value;
        const descuento = document.getElementById('invoice-discount').value;
        const notas = document.getElementById('notas').value;

        const impuestoNum = impuesto === '' ? 0 : Number(impuesto);
        const descuentoNum = descuento === '' ? 0 : Number(descuento);

        // Validar que impuesto y descuento no sean negativos
        if (impuestoNum < 0) {
            isValid = false;
            document.getElementById('invoice-tax').style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'El impuesto no puede ser negativo';
            document.getElementById('invoice-tax').parentElement.appendChild(errorMessage);
        }

        if (descuentoNum < 0) {
            isValid = false;
            document.getElementById('invoice-discount').style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'El descuento no puede ser negativo';
            document.getElementById('invoice-discount').parentElement.appendChild(errorMessage);
        }

        if (isValid) {
            facturaData = {
                idFactura: Number(idFactura),
                numeroFactura,
                fechaFactura,
                idComprobantePago: Number(idComprobantePago),
                idProveedor: Number(idProveedor),
                impuesto: impuestoNum,
                descuento: descuentoNum,
                detallesAdicionales: notas,
            };

            nuevosFacturaProducto.forEach(producto => producto.idFactura = facturaData);
            actualizarFacturaProducto.forEach(producto => producto.idFactura = facturaData);
        }
    }

    if (isValid) {
        Swal.fire({
            title: "Creando Factura",
            text: "¿Está seguro que desea actualizar esta factura?, algunos de los cambios no son reversibles!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                window.api.actualizarFacturaYProductos(
                    nuevosFacturaProducto,
                    actualizarFacturaProducto,
                    eliminarFacturaProducto,
                    facturaData,
                    (respuesta) => {
                        if (respuesta.success) {
                            mostrarToastConfirmacion(respuesta.message);
                            setTimeout(() => {
                                cargarFacturaEditable(document.getElementById('idFactura').value);
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

function validarYRecolectarDatosFacturaCrear() {
    // Limpiar mensajes de error previos y estilos
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => input.style.border = '');

    // Seleccionar todos los inputs y selects no deshabilitados dentro del formulario
    const form = document.getElementById('invoice-form');
    const inputs = form.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
    let isValid = true;

    const nuevosFacturaProducto = [];
    let facturaData = null;

    // Validar campos generales
    inputs.forEach(input => {
        const value = input.value.trim();
        const isSelect = input.tagName === 'SELECT';
        const isEmpty = value === '' || (isSelect && value === '0');
        const isNumber = input.type === 'number';
        const numericValue = isNumber ? Number(value) : null;

        if (isEmpty && input.id !== 'notas' && input.id !== 'idFactura' && input.id != 'comprobante-pago' && input.id !== 'invoice-discount' && input.id !== 'invoice-tax') { // Permitir que notas y idFactura estén vacíos
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Este campo es obligatorio';
            input.parentElement.appendChild(errorMessage);
        }

        if (isNumber && value !== '' && numericValue < 0) {
            isValid = false;
            input.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'El valor no puede ser negativo';
            input.parentElement.appendChild(errorMessage);
        }
    });

    // Validar y recolectar datos de productos
    const productRows = document.querySelectorAll('.product-row');
    productRows.forEach(row => {
        const selectProducto = row.querySelector('.product-name');
        const inputCantidadAnterior = row.querySelector('.product-prev-qty');
        const inputCantidadEntrando = row.querySelector('.product-new-qty');
        const inputPrecio = row.querySelector('.product-price');

        const idProducto = selectProducto.value;
        const cantidadEntrando = inputCantidadEntrando.value.trim();
        const precioNuevo = inputPrecio.value.trim();

        // Validar campos no deshabilitados
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

        if (cantidadEntrando === '') {
            isValid = false;
            inputCantidadEntrando.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Ingrese la cantidad entrante';
            inputCantidadEntrando.parentElement.appendChild(errorMessage);
        }

        if (precioNuevo === '') {
            isValid = false;
            inputPrecio.style.border = '2px solid red';
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.fontSize = '12px';
            errorMessage.textContent = 'Ingrese el precio unitario';
            inputPrecio.parentElement.appendChild(errorMessage);
        }

        if (idProducto !== '0' && cantidadEntrando !== '' && precioNuevo !== '') {
            const productoData = {
                idProducto: Number(idProducto),
                cantidadAnterior: Number(inputCantidadAnterior.value),
                cantidadEntrando: Number(cantidadEntrando),
                precioNuevo: Number(precioNuevo),
                idUsuario: Number(document.getElementById('idUsuario').value) // Obtener idUsuario del formulario
            };
            nuevosFacturaProducto.push(productoData);
        }
    });

    // Si todo es válido, recolectar datos de la factura
    if (isValid) {
        const idFactura = document.getElementById('idFactura').value || 0; // 0 si está vacío (nueva factura)
        const numeroFactura = document.getElementById('numero-factura').value;
        const fechaFactura = document.getElementById('fecha-factura').value;
        const idComprobantePago = document.getElementById('comprobante-pago').value;
        const idProveedor = document.getElementById('proveedor').value;
        const impuesto = document.getElementById('invoice-tax').value;
        const descuento = document.getElementById('invoice-discount').value;
        const notas = document.getElementById('notas').value;

        facturaData = {
            idFactura: Number(idFactura),
            numeroFactura,
            fechaFactura,
            idComprobantePago: Number(idComprobantePago),
            idProveedor: Number(idProveedor),
            impuesto: Number(impuesto),
            descuento: Number(descuento),
            detallesAdicionales: notas,
        };

        nuevosFacturaProducto.forEach(producto => producto.idFactura = facturaData);

        Swal.fire({
            title: "Actualizando Factura",
            text: "¿Está seguro que desea crear una nueva factura?, asegurese de tener toda la información correcta.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4a4af4",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                window.api.crearFacturaYProductos(nuevosFacturaProducto, facturaData, (respuesta) => {
                    if (respuesta.success) {
                        mostrarToastConfirmacion(respuesta.message);
                        setTimeout(() => {
                            console.log('Id de la factura crack: ', respuesta.idFactura);
                            verDetallesFactura(respuesta.idFactura, '/factura-view/detalles-factura.html', 1);
                        }, 2000);
                    } else {
                        mostrarToastError(respuesta.message);
                    }
                });

            }
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    .error-message {
        display: block;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);

function cargarVistaCrearFactura() {
    cargarPtroveedores('proveedor', 'Seleccione un proveedor');
    cargarComprobantesPago('comprobante-pago', 'Seleccione un comprobante');
    window.api.obtenerUsuarioLogueado((respuesta) => {
        const usuario = respuesta.usuario;
        console.log(usuario);
        document.getElementById('registradoPor').textContent = usuario.nombreUsuario;
        document.getElementById('idUsuario').value = usuario.idUsuario;
        document.getElementById('departamento').textContent = usuario.nombreDepartamento;
        document.getElementById('telefonoColaborador').textContent = usuario.numTelefono;

        document.getElementById('nombreColaborador').textContent = `${usuario.nombre} ${usuario.primerApellido} ${usuario.segundoApellido}`;
        document.getElementById('puesto').textContent = usuario.nombrePuesto;
        document.getElementById('correoColaborador').textContent = usuario.correo;
        document.getElementById('cedula').textContent = usuario.cedula;
        document.getElementById('departamentoColaborador').textContent = usuario.nombreDepartamento;
        document.getElementById('telefonoColab').textContent = usuario.numTelefono;
    });
}