
// Agregar nuevo producto
function addProduct() {
    const tbody = document.getElementById('products-body');
    const newRow = document.createElement('tr');
    newRow.className = 'product-row';
    newRow.innerHTML = `
        <td><input type="text" class="form-control product-name" value=""></td>
        <td><input type="text" class="form-control product-unit" value="Unidad"></td>
        <td><input type="number" class="form-control product-prev-qty" value="0"></td>
        <td><input type="number" class="form-control product-new-qty" value="0"></td>
        <td><input type="number" class="form-control product-price" value="0.00" step="0.01"></td>
        <td class="no-print"><i class="material-icons delete-product" onclick="deleteProduct(this)">delete</i></td>
    `;
    tbody.appendChild(newRow);
}

// Eliminar producto
function deleteProduct(icon) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        const row = icon.closest('tr');
        row.remove();
    }
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

            // Título
            document.getElementById('numero-factura').textContent = primerProducto.numeroFactura;
            document.getElementById('numero-factura-info').textContent = primerProducto.numeroFactura;

            // Información general de la factura
            document.getElementById('fecha-factura').textContent = primerProducto.fechaFactura;
            document.getElementById('comprobante-pago').textContent = primerProducto.numeroComprobantePago;
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
            const productosBody = document.getElementById('productos-body');
            productosBody.innerHTML = ''; // Limpiar el contenido previo
            productos.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.nombreProducto}</td>
                    <td>${producto.descripcionProducto}</td>
                    <td>${producto.unidadMedicion}</td>
                    <td>${producto.cantidadAnterior}</td>
                    <td>${producto.cantidadEntrando}</td>
                    <td>₡${parseFloat(producto.precioNueva).toFixed(2)}</td>
                    <td>₡${parseFloat(producto.cantidadEntrando * producto.precioNueva).toFixed(2)}</td>
                `;
                productosBody.appendChild(row);
            });

            // Calcular y llenar el resumen
            const subtotal = productos.reduce((sum, prod) => sum + (prod.cantidadEntrando * prod.precioNueva), 0);
            const impuesto = primerProducto.impuesto || (subtotal * 0.13); // Usa el valor de la factura o calcula 13%
            const descuento = primerProducto.descuento || 0;
            const total = subtotal + impuesto - descuento;

            document.getElementById('subtotal').textContent = `₡${subtotal.toFixed(2)}`;
            document.getElementById('impuesto').textContent = `₡${impuesto.toFixed(2)}`;
            document.getElementById('descuento').textContent = `₡${descuento.toFixed(2)}`;
            document.getElementById('total').textContent = `₡${total.toFixed(2)}`;
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

    window.api.obtenerFactura(idFactura, (respuesta) => {
        const productos = respuesta.productos;

        if (productos && productos.length > 0) {
            // Usar el primer producto para la información general
            const primerProducto = productos[0];

            // Título
            document.getElementById('invoice-title').textContent = `Editar Factura #${primerProducto.numeroFactura}`;

            // Información general
            document.getElementById('numero-factura').value = primerProducto.numeroFactura;
            document.getElementById('fecha-factura').value = new Date(primerProducto.fechaFactura).toISOString().slice(0, 16);
            document.getElementById('comprobante-pago').value = primerProducto.numeroComprobantePago;
            document.getElementById('proveedor').value = Number(primerProducto.idProveedor);
            const estadoLabel = document.getElementById('estado-label');
            estadoLabel.textContent = primerProducto.estadoFactura === 1 ? 'ACTIVA' : 'INACTIVA';
            estadoLabel.className = `form-check-label status-badge ${primerProducto.estadoFactura === 1 ? 'status-active' : 'status-inactive'}`;

            // Información del colaborador (solo lectura)
            document.getElementById('registradoPor').textContent = primerProducto.nombreUsuario; // Registrado por
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
            productos.forEach(producto => {
                total += producto.cantidadEntrando * producto.precioNueva;
                const row = document.createElement('tr');
                row.className = 'product-row';
                row.innerHTML = `
                    <td><input type="text" class="form-control product-name" value="${producto.nombreProducto}"></td>
                    <td><input type="text" class="form-control product-unit" value="${producto.unidadMedicion}"></td>
                    <td><input type="number" class="form-control product-prev-qty" value="${producto.cantidadAnterior}"></td>
                    <td><input type="number" class="form-control product-new-qty" value="${producto.cantidadEntrando}"></td>
                    <td><input type="number" class="form-control product-price" value="${producto.precioNueva.toFixed(2)}" step="0.01"></td>
                    <td class="no-print"><i class="material-icons delete-product" onclick="deleteProduct(this)">delete</i></td>
                `;
                productsBody.appendChild(row);
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
}