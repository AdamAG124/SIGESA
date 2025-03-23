const ConectarDB = require('./ConectarDB');

class SalidaProductoDB {
    async obtenerSalidaProductos(idSalida) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const query = `
                SELECT 
                    sp.ID_SALIDA_PRODUCTO AS idSalidaProducto,
                    sp.ID_PRODUCTO AS idProducto,
                    p.DSC_NOMBRE AS nombreProducto,
                    sp.NUM_CANTIDAD_ANTERIOR AS cantidadAnterior,
                    sp.NUM_CANTIDAD_SALIENDO AS cantidadSaliendo,
                    sp.NUM_CANTIDAD_NUEVA AS cantidadNueva,
                    sp.ESTADO AS estado
                FROM 
                    sigt_salida_producto sp
                INNER JOIN 
                    sigm_producto p ON sp.ID_PRODUCTO = p.ID_PRODUCTO
                WHERE 
                    sp.ID_SALIDA = ?
            `;

            const [rows] = await connection.query(query, [idSalida]);

            return rows;
        } catch (error) {
            console.error('Error al obtener productos de la salida:', error);
            throw new Error('Error al obtener productos de la salida: ' + error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = SalidaProductoDB;  