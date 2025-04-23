const ConectarDB = require('./ConectarDB');
const Producto = require('../domain/Producto');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');

class ProductoDB {
    #table;
    #db;

    constructor() {
        this.#table = 'SIGM_PRODUCTO';
        this.#db = new ConectarDB();
    }

    // Método para recuperar la lista de productos con sus categorías
    async listarProductos(pageSize = null, currentPage = null, estadoProducto = null, idCategoriaFiltro = null, valorBusqueda = null) {
        let connection;
        try {
            connection = await this.#db.conectar();

            const offset = (currentPage - 1) * pageSize;

            // Base SQL query para listado y conteo
            const baseQuery = `
                FROM ${this.#table} P
                INNER JOIN SIGM_CATEGORIA_PRODUCTO C ON P.ID_CATEGORIA_PRODUCTO = C.ID_CATEGORIA_PRODUCTO
                INNER JOIN SIGM_UNIDAD_MEDICION U ON P.ID_UNIDAD_MEDICION = U.ID_UNIDAD_MEDICION
            `;

            // Inicializar condiciones del filtro
            let conditions = [];
            let params = [];

            // Agregar filtros a las condiciones
            if (estadoProducto !== null) {
                conditions.push('P.ESTADO = ?');
                params.push(estadoProducto);
            }

            if (idCategoriaFiltro !== null) {
                conditions.push('C.ID_CATEGORIA_PRODUCTO = ?');
                params.push(idCategoriaFiltro);
            }

            if (valorBusqueda && valorBusqueda.trim() !== "") {
                conditions.push(`
                    (
                        P.DSC_NOMBRE LIKE ? OR
                        P.DSC_PRODUCTO LIKE ? OR
                        P.NUM_CANTIDAD LIKE ?
                    )
                `);
                const searchParam = `%${valorBusqueda}%`;
                params.push(searchParam, searchParam, searchParam);
            }

            // Construir cláusula WHERE
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // Inicializar limitOffsetClause para paginación
            let limitOffsetClause = '';
            if (pageSize) {
                limitOffsetClause = ' LIMIT ? OFFSET ?';
                params.push(pageSize, offset);
            }

            // Query principal con paginación
            const query = `
                SELECT 
                    P.ID_PRODUCTO AS idProducto, P.ID_CATEGORIA_PRODUCTO AS idCategoria,
                    P.DSC_NOMBRE AS nombreProducto, P.DSC_PRODUCTO AS descripcionProducto,
                    P.NUM_CANTIDAD AS cantidad, P.ID_UNIDAD_MEDICION AS idUnidadMedicion,
                    P.ESTADO AS estadoProducto, C.DSC_NOMBRE AS nombreCategoria, 
                    C.DSC_DESCRIPCION AS descripcionCategoria, C.ESTADO AS estadoCategoria,
                    U.DSC_NOMBRE AS nombreUnidadMedicion, U.ESTADO AS estadoUnidadMedicion
                ${baseQuery}
                ${whereClause}
                ${limitOffsetClause}
            `;

            // Ejecutar consulta
            const [rows] = await connection.query(query, params);
            
            // Mapear resultados a objetos Producto
            const productos = rows.map(productoDB => {
                const producto = new Producto();
                producto.setIdProducto(productoDB.idProducto);
                producto.setNombre(productoDB.nombreProducto);
                producto.setDescripcion(productoDB.descripcionProducto);
                producto.setCantidad(productoDB.cantidad);
                producto.setEstado(productoDB.estadoProducto);

                // Setters para la categoría del producto
                producto.getCategoria().setIdCategoria(productoDB.idCategoria);
                producto.getCategoria().setNombre(productoDB.nombreCategoria);
                producto.getCategoria().setDescripcion(productoDB.descripcionCategoria);
                producto.getCategoria().setEstado(productoDB.estadoCategoria);

                // Setters para la unidad de medición
                producto.getUnidadMedicion().setIdUnidadMedicion(productoDB.idUnidadMedicion);
                producto.getUnidadMedicion().setNombre(productoDB.nombreUnidadMedicion);
                producto.getUnidadMedicion().setEstado(productoDB.estadoUnidadMedicion);

                return producto;
            });

            const countQuery = `SELECT COUNT(DISTINCT P.ID_PRODUCTO) as total ${baseQuery} ${whereClause}`;
            const paramsForCount = pageSize ? params.slice(0, -2) : params;
            const [countResult] = await connection.query(countQuery, paramsForCount);

            const totalRecords = countResult[0].total;
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            return {
                productos,
                pagination: {
                    currentPage,
                    pageSize,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoProducto,
                    idCategoria: idCategoriaFiltro,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar productos:', error);
            return {
                success: false,
                message: `Error al listar productos: ${error.message}`
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async crearProducto(producto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Obtener atributos del producto
            const nombre = producto.getNombre() || 'Acción requerida: ingrese un nombre';
            const descripcion = producto.getDescripcion();
            const cantidad = producto.getCantidad() || 0;
            const unidadMedicion = producto.getUnidadMedicion()?.getIdUnidadMedicion();
            const categoria = producto.getCategoria()?.getIdCategoria();
            const estado = producto.getEstado() ?? 1; // 1 (Activo)
            console.log('Estado:', estado);

            if (!categoria) {
                return { success: false, message: 'La categoría del producto es necesaria.' };
            }

            // Verificar si el producto ya existe en la misma categoría
            const existingQuery = `
                SELECT COUNT(*) AS count FROM ${this.#table} 
                WHERE DSC_NOMBRE = ? AND ID_CATEGORIA_PRODUCTO = ?
            `;
            const [existingRows] = await connection.query(existingQuery, [nombre, categoria]);

            if (existingRows[0].count > 0) {
                return { success: false, message: 'El nombre del producto ya existe en esta categoría.' };
            }

            // Insertar el producto
            const query = `
                INSERT INTO ${this.#table} 
                (DSC_NOMBRE, DSC_PRODUCTO, NUM_CANTIDAD, ID_UNIDAD_MEDICION, ID_CATEGORIA_PRODUCTO, ESTADO) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const params = [nombre, descripcion, cantidad, unidadMedicion, categoria, estado];

            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return { success: true, message: 'Producto creado exitosamente.' };
            } else {
                return { success: false, message: 'No se pudo crear el producto.' };
            }
        } catch (error) {
            console.error('Error al crear producto:', error);
            return { success: false, message: `Error al crear el producto: ${error.message}` };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async eliminarProducto(producto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Construimos la consulta SQL
            const query = `UPDATE ${this.#table} SET estado = ? WHERE ID_PRODUCTO = ?`; // Cambiamos estado a 0 (inactivo)
            const params = [producto.getEstado(), producto.getIdProducto()];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (producto.getEstado() === 0) {
                    return {
                        success: true,
                        message: 'Producto desactivado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Producto reactivado exitosamente.'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'No se encontró el producto o no se desactivó.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el producto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }

    }


    async obtenerProductoPorId(idProducto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Construir la consulta SQL
            const query = `
                SELECT
                    P.ID_PRODUCTO AS idProducto, P.DSC_NOMBRE AS nombreProducto,
                    P.DSC_PRODUCTO AS descripcionProducto, P.NUM_CANTIDAD AS cantidad,
                    P.ID_UNIDAD_MEDICION AS idUnidadMedicion, P.ESTADO AS estadoProducto,
                    C.ID_CATEGORIA_PRODUCTO AS idCategoria
                FROM ${this.#table} P
                INNER JOIN SIGM_CATEGORIA_PRODUCTO C ON P.ID_CATEGORIA_PRODUCTO = C.ID_CATEGORIA_PRODUCTO
                INNER JOIN SIGM_UNIDAD_MEDICION U ON P.ID_UNIDAD_MEDICION = U.ID_UNIDAD_MEDICION
                WHERE P.ID_PRODUCTO = ?
            `;

            const [rows] = await connection.query(query, [idProducto]);

            if (rows.length > 0) {
                const productoDB = rows[0];
                const producto = new Producto();
                producto.setIdProducto(productoDB.idProducto);
                producto.setNombre(productoDB.nombreProducto);
                producto.setDescripcion(productoDB.descripcionProducto);
                producto.setCantidad(productoDB.cantidad);
                producto.setEstado(productoDB.estadoProducto);

                // Setters para la categoría del producto
                producto.getCategoria().setIdCategoria(productoDB.idCategoria);
                producto.getUnidadMedicion().setIdUnidadMedicion(productoDB.idUnidadMedicion);

                return producto;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
        finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async actualizarProducto(producto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Obtén los atributos del objeto Producto
            const idProducto = producto.getIdProducto();
            const nombre = producto.getNombre();
            const descripcion = producto.getDescripcion();
            const cantidad = producto.getCantidad();
            const idUnidadMedicion = producto.getUnidadMedicion().getIdUnidadMedicion();
            const idCategoria = producto.getCategoria().getIdCategoria();
            const estado = producto.getEstado();

            // Construir la consulta SQL para actualizar el producto
            let query = `
                UPDATE ${this.#table}
                    SET DSC_NOMBRE = ?,
                    DSC_PRODUCTO = ?, 
                    NUM_CANTIDAD = ?, 
                    ID_UNIDAD_MEDICION = ?, 
                    ID_CATEGORIA_PRODUCTO = ?,
                    ESTADO = ?
                WHERE ID_PRODUCTO = ?`;

            let params = [nombre, descripcion, cantidad, idUnidadMedicion, idCategoria, idProducto, estado];

            // Ejecutar la consulta
            const [result] = await connection.query(query, params);

            // Verificar si se realizaron cambios
            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Producto actualizado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el producto o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el producto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }

    async generarReportes(filtroEstado, filtroCategoria, formato) {
        let connection;
        try {
            // Obtener la conexión
            connection = await this.#db.conectar();

            // Construir la consulta SQL con INNER JOIN, excluyendo ID_PRODUCTO
            let query = `
                SELECT 
                    C.DSC_NOMBRE AS nombreCategoria,
                    P.DSC_NOMBRE,
                    P.DSC_PRODUCTO,
                    P.NUM_CANTIDAD,
                    P.ID_UNIDAD_MEDICION,
                    um.DSC_NOMBRE AS nombreUnidadMedicion,
                    P.ESTADO
                FROM sigm_producto P
                INNER JOIN 
                    sigm_categoria_producto C ON P.ID_CATEGORIA_PRODUCTO = C.ID_CATEGORIA_PRODUCTO
                INNER JOIN
                    sigm_unidad_medicion um ON P.ID_UNIDAD_MEDICION = um.ID_UNIDAD_MEDICION
                WHERE 1=1
            `;
            const params = [];

            if (filtroEstado !== null) {
                query += ' AND P.ESTADO = ?';
                params.push(filtroEstado);
            }
            if (filtroCategoria !== null) {
                query += ' AND P.ID_CATEGORIA_PRODUCTO = ?';
                params.push(filtroCategoria);
            }

            // Ejecutar la consulta
            const [rows] = await connection.query(query, params);

            if (!rows || rows.length === 0) {
                console.log('No se encontraron productos con los filtros especificados.');
                return;
            }

            // Obtener la fecha actual en formato DD-MM-YYYY
            const today = new Date();
            const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

            // Obtener la ruta del escritorio
            const desktopDir = path.join(os.homedir(), 'Desktop');

            if (formato === 1) {
                const pdfDoc = new PDFDocument({ font: 'Helvetica', margin: 10 });

                // Guardar el PDF en el escritorio
                const pdfPath = path.join(desktopDir, `reporte_productos_${formattedDate}.pdf`);
                pdfDoc.pipe(fs.createWriteStream(pdfPath));

                // Escribir título
                pdfDoc.fontSize(20).text('Reporte de Productos', { align: 'center' });
                pdfDoc.moveDown(1.5);

                // Configuración de la tabla
                const startX = 10;
                const columnWidths = [80, 120, 200, 70, 60, 60];
                const headers = ['Categoría', 'Nombre', 'Descripción', 'Cantidad', 'Unidad', 'Estado'];
                const baseRowHeight = 30;
                const pageHeight = pdfDoc.page.height - pdfDoc.page.margins.bottom;
                const tableWidth = columnWidths.reduce((a, b) => a + b, 0);

                // Función para estimar la altura de una celda (sin dryRun)
                const getCellHeight = (text, width) => {
                    if (typeof width !== 'number' || isNaN(width) || width <= 0) {
                        console.error('Ancho inválido:', width);
                        return baseRowHeight;
                    }

                    const safeText = typeof text === 'string' ? text : String(text || '');
                    const charsPerLine = Math.floor(width / 5);
                    const lines = Math.ceil(safeText.length / charsPerLine) || 1;
                    return Math.max(baseRowHeight, lines * 10 + 10);
                };

                // Función para dibujar encabezados
                const drawHeaders = (startX, startY) => {
                    pdfDoc.fontSize(10).font('Helvetica-Bold');
                    pdfDoc
                        .rect(startX, startY - 5, tableWidth, baseRowHeight)
                        .fillOpacity(0.1)
                        .fill('#D3D3D3')
                        .stroke();

                    let x = startX;
                    headers.forEach((header, i) => {
                        pdfDoc
                            .fillOpacity(1)
                            .fillColor('black')
                            .text(header, x + 2, startY + (baseRowHeight - 10) / 2, { width: columnWidths[i] - 4, align: 'left' });
                        x += columnWidths[i];
                    });

                    x = startX;
                    for (let i = 0; i <= headers.length; i++) {
                        pdfDoc
                            .moveTo(x, startY - 5)
                            .lineTo(x, startY + baseRowHeight - 5)
                            .stroke();
                        x += columnWidths[i] || 0;
                    }
                };

                // Función para dibujar una fila
                const drawRow = (row, startX, startY) => {
                    const rowData = [
                        row.nombreCategoria || 'Sin categoría',
                        row.DSC_NOMBRE || 'Sin nombre',
                        row.DSC_PRODUCTO || 'Sin descripción',
                        row.NUM_CANTIDAD !== null && row.NUM_CANTIDAD !== undefined ? row.NUM_CANTIDAD.toString().replace(/[^0-9]/g, '') : '0',
                        row.nombreUnidadMedicion || 'N/A',
                        row.ESTADO ? 'Activo' : 'Inactivo'
                    ];

                    let rowHeight = baseRowHeight;
                    rowData.forEach((cell, i) => {
                        if (i >= columnWidths.length) {
                            return;
                        }
                        const cellHeight = getCellHeight(cell, columnWidths[i]);
                        rowHeight = Math.max(rowHeight, cellHeight);
                    });

                    let x = startX;
                    pdfDoc.fontSize(10).font('Helvetica');
                    rowData.forEach((cell, i) => {
                        if (i >= columnWidths.length) return;
                        pdfDoc.text(cell, x + 2, startY + (rowHeight - 10) / 2, { width: columnWidths[i] - 4, align: 'left', height: rowHeight - 10, ellipsis: false });
                        x += columnWidths[i];
                    });

                    x = startX;
                    for (let i = 0; i <= rowData.length; i++) {
                        pdfDoc
                            .moveTo(x, startY - 5)
                            .lineTo(x, startY + rowHeight - 5)
                            .stroke();
                        x += i < columnWidths.length ? columnWidths[i] : 0;
                    }
                    pdfDoc
                        .moveTo(startX, startY - 5)
                        .lineTo(startX + tableWidth, startY - 5)
                        .moveTo(startX, startY + rowHeight - 5)
                        .lineTo(startX + tableWidth, startY + rowHeight - 5)
                        .stroke();

                    return rowHeight;
                };

                // Dibujar tabla
                let y = pdfDoc.y;
                drawHeaders(startX, y);
                y += baseRowHeight;

                rows.forEach((row, rowIndex) => {
                    const rowHeight = drawRow(row, startX, y);

                    if (y + rowHeight > pageHeight) {
                        pdfDoc.addPage();
                        y = pdfDoc.page.margins.top;
                        drawHeaders(startX, y);
                        y += baseRowHeight;
                    }

                    const actualRowHeight = drawRow(row, startX, y);
                    y += actualRowHeight;
                });

                pdfDoc.end();
            } else if (formato === 2) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Productos');

                worksheet.columns = [
                    { header: 'Categoría', key: 'nombre_categoria', width: 15 },
                    { header: 'Nombre', key: 'nombre', width: 30 },
                    { header: 'Descripción', key: 'descripcion', width: 40 },
                    { header: 'Cantidad', key: 'cantidad', width: 15 },
                    { header: 'Unidad', key: 'unidad', width: 15 },
                    { header: 'Estado', key: 'estado', width: 10 }
                ];

                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).alignment = { horizontal: 'center' };

                worksheet.addRows(rows.map(row => ({
                    nombre_categoria: row.nombreCategoria || 'Sin categoría',
                    nombre: row.DSC_NOMBRE || 'Sin nombre',
                    descripcion: row.DSC_PRODUCTO || 'Sin descripción',
                    cantidad: row.NUM_CANTIDAD !== null && row.NUM_CANTIDAD !== undefined ? row.NUM_CANTIDAD : 0,
                    unidad: row.nombreUnidadMedicion || 'N/A',
                    estado: row.ESTADO ? 'Activo' : 'Inactivo'
                })));

                // Guardar el Excel en el escritorio
                const excelPath = path.join(desktopDir, `reporte_productos_${formattedDate}.xlsx`);
                await workbook.xlsx.writeFile(excelPath);
            } else {
                console.log('Formato no válido. Usa 1 para PDF o 2 para Excel.');
            }
        } catch (error) {
            console.error('Error al generar el reporte:', error.message);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}
module.exports = ProductoDB;