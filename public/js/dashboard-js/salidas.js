async function cargarEdicionSalida(idSalida) {
    try {
        // Obtener los datos de la salida usando la función del preload.js
        const productosPorSalida = await window.api.obtenerProductosPorSalida(idSalida);
        console.log('Datos obtenidos:', productosPorSalida);

        if (!productosPorSalida || productosPorSalida.length === 0) {
            throw new Error('No se encontraron datos para la salida especificada.');
        }

        // Usar la primera posición del array para la información general
        const datosGenerales = productosPorSalida[0];

        // Llenar los campos de información general
        document.getElementById('id-salida-producto').value = datosGenerales.idSalidaProducto;
        document.getElementById('id-salida').value = datosGenerales.idSalida;
        document.getElementById('id-usuario').value = datosGenerales.idUsuario;
        document.getElementById('fecha-salida').value = new Date(datosGenerales.fechaSalida).toISOString().slice(0, 16);
        document.getElementById('notas').value = datosGenerales.detalleSalida || '';
        const estadoBadge = document.querySelector('.status-badge');
        estadoBadge.textContent = datosGenerales.estadoSalida ? 'Activo' : 'Inactivo';
        estadoBadge.className = `status-badge ${datosGenerales.estadoSalida ? 'status-active' : 'status-inactive'}`;
        document.querySelector('.readonly-value:last-child').textContent = datosGenerales.nombreUsuario;

        setTimeout(() => {
            // Llenar y preseleccionar el select del colaborador que entrega
            const selectSacando = document.getElementById('colaborador-entregando');
            selectSacando.innerHTML = colaboradoresDisponibles.map(col => `
            <option value="${col.idColaborador}" 
                    data-correo="${col.correo}" 
                    data-telefono="${col.numTelefono}" 
                    data-departamento="${col.nombreDepartamento}" 
                    data-puesto="${col.nombrePuesto}"
                    ${col.idColaborador === datosGenerales.idColaboradorSacando ? 'selected' : ''}>
                ${col.nombre} ${col.primerApellido} ${col.segundoApellido || ''}
            </option>
            `).join('');
            actualizarDatosColaboradorSacando(selectSacando); // Actualizar los inputs con el colaborador preseleccionado

            // Llenar y preseleccionar el select del colaborador que recibe
            const selectRecibiendo = document.getElementById('colaborador-recibiendo');
            selectRecibiendo.innerHTML = colaboradoresDisponibles.map(col => `
            <option value="${col.idColaborador}" 
                    data-correo="${col.correo}" 
                    data-telefono="${col.numTelefono}" 
                    data-departamento="${col.nombreDepartamento}" 
                    data-puesto="${col.nombrePuesto}"
                    ${col.idColaborador === datosGenerales.idColaboradorRecibiendo ? 'selected' : ''}>
                ${col.nombre} ${col.primerApellido} ${col.segundoApellido || ''}
            </option>
            `).join('');
            actualizarDatosColaboradorRecibiendo(selectRecibiendo); // Actualizar los inputs con el colaborador preseleccionado
        }, 1000);

        // Llenar la tabla de productos dinámicamente
        const tbody = document.getElementById('products-body');
        tbody.innerHTML = ''; // Vaciar el tbody

        // Obtener la lista de productos disponibles
        const productosDisponibles = await obtenerProductosDisponibles();

        productosPorSalida.forEach(producto => {
            const row = document.createElement('tr');
            row.className = 'product-row';

            row.innerHTML = `
                <input type="hidden" class="product-id" value="${producto.idProducto}">
                <input type="hidden" class="product-status" value="${producto.estadoProducto ? 1 : 0}">
                <td>
                    <select class="form-select product-select" onchange="updateProductDetails(this)">
                        ${productosDisponibles.map(p => `
                            <option value="${p.idProducto}" 
                                    data-status="${p.estadoProducto ? 1 : 0}" 
                                    data-unit="${p.unidadMedicion}" 
                                    data-qty="${p.cantidadTotalProducto}"
                                    ${p.idProducto === producto.idProducto ? 'selected' : ''}>
                                <span class="product-status-indicator ${p.estadoProducto ? 'status-active-dot' : 'status-inactive-dot'}"></span>
                                ${p.nombreProducto}
                            </option>
                        `).join('')}
                    </select>
                    <div class="mt-1">
                        <span class="product-status-indicator ${producto.estadoProducto ? 'status-active-dot' : 'status-inactive-dot'}"></span>
                        <small class="text-muted">${producto.estadoProducto ? 'Activo' : 'Inactivo'}</small>
                    </div>
                </td>
                <td><input type="text" class="form-control product-unit" value="${producto.unidadMedicion}" readonly></td>
                <td><input type="number" class="form-control product-prev-qty" value="${producto.cantidadAnterior}" onchange="updateNewQuantity(this.closest('tr'))"></td>
                <td><input type="number" class="form-control product-out-qty" value="${producto.cantidadSaliendo}" min="1" onchange="updateNewQuantity(this.closest('tr'))"></td>
                <td><input type="number" class="form-control product-new-qty" value="${producto.cantidadNueva}"></td>
                <td class="no-print"><i class="material-icons delete-product" onclick="deleteProduct(this)">delete</i></td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar la edición de la salida:', error.message);
        alert('Error al cargar los datos: ' + error.message);
    }
}

function actualizarDatosColaboradorSacando(select) {
    const selectedOption = select.options[select.selectedIndex];
    document.getElementById('id-colaborador-sacando').value = selectedOption.value;
    document.getElementById('correo-sacando').value = selectedOption.dataset.correo;
    document.getElementById('telefono-sacando').value = selectedOption.dataset.telefono;
    document.getElementById('departamento-sacando').value = selectedOption.dataset.departamento;
    document.getElementById('puesto-sacando').value = selectedOption.dataset.puesto;
}

function actualizarDatosColaboradorRecibiendo(select) {
    const selectedOption = select.options[select.selectedIndex];
    document.getElementById('id-colaborador-recibiendo').value = selectedOption.value;
    document.getElementById('correo-recibiendo').value = selectedOption.dataset.correo;
    document.getElementById('telefono-recibiendo').value = selectedOption.dataset.telefono;
    document.getElementById('departamento-recibiendo').value = selectedOption.dataset.departamento;
    document.getElementById('puesto-recibiendo').value = selectedOption.dataset.puesto;
}

function obtenerColaboradoresDisponibles() {
    window.api.obtenerColaboradores(null, null, 1, null, null, null, (respuesta) => {
        if (respuesta.colaboradores) {
            return respuesta.colaboradores;
        } else {
            throw new Error('Error al obtener colaboradores.');
        }
    });
}