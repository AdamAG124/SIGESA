const ConectarDB = require('./ConectarDB');
const Factura = require('../domain/Factura');

class FacturaDB {
    #table;

    constructor() {
        this.#table = 'sigm_factura';
    }

    async obtenerFacturas(pageSize, currentPage, idComprobantePago, idProveedor, fechaInicio, fechaFin, estadoFactura, searchValue) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta SQL principal con paginación
            let query = `
                SELECT 
                    ID_FACTURA AS idFactura,
                    ID_PROVEEDOR AS idProveedor,
                    ID_COMPROBANTE_PAGO AS idComprobantePago,
                    NUM_FACTURA AS numeroFactura,
                    FEC_FACTURA AS fechaFactura,
                    DSC_DETALLE_FACTURA AS detallesAdicionales,
                    MONTO_IMPUESTO AS impuesto,
                    MONTO_DESCUENTO AS descuento,
                    ESTADO AS estadoFactura
                FROM 
                    sigm_factura
            `;

            // Variable para verificar si ya hemos agregado alguna condición
            let whereClauseAdded = false;

            // Filtro por ID de comprobante de pago
            if (idComprobantePago !== null) {
                query += ` WHERE ID_COMPROBANTE_PAGO = ${idComprobantePago}`;
                whereClauseAdded = true;
            }

            // Filtro por ID de proveedor
            if (idProveedor !== null) {
                query += whereClauseAdded ?
                    ` AND ID_PROVEEDOR = ${idProveedor}` :
                    ` WHERE ID_PROVEEDOR = ${idProveedor}`;
                whereClauseAdded = true;
            }

            // Filtro por rango de fechas
            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `FEC_FACTURA BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                query += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                query += whereClauseAdded ?
                    ` AND FEC_FACTURA >= '${fechaInicio}'` :
                    ` WHERE FEC_FACTURA >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                query += whereClauseAdded ?
                    ` AND FEC_FACTURA <= '${fechaFin}'` :
                    ` WHERE FEC_FACTURA <= '${fechaFin}'`;
                whereClauseAdded = true;
            }

            // Filtro por estado
            if (estadoFactura !== null) {
                query += whereClauseAdded ?
                    ` AND ESTADO = ${estadoFactura}` :
                    ` WHERE ESTADO = ${estadoFactura}`;
                whereClauseAdded = true;
            }

            // Filtro por searchValue (búsqueda en número de factura o detalles)
            if (searchValue !== null) {
                const searchCondition = `
                    (NUM_FACTURA LIKE '%${searchValue}%' OR 
                     DSC_DETALLE_FACTURA LIKE '%${searchValue}%')
                `;
                query += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
            }

            // Añadir la cláusula de LIMIT y OFFSET para la paginación
            query += ` LIMIT ${pageSize} OFFSET ${offset}`;

            // Ejecutar la consulta SQL para obtener las facturas
            const [rows] = await connection.query(query);

            // Crear un array para almacenar los objetos Factura
            const facturas = rows.map(facturaDB => {
                const factura = new Factura();

                // Setear la información en el objeto Factura
                factura.setIdFactura(facturaDB.idFactura);
                factura.getIdProveedor().setIdProveedor(facturaDB.idProveedor);
                factura.getIdComprobante().setIdComprobante(facturaDB.idComprobantePago);
                factura.setNumeroFactura(facturaDB.numeroFactura);
                factura.setFechaFactura(facturaDB.fechaFactura);
                factura.setDetallesAdicionales(facturaDB.detallesAdicionales);
                factura.setImpuesto(facturaDB.impuesto);
                factura.setDescuento(facturaDB.descuento);
                factura.setEstado(facturaDB.estadoFactura);

                return factura;
            });

            // Obtener el total de facturas para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM sigm_factura
            `;

            // Añadir las mismas condiciones al query de conteo
            whereClauseAdded = false;
            if (idComprobantePago !== null) {
                countQuery += ` WHERE ID_COMPROBANTE_PAGO = ${idComprobantePago}`;
                whereClauseAdded = true;
            }
            if (idProveedor !== null) {
                countQuery += whereClauseAdded ?
                    ` AND ID_PROVEEDOR = ${idProveedor}` :
                    ` WHERE ID_PROVEEDOR = ${idProveedor}`;
                whereClauseAdded = true;
            }
            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `FEC_FACTURA BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                countQuery += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                countQuery += whereClauseAdded ?
                    ` AND FEC_FACTURA >= '${fechaInicio}'` :
                    ` WHERE FEC_FACTURA >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                countQuery += whereClauseAdded ?
                    ` AND FEC_FACTURA <= '${fechaFin}'` :
                    ` WHERE FEC_FACTURA <= '${fechaFin}'`;
                whereClauseAdded = true;
            }
            if (estadoFactura !== null) {
                countQuery += whereClauseAdded ?
                    ` AND ESTADO = ${estadoFactura}` :
                    ` WHERE ESTADO = ${estadoFactura}`;
                whereClauseAdded = true;
            }
            if (searchValue !== null) {
                const searchCondition = `
                    (NUM_FACTURA LIKE '%${searchValue}%' OR 
                     DSC_DETALLE_FACTURA LIKE '%${searchValue}%')
                `;
                countQuery += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
            }

            // Ejecutar la consulta para contar el total de facturas
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalRecords / pageSize);

            // Retornar las facturas y los datos de paginación
            return {
                facturas,
                pagination: {
                    currentPage,
                    pageSize,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    lastPage: totalPages,
                    idComprobantePago,
                    idProveedor,
                    fechaInicio,
                    fechaFin,
                    estadoFactura,
                    searchValue
                }
            };

        } catch (error) {
            console.error('Error en la consulta a la base de datos:', error.message);
            return {
                success: false,
                message: 'Error al obtener las facturas: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Asegurarse de cerrar la conexión
            }
        }
    }
}

module.exports = FacturaDB;