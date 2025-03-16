const ConectarDB = require('./ConectarDB');

class SalidaProductoDB {
    async listarSalidasProductos(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();
            const offset = (currentPage - 1) * pageSize;

            let query = `
                SELECT 
                    sp.ID_SALIDA_PRODUCTO AS idSalidaProducto,
                    sp.ID_PRODUCTO AS idProducto,
                    p.DSC_NOMBRE AS nombreProducto, 
                    sp.ID_SALIDA AS idSalida,
                    sp.NUM_CANTIDAD_ANTERIOR AS cantidadAnterior,
                    sp.NUM_CANTIDAD_SALIENDO AS cantidadSaliendo,
                    sp.NUM_CANTIDAD_NUEVA AS cantidadNueva,
                    sp.ESTADO AS estado,
                    s.ID_COLABORADOR_SACANDO AS idColaboradorSacando,
                    s.ID_COLABORADOR_RECIBIENDO AS idColaboradorRecibiendo,
                    s.FEC_SALIDA AS fechaSalida,
                    s.ID_USUARIO AS idUsuario
                FROM 
                    sigt_salida_producto sp
                INNER JOIN 
                    sigt_salida s ON sp.ID_SALIDA = s.ID_SALIDA
                INNER JOIN 
                    sigm_producto p ON sp.ID_PRODUCTO = p.ID_PRODUCTO
            `;

            query += ` ORDER BY sp.ID_SALIDA_PRODUCTO DESC LIMIT ${pageSize} OFFSET ${offset}`;

            const [rows] = await connection.query(query);
            const [countResult] = await connection.query(`SELECT COUNT(*) AS total FROM sigt_salida_producto`);

            return {
                salidasProductos: rows,
                total: countResult[0].total,
                pageSize: pageSize,
                currentPage: currentPage,
                totalPages: Math.ceil(countResult[0].total / pageSize)
            };
        } catch (error) {
            console.error('Error al listar salidas de productos:', error);
            throw new Error('Error al listar salidas de productos: ' + error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = SalidaProductoDB;