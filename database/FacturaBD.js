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
    
            const offset = (currentPage - 1) * pageSize;
    
            let query = `
                SELECT 
                    f.ID_FACTURA AS idFactura,
                    f.ID_PROVEEDOR AS idProveedor,
                    p.DSC_NOMBRE AS nombreProveedor,
                    f.ID_COMPROBANTE_PAGO AS idComprobantePago,
                    cp.NUM_COMPROBANTE_PAGO AS numeroComprobantePago,
                    f.NUM_FACTURA AS numeroFactura,
                    f.FEC_FACTURA AS fechaFactura,
                    f.DSC_DETALLE_FACTURA AS detallesAdicionales,
                    f.MONTO_IMPUESTO AS impuesto,
                    f.MONTO_DESCUENTO AS descuento,
                    f.ESTADO AS estadoFactura
                FROM 
                    sigm_factura f
                INNER JOIN 
                    sigm_proveedor p ON f.ID_PROVEEDOR = p.ID_PROVEEDOR
                LEFT JOIN 
                    sigm_comprobante_pago cp ON f.ID_COMPROBANTE_PAGO = cp.ID_COMPROBANTE_PAGO
            `;
    
            let whereClauseAdded = false;
    
            if (idComprobantePago !== null) {
                query += ` WHERE f.ID_COMPROBANTE_PAGO = ${idComprobantePago}`;
                whereClauseAdded = true;
            }
    
            if (idProveedor !== null) {
                query += whereClauseAdded ?
                    ` AND f.ID_PROVEEDOR = ${idProveedor}` :
                    ` WHERE f.ID_PROVEEDOR = ${idProveedor}`;
                whereClauseAdded = true;
            }
    
            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `f.FEC_FACTURA BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                query += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                query += whereClauseAdded ?
                    ` AND f.FEC_FACTURA >= '${fechaInicio}'` :
                    ` WHERE f.FEC_FACTURA >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                query += whereClauseAdded ?
                    ` AND f.FEC_FACTURA <= '${fechaFin}'` :
                    ` WHERE f.FEC_FACTURA <= '${fechaFin}'`;
                whereClauseAdded = true;
            }
    
            if (estadoFactura !== null) {
                query += whereClauseAdded ?
                    ` AND f.ESTADO = ${estadoFactura}` :
                    ` WHERE f.ESTADO = ${estadoFactura}`;
                whereClauseAdded = true;
            }
    
            if (searchValue !== null) {
                const searchCondition = `
                    (f.NUM_FACTURA LIKE '%${searchValue}%' OR 
                     f.DSC_DETALLE_FACTURA LIKE '%${searchValue}%' OR
                     p.DSC_NOMBRE LIKE '%${searchValue}%')
                `;
                query += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
            }
    
            query += ` LIMIT ${pageSize} OFFSET ${offset}`;
    
            const [rows] = await connection.query(query);
    
            const facturas = rows.map(facturaDB => {
                const factura = new Factura();
    
                factura.setIdFactura(facturaDB.idFactura);
                factura.setNumeroFactura(facturaDB.numeroFactura);
                factura.setFechaFactura(facturaDB.fechaFactura);
                factura.setDetallesAdicionales(facturaDB.detallesAdicionales);
                factura.setImpuesto(facturaDB.impuesto);
                factura.setDescuento(facturaDB.descuento);
                factura.setEstado(facturaDB.estadoFactura);
    
                factura.getIdProveedor().setIdProveedor(facturaDB.idProveedor);
                factura.getIdProveedor().setNombre(facturaDB.nombreProveedor);
    
                // Manejar el caso de ID_COMPROBANTE_PAGO NULL
                if (facturaDB.idComprobantePago === null) {
                    factura.getIdComprobante().setIdComprobantePago(null);
                    factura.getIdComprobante().setNumero(null);
                } else {
                    factura.getIdComprobante().setIdComprobantePago(facturaDB.idComprobantePago);
                    factura.getIdComprobante().setNumero(facturaDB.numeroComprobantePago);
                }
    
                return factura;
            });
    
            // Obtener el total de facturas para la paginación
            let countQuery = `
                SELECT COUNT(*) as total
                FROM sigm_factura f
                INNER JOIN sigm_proveedor p ON f.ID_PROVEEDOR = p.ID_PROVEEDOR
                LEFT JOIN sigm_comprobante_pago cp ON f.ID_COMPROBANTE_PAGO = cp.ID_COMPROBANTE_PAGO
            `;
    
            // Añadir las mismas condiciones al query de conteo
            whereClauseAdded = false;
            if (idComprobantePago !== null) {
                countQuery += ` WHERE f.ID_COMPROBANTE_PAGO = ${idComprobantePago}`;
                whereClauseAdded = true;
            }
            if (idProveedor !== null) {
                countQuery += whereClauseAdded ?
                    ` AND f.ID_PROVEEDOR = ${idProveedor}` :
                    ` WHERE f.ID_PROVEEDOR = ${idProveedor}`;
                whereClauseAdded = true;
            }
            if (fechaInicio !== null && fechaFin !== null) {
                const fechaCondition = `f.FEC_FACTURA BETWEEN '${fechaInicio}' AND '${fechaFin}'`;
                countQuery += whereClauseAdded ? ` AND ${fechaCondition}` : ` WHERE ${fechaCondition}`;
                whereClauseAdded = true;
            } else if (fechaInicio !== null) {
                countQuery += whereClauseAdded ?
                    ` AND f.FEC_FACTURA >= '${fechaInicio}'` :
                    ` WHERE f.FEC_FACTURA >= '${fechaInicio}'`;
                whereClauseAdded = true;
            } else if (fechaFin !== null) {
                countQuery += whereClauseAdded ?
                    ` AND f.FEC_FACTURA <= '${fechaFin}'` :
                    ` WHERE f.FEC_FACTURA <= '${fechaFin}'`;
                whereClauseAdded = true;
            }
            if (estadoFactura !== null) {
                countQuery += whereClauseAdded ?
                    ` AND f.ESTADO = ${estadoFactura}` :
                    ` WHERE f.ESTADO = ${estadoFactura}`;
                whereClauseAdded = true;
            }
            if (searchValue !== null) {
                const searchCondition = `
                    (f.NUM_FACTURA LIKE '%${searchValue}%' OR 
                     f.DSC_DETALLE_FACTURA LIKE '%${searchValue}%' OR
                     p.DSC_NOMBRE LIKE '%${searchValue}%')
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