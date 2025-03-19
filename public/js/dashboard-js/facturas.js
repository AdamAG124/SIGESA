// Cambiar estado
document.getElementById('estado').addEventListener('change', function () {
    const estadoLabel = document.getElementById('estado-label');
    if (this.checked) {
        estadoLabel.textContent = 'ACTIVA';
        estadoLabel.className = 'form-check-label status-badge status-active';
    } else {
        estadoLabel.textContent = 'INACTIVA';
        estadoLabel.className = 'form-check-label status-badge status-inactive';
    }
});

// Agregar nuevo producto
function addProduct() {
    const tbody = document.getElementById('products-body');
    const newRow = document.createElement('tr');
    newRow.className = 'product-row';
    newRow.innerHTML = `
            <td><input type="text" class="form-control product-name" value=""></td>
            <td><input type="text" class="form-control product-description" value=""></td>
            <td><input type="text" class="form-control product-unit" value="Unidad"></td>
            <td><input type="number" class="form-control product-prev-qty" value="0"></td>
            <td><input type="number" class="form-control product-new-qty" value="0"></td>
            <td><input type="number" class="form-control product-price" value="0.00" step="0.01"></td>
            <td><input type="number" class="form-control product-subtotal" value="0.00" step="0.01"></td>
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

// Imprimir factura
function printInvoice() {
    if (window.electronAPI) {
        window.electronAPI.printToPDF();
    } else {
        window.print();
    }
}

// Guardar factura
function saveInvoice() {
    // Aquí iría el código para guardar los datos en la base de datos
    // Por ahora, solo mostraremos un mensaje
    alert('Factura guardada correctamente');
}

// Volver a la página anterior
function goBack() {
    window.history.back();
}