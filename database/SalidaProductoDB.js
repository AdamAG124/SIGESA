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
    async crearSalidaProductoBD(nuevosSalidaProducto, salidaData) {
        let connection;
        try {
            connection = await this.db.conectar();
    
            // 1. Insertar nueva salida en sigt_salida
            const insertSalidaQuery = `
                INSERT INTO sigt_salida (
                    ID_COLABORADOR_SACANDO, 
                    ID_COLABORADOR_RECIBIENDO, 
                    FEC_SALIDA, 
                    DSC_DETALLE_SALIDA
                ) VALUES (
                    ${salidaData.idColaboradorEntregando},
                    ${salidaData.idColaboradorRecibiendo},
                    '${salidaData.fechaSalida}',
                    '${salidaData.notas || ''}'
                )
            `;
            const [insertSalidaResult] = await connection.query(insertSalidaQuery);
            const idSalida = insertSalidaResult.insertId;
    
            // 2. Insertar nuevos SalidaProducto
            for (const nuevo of nuevosSalidaProducto) {
                const selectProductoQuery = `
                    SELECT NUM_CANTIDAD 
                    FROM sigm_producto 
                    WHERE ID_PRODUCTO = ${nuevo.idProducto}
                `;
                const [productoResult] = await connection.query(selectProductoQuery);
                if (productoResult.length === 0) {
                    throw new Error(`No se encontró el producto con ID ${nuevo.idProducto}`);
                }
                const cantidadActual = productoResult[0].NUM_CANTIDAD || 0;
                const nuevaCantidad = cantidadActual - nuevo.cantidadSaliendo;
                if (nuevaCantidad < 0) {
                    throw new Error(`No hay suficiente stock para el producto con ID ${nuevo.idProducto}`);
                }
    
                // Actualizar stock del producto
                const updateProductoQuery = `
                    UPDATE sigm_producto
                    SET NUM_CANTIDAD = ${nuevaCantidad}
                    WHERE ID_PRODUCTO = ${nuevo.idProducto}
                `;
                await connection.query(updateProductoQuery);
    
                // Insertar SalidaProducto
                const insertQuery = `
                    INSERT INTO sigt_salida_producto (
                        ID_PRODUCTO, 
                        ID_SALIDA, 
                        NUM_CANTIDAD_ANTERIOR, 
                        NUM_CANTIDAD_SALIENDO, 
                        NUM_CANTIDAD_NUEVA
                    ) VALUES (
                        ${nuevo.idProducto},
                        ${idSalida},
                        ${nuevo.cantidadAnterior},
                        ${nuevo.cantidadSaliendo},
                        ${nuevaCantidad}
                    )
                `;
                await connection.query(insertQuery);
            }
    
            return {
                success: true,
                message: 'Salida y productos creados correctamente'
            };
        } catch (error) {
            console.error('Error en crearSalidaProductoBD:', error.message);
            return {
                success: false,
                message: 'Error al procesar la salida y productos: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = SalidaProductoDB;