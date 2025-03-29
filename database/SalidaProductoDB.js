const ConectarDB = require('./ConectarDB');

class SalidaProductoDB {
    async obtenerProductosPorSalida(idSalida) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();
            console.log("Conexión a la base de datos establecida."); // Depuración inicial

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

            console.log("Ejecutando consulta SQL:", query); // Mostrar la consulta SQL
            const [rows] = await connection.query(query, [idSalida]);
            console.log("Datos obtenidos de la base de datos:", rows); // Verificar los datos obtenidos
            return rows;
        } catch (error) {
            console.error("Error al obtener productos de la salida:", error); // Mostrar el error en la consola
            throw new Error("Error al obtener productos de la salida: " + error.message);
        } finally {
            if (connection) {
                await connection.end();
                console.log("Conexión a la base de datos cerrada."); // Confirmar cierre de conexión
            }
        }
    }
    async registrarSalidaProducto(salidaProducto) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const query = `
                INSERT INTO sigt_salida_producto (
                    ID_PRODUCTO,
                    ID_SALIDA,
                    NUM_CANTIDAD_ANTERIOR,
                    NUM_CANTIDAD_SALIENDO,
                    NUM_CANTIDAD_NUEVA,
                    ESTADO
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            const params = [
                salidaProducto.getIdProducto(),
                salidaProducto.getIdSalida(),
                salidaProducto.getCantidadAnterior(),
                salidaProducto.getCantidadSaliendo(),
                salidaProducto.getCantidadNueva(),
                salidaProducto.getEstado(),
            ];

            const [result] = await connection.query(query, params);
            return result;
        } catch (error) {
            console.error('Error al registrar la salida del producto:', error);
            throw new Error('Error al registrar la salida del producto.');
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = SalidaProductoDB;