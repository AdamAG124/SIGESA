const ConectarDB = require('./ConectarDB');
const SalidaProducto = require('../domain/SalidaProducto');

class SalidaProductoDB {
    #db;
    #table;

    constructor() {
        this.#db = new ConectarDB();
        this.#table = 'sigt_salida_producto';
    }

    async obtenerProductosPorSalida(idSalida) {
        let connection;

        try {
            connection = await this.#db.conectar();

            const query = `
                SELECT 
                    sp.ID_SALIDA_PRODUCTO AS idSalidaProducto,
                    sp.ID_SALIDA AS idSalida,
                    sp.ID_PRODUCTO AS idProducto,
                    sp.NUM_CANTIDAD_ANTERIOR AS cantidadAnterior,
                    sp.NUM_CANTIDAD_SALIENDO AS cantidadSaliendo,
                    sp.NUM_CANTIDAD_NUEVA AS cantidadNueva,
                    sp.ESTADO AS estadoSalidaProducto,
                    
                    -- Información de la salida
                    s.ID_COLABORADOR_SACANDO AS idColaboradorSacando,
                    s.ID_COLABORADOR_RECIBIENDO AS idColaboradorRecibiendo,
                    s.FEC_SALIDA AS fechaSalida,
                    s.ID_USUARIO AS idUsuarioSalida,
                    s.DSC_DETALLE_SALIDA AS detalleSalida,
                    s.ESTADO AS estadoSalida,
                    
                    -- Información del producto
                    p.DSC_NOMBRE AS nombreProducto,
                    p.DSC_UNIDAD_MEDICION AS unidadMedicion,
                    p.NUM_CANTIDAD AS cantidadTotalProducto,
                    p.ESTADO AS estadoProducto,
                    
                    -- Información del usuario
                    u.DSC_NOMBRE AS nombreUsuario,
                    
                    -- Información del colaborador sacando
                    cs.DSC_NOMBRE AS nombreColaboradorSacando,
                    cs.DSC_PRIMER_APELLIDO AS primerApellidoSacando,
                    cs.DSC_SEGUNDO_APELLIDO AS segundoApellidoSacando,
                    cs.DSC_CORREO AS correoSacando,
                    cs.NUM_TELEFONO AS numTelefonoSacando,
                    
                    -- Información del colaborador recibiendo
                    cr.DSC_NOMBRE AS nombreColaboradorRecibiendo,
                    cr.DSC_PRIMER_APELLIDO AS primerApellidoRecibiendo,
                    cr.DSC_SEGUNDO_APELLIDO AS segundoApellidoRecibiendo,
                    cr.DSC_CORREO AS correoRecibiendo,
                    cr.NUM_TELEFONO AS numTelefonoRecibiendo,
                    
                    -- Información del departamento (sacando)
                    ds.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamentoSacando,
                    
                    -- Información del departamento (recibiendo)
                    dr.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamentoRecibiendo,
                    
                    -- Información del puesto de trabajo (sacando)
                    pts.DSC_NOMBRE AS nombrePuestoTrabajoSacando,
                    
                    -- Información del puesto de trabajo (recibiendo)
                    ptr.DSC_NOMBRE AS nombrePuestoTrabajoRecibiendo
                FROM 
                    ${this.#table} sp
                INNER JOIN 
                    sigt_salida s ON sp.ID_SALIDA = s.ID_SALIDA
                INNER JOIN 
                    sigm_producto p ON sp.ID_PRODUCTO = p.ID_PRODUCTO
                INNER JOIN 
                    sigm_usuario u ON s.ID_USUARIO = u.ID_USUARIO
                INNER JOIN 
                    sigm_colaborador cs ON s.ID_COLABORADOR_SACANDO = cs.ID_COLABORADOR
                INNER JOIN 
                    sigm_colaborador cr ON s.ID_COLABORADOR_RECIBIENDO = cr.ID_COLABORADOR
                INNER JOIN 
                    sigm_departamento ds ON cs.ID_DEPARTAMENTO = ds.ID_DEPARTAMENTO
                INNER JOIN 
                    sigm_departamento dr ON cr.ID_DEPARTAMENTO = dr.ID_DEPARTAMENTO
                INNER JOIN 
                    sigm_puesto_trabajo pts ON cs.ID_PUESTO = pts.ID_PUESTO_TRABAJO
                INNER JOIN 
                    sigm_puesto_trabajo ptr ON cr.ID_PUESTO = ptr.ID_PUESTO_TRABAJO
                WHERE 
                    sp.ID_SALIDA = ${idSalida}
            `;

            const [rows] = await connection.query(query);

            const salidasProductos = rows.map(row => {
                const salidaProducto = new SalidaProducto();

                // Llenar SalidaProducto
                salidaProducto.setIdSalidaProducto(row.idSalidaProducto);
                salidaProducto.setCantidadAnterior(row.cantidadAnterior);
                salidaProducto.setCantidadSaliendo(row.cantidadSaliendo);
                salidaProducto.setCantidadNueva(row.cantidadNueva);
                salidaProducto.setEstado(row.estadoSalidaProducto);

                // Llenar Salida (usando el objeto existente dentro de SalidaProducto)
                salidaProducto.getIdSalida().setIdSalida(row.idSalida);

                // Colaborador Sacando
                salidaProducto.getIdSalida().getColaboradorSacando().setIdColaborador(row.idColaboradorSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().setNombre(row.nombreColaboradorSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().setPrimerApellido(row.primerApellidoSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().setSegundoApellido(row.segundoApellidoSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().setCorreo(row.correoSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().setNumTelefono(row.numTelefonoSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().getIdDepartamento().setNombre(row.nombreDepartamentoSacando);
                salidaProducto.getIdSalida().getColaboradorSacando().getIdPuesto().setNombre(row.nombrePuestoTrabajoSacando);

                // Colaborador Recibiendo
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setIdColaborador(row.idColaboradorRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setNombre(row.nombreColaboradorRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setPrimerApellido(row.primerApellidoRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setSegundoApellido(row.segundoApellidoRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setCorreo(row.correoRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().setNumTelefono(row.numTelefonoRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().getIdDepartamento().setNombre(row.nombreDepartamentoRecibiendo);
                salidaProducto.getIdSalida().getColaboradorRecibiendo().getIdPuesto().setNombre(row.nombrePuestoTrabajoRecibiendo);

                salidaProducto.getIdSalida().setFechaSalida(row.fechaSalida);
                salidaProducto.getIdSalida().getIdUsuario().setIdUsuario(row.idUsuarioSalida);
                salidaProducto.getIdSalida().getIdUsuario().setNombreUsuario(row.nombreUsuario);
                salidaProducto.getIdSalida().setDetalleSalida(row.detalleSalida);
                salidaProducto.getIdSalida().setEstado(row.estadoSalida);

                // Llenar Producto (usando el objeto existente dentro de SalidaProducto)
                salidaProducto.getIdProducto().setIdProducto(row.idProducto);
                salidaProducto.getIdProducto().setNombre(row.nombreProducto);
                salidaProducto.getIdProducto().setUnidadMedicion(row.unidadMedicion);
                salidaProducto.getIdProducto().setCantidad(row.cantidadTotalProducto);
                salidaProducto.getIdProducto().setEstado(row.estadoProducto);

                return salidaProducto;
            });

            return salidasProductos;

        } catch (error) {
            console.error('Error al obtener los productos de la salida:', error.message);
            throw new Error('Error al obtener los productos de la salida: ' + error.message);
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }

    async editarSalidaProductoBD(salidaProductoActual, nuevosSalidaProducto, actualizarSalidaProducto, eliminarSalidaProducto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Actualizar la salida en sigt_salida
            const salida = salidaProductoActual.getIdSalida();
            const updateSalidaQuery = `
                UPDATE sigt_salida
                SET 
                    ID_COLABORADOR_SACANDO = ${salida.getColaboradorSacando().getIdColaborador()},
                    ID_COLABORADOR_RECIBIENDO = ${salida.getColaboradorRecibiendo().getIdColaborador()},
                    FEC_SALIDA = '${salida.getFechaSalida()}',
                    DSC_DETALLE_SALIDA = '${salida.getDetalleSalida()}'
                WHERE ID_SALIDA = ${salida.getIdSalida()}
            `;
            const [updateSalidaResult] = await connection.query(updateSalidaQuery);

            if (updateSalidaResult.affectedRows === 0 && salida.getIdSalida() !== 0) {
                throw new Error('No se actualizó ninguna salida. Verifique el ID_SALIDA.');
            }

            // Insertar nuevos SalidaProducto si el array no está vacío
            if (nuevosSalidaProducto.length > 0) {
                for (const nuevo of nuevosSalidaProducto) {
                    const selectProductoQuery = `
                        SELECT NUM_CANTIDAD 
                        FROM sigm_producto 
                        WHERE ID_PRODUCTO = ${nuevo.getIdProducto().getIdProducto()}
                    `;
                    const [productoResult] = await connection.query(selectProductoQuery);

                    if (productoResult.length === 0) {
                        throw new Error(`No se encontró el producto con ID ${nuevo.getIdProducto().getIdProducto()}`);
                    }

                    const cantidadActual = productoResult[0].NUM_CANTIDAD || 0;
                    const nuevaCantidad = cantidadActual - nuevo.getCantidadSaliendo();

                    if (nuevaCantidad < 0) {
                        throw new Error(`No hay suficiente stock para el producto con ID ${nuevo.getIdProducto().getIdProducto()}`);
                    }

                    const updateProductoQuery = `
                        UPDATE sigm_producto
                        SET NUM_CANTIDAD = ${nuevaCantidad}
                        WHERE ID_PRODUCTO = ${nuevo.getIdProducto().getIdProducto()}
                    `;
                    const [updateProductoResult] = await connection.query(updateProductoQuery);

                    if (updateProductoResult.affectedRows === 0) {
                        throw new Error(`No se actualizó la cantidad del producto con ID ${nuevo.getIdProducto().getIdProducto()}`);
                    }

                    const insertQuery = `
                        INSERT INTO ${this.#table} (
                            ID_PRODUCTO, 
                            ID_SALIDA, 
                            NUM_CANTIDAD_ANTERIOR, 
                            NUM_CANTIDAD_SALIENDO, 
                            NUM_CANTIDAD_NUEVA
                        ) VALUES (
                            ${nuevo.getIdProducto().getIdProducto()},
                            ${nuevo.getIdSalida().getIdSalida()},
                            ${nuevo.getCantidadAnterior()},
                            ${nuevo.getCantidadSaliendo()},
                            ${nuevaCantidad}
                        )
                    `;
                    await connection.query(insertQuery);
                }
            }

            // Actualizar SalidaProducto si el array no está vacío
            if (actualizarSalidaProducto.length > 0) {
                for (const actualizar of actualizarSalidaProducto) {
                    // Obtener el valor actual de NUM_CANTIDAD_SALIENDO desde sigt_salida_producto
                    const selectSalidaProductoQuery = `
                        SELECT NUM_CANTIDAD_SALIENDO
                        FROM ${this.#table}
                        WHERE ID_SALIDA_PRODUCTO = ${actualizar.getIdSalidaProducto()}
                    `;
                    const [salidaProductoResult] = await connection.query(selectSalidaProductoQuery);

                    if (salidaProductoResult.length === 0) {
                        console.warn(`No se encontró el SalidaProducto con ID ${actualizar.getIdSalidaProducto()}`);
                        continue;
                    }

                    const cantidadSaliendoAnterior = salidaProductoResult[0].NUM_CANTIDAD_SALIENDO || 0;
                    const cantidadSaliendoNueva = actualizar.getCantidadSaliendo();

                    // Definir nuevaCantidadProducto en el ámbito del bucle
                    let nuevaCantidadProducto;

                    if (cantidadSaliendoAnterior !== cantidadSaliendoNueva) {
                        const selectProductoQuery = `
                            SELECT NUM_CANTIDAD 
                            FROM sigm_producto 
                            WHERE ID_PRODUCTO = ${actualizar.getIdProducto().getIdProducto()}
                        `;
                        const [productoResult] = await connection.query(selectProductoQuery);

                        if (productoResult.length === 0) {
                            throw new Error(`No se encontró el producto con ID ${actualizar.getIdProducto().getIdProducto()}`);
                        }

                        const cantidadActualProducto = productoResult[0].NUM_CANTIDAD || 0;
                        const diferencia = cantidadSaliendoNueva - cantidadSaliendoAnterior;
                        nuevaCantidadProducto = cantidadActualProducto - diferencia;

                        if (nuevaCantidadProducto < 0) {
                            throw new Error(`No hay suficiente stock para el producto con ID ${actualizar.getIdProducto().getIdProducto()}`);
                        }

                        const updateProductoQuery = `
                            UPDATE sigm_producto
                            SET NUM_CANTIDAD = ${nuevaCantidadProducto}
                            WHERE ID_PRODUCTO = ${actualizar.getIdProducto().getIdProducto()}
                        `;
                        const [updateProductoResult] = await connection.query(updateProductoQuery);

                        if (updateProductoResult.affectedRows === 0) {
                            throw new Error(`No se actualizó la cantidad del producto con ID ${actualizar.getIdProducto().getIdProducto()}`);
                        }
                    } else {
                        // Si no cambió la cantidad saliente, calculamos nuevaCantidadProducto basándonos en los datos actuales
                        nuevaCantidadProducto = actualizar.getCantidadAnterior() - cantidadSaliendoNueva;
                    }

                    // Actualizar el SalidaProducto en sigt_salida_producto
                    const updateQuery = `
                        UPDATE ${this.#table}
                        SET 
                            ID_PRODUCTO = ${actualizar.getIdProducto().getIdProducto()},
                            NUM_CANTIDAD_ANTERIOR = ${actualizar.getCantidadAnterior()},
                            NUM_CANTIDAD_SALIENDO = ${actualizar.getCantidadSaliendo()},
                            NUM_CANTIDAD_NUEVA = ${nuevaCantidadProducto}
                        WHERE ID_SALIDA_PRODUCTO = ${actualizar.getIdSalidaProducto()}
                    `;
                    const [updateResult] = await connection.query(updateQuery);
                    if (updateResult.affectedRows === 0) {
                        console.warn(`No se actualizó el SalidaProducto con ID ${actualizar.getIdSalidaProducto()}`);
                    }
                }
            }

            // Eliminar SalidaProducto si el array no está vacío
            if (eliminarSalidaProducto.length > 0) {
                for (const eliminar of eliminarSalidaProducto) {
                    const selectSalidaProductoQuery = `
                        SELECT NUM_CANTIDAD_SALIENDO, ID_PRODUCTO
                        FROM ${this.#table}
                        WHERE ID_SALIDA_PRODUCTO = ${eliminar.getIdSalidaProducto()}
                    `;
                    const [salidaProductoResult] = await connection.query(selectSalidaProductoQuery);

                    if (salidaProductoResult.length > 0) {
                        const cantidadSaliendoEliminar = salidaProductoResult[0].NUM_CANTIDAD_SALIENDO || 0;
                        const idProducto = salidaProductoResult[0].ID_PRODUCTO;

                        const selectProductoQuery = `
                            SELECT NUM_CANTIDAD 
                            FROM sigm_producto 
                            WHERE ID_PRODUCTO = ${idProducto}
                        `;
                        const [productoResult] = await connection.query(selectProductoQuery);

                        if (productoResult.length === 0) {
                            throw new Error(`No se encontró el producto con ID ${idProducto}`);
                        }

                        const cantidadActualProducto = productoResult[0].NUM_CANTIDAD || 0;
                        const nuevaCantidadProducto = cantidadActualProducto + cantidadSaliendoEliminar;

                        const updateProductoQuery = `
                            UPDATE sigm_producto
                            SET NUM_CANTIDAD = ${nuevaCantidadProducto}
                            WHERE ID_PRODUCTO = ${idProducto}
                        `;
                        const [updateProductoResult] = await connection.query(updateProductoQuery);

                        if (updateProductoResult.affectedRows === 0) {
                            throw new Error(`No se actualizó la cantidad del producto con ID ${idProducto}`);
                        }
                    } else {
                        console.warn(`No se encontró el SalidaProducto con ID ${eliminar.getIdSalidaProducto()} para ajustar la cantidad`);
                    }

                    const deleteQuery = `
                        DELETE FROM ${this.#table}
                        WHERE ID_SALIDA_PRODUCTO = ${eliminar.getIdSalidaProducto()}
                    `;
                    const [deleteResult] = await connection.query(deleteQuery);
                    if (deleteResult.affectedRows === 0) {
                        console.warn(`No se eliminó el SalidaProducto con ID ${eliminar.getIdSalidaProducto()}`);
                    }
                }
            }

            return {
                success: true,
                message: 'Salida y productos actualizados correctamente'
            };

        } catch (error) {
            console.error('Error en editarSalidaProducto:', error.message);
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