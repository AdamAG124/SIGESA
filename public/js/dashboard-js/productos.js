async function generarReporte(formato) {
    try {
        const estadoFiltro = document.getElementById('estado-filtro').value;
        const categoriaFiltro = document.getElementById('categoria-filtro').value;

        const filtroEstado = estadoFiltro === '' ? null : parseInt(estadoFiltro, 10);
        const filtroCategoria = categoriaFiltro === '' ? null : parseInt(categoriaFiltro, 10);

        console.log(filtroEstado);
        console.log(filtroCategoria);

        const mensaje = await window.api.generarReporte(filtroEstado, filtroCategoria, parseInt(formato, 10));

        mostrarToastConfirmacion(mensaje);
    } catch (error) {
        console.error('Error al generar el reporte:', error.message);
        alert('Error al generar el reporte: ' + error.message);
    }
}