const ConectarDB = require('./ConectarDB'); // Asumo que esta es tu clase de conexión
const FacturaProducto = require('../domain/FacturaProducto');

class FacturaProductoDB {
    #table;
    #db;

    constructor() {
        this.#table = 'sigt_factura_producto';
        this.#db = new ConectarDB();
    }

    async obtenerProductosPorFactura(idFactura) {
        let connection;

        try {
            connection = await this.#db.conectar();

            const query = `
                SELECT 
                    fp.ID_FACTURA_PRODUCTO AS idFacturaProducto,
                    fp.ID_FACTURA AS idFactura,
                    fp.ID_PRODUCTO AS idProducto,
                    fp.NUM_CANTIDAD_ANTERIOR AS cantidadAnterior,
                    fp.NUM_CANTIDAD_ENTRANDO AS cantidadEntrando,
                    fp.MONTO_PRECIO_NUEVA AS precioNueva,
                    fp.ID_USUARIO AS idUsuario,
                    fp.ESTADO AS estadoFacturaProducto,
                    
                    -- Información de la factura
                    f.ID_PROVEEDOR AS idProveedor,
                    f.ID_COMPROBANTE_PAGO AS idComprobantePago,
                    f.NUM_FACTURA AS numeroFactura,
                    f.FEC_FACTURA AS fechaFactura,
                    f.DSC_DETALLE_FACTURA AS detallesAdicionales,
                    f.MONTO_IMPUESTO AS impuesto,
                    f.MONTO_DESCUENTO AS descuento,
                    f.ESTADO AS estadoFactura,
                    
                    -- Información del proveedor
                    prov.DSC_NOMBRE AS nombreProveedor,
                    prov.ID_PROVEEDOR AS idProveedor,
                    
                    -- Información del comprobante de pago
                    cp.ID_COMPROBANTE_PAGO AS idComprobantePago,
                    cp.NUM_COMPROBANTE_PAGO AS numeroComprobantePago,
                    
                    -- Información del producto
                    p.ID_CATEGORIA_PRODUCTO AS idCategoriaProducto,
                    p.DSC_NOMBRE AS nombreProducto,
                    p.DSC_PRODUCTO AS descripcionProducto,
                    p.NUM_CANTIDAD AS cantidadTotalProducto,
                    p.DSC_UNIDAD_MEDICION AS unidadMedicion,
                    p.ESTADO AS estadoProducto,
                    
                    -- Información del usuario
                    u.ID_COLABORADOR AS idColaborador,
                    u.DSC_NOMBRE AS nombreUsuario,
                    u.ID_ROL AS idRol,
                    u.DSC_PASSWORD AS password,
                    u.ESTADO AS estadoUsuario,
                    
                    -- Información del colaborador
                    c.DSC_NOMBRE AS nombreColaborador,
                    c.DSC_PRIMER_APELLIDO AS primerApellido,
                    c.DSC_SEGUNDO_APELLIDO AS segundoApellido,
                    c.ID_DEPARTAMENTO AS idDepartamento,
                    c.ID_PUESTO AS idPuesto,
                    c.FEC_NACIMIENTO AS fechaNacimiento,
                    c.NUM_TELEFONO AS numTelefono,
                    c.FEC_INGRESO AS fechaIngreso,
                    c.FEC_SALIDA AS fechaSalida,
                    c.ESTADO AS estadoColaborador,
                    c.DSC_CORREO AS correo,
                    c.DSC_CEDULA AS cedula,
                    
                    -- Información del departamento
                    d.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamento,
                    
                    -- Información del puesto de trabajo
                    pt.DSC_NOMBRE AS nombrePuestoTrabajo
                FROM 
                    ${this.#table} fp
                INNER JOIN 
                    sigm_factura f ON fp.ID_FACTURA = f.ID_FACTURA
                INNER JOIN 
                    sigm_proveedor prov ON f.ID_PROVEEDOR = prov.ID_PROVEEDOR
                INNER JOIN 
                    sigm_comprobante_pago cp ON f.ID_COMPROBANTE_PAGO = cp.ID_COMPROBANTE_PAGO
                INNER JOIN 
                    sigm_producto p ON fp.ID_PRODUCTO = p.ID_PRODUCTO
                INNER JOIN 
                    sigm_usuario u ON fp.ID_USUARIO = u.ID_USUARIO
                INNER JOIN 
                    sigm_colaborador c ON u.ID_COLABORADOR = c.ID_COLABORADOR
                INNER JOIN 
                    sigm_departamento d ON c.ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
                INNER JOIN 
                    sigm_puesto_trabajo pt ON c.ID_PUESTO = pt.ID_PUESTO_TRABAJO
                WHERE 
                    fp.ID_FACTURA = ${idFactura}
            `;

            const [rows] = await connection.query(query);

            const facturasProductos = rows.map(row => {
                const facturaProducto = new FacturaProducto();

                // Llenar FacturaProducto
                facturaProducto.setIdFacturaProducto(row.idFacturaProducto);
                facturaProducto.setCantidadAnterior(row.cantidadAnterior);
                facturaProducto.setCantidadEntrando(row.cantidadEntrando);
                facturaProducto.setPrecioNuevo(row.precioNueva);
                facturaProducto.setEstado(row.estadoFacturaProducto);

                // Llenar Factura (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdFactura().setIdFactura(row.idFactura);
                facturaProducto.getIdFactura().getIdProveedor().setIdProveedor(row.idProveedor);
                facturaProducto.getIdFactura().getIdProveedor().setNombre(row.nombreProveedor); // Nombre del proveedor
                facturaProducto.getIdFactura().getIdComprobante().setIdComprobantePago(row.idComprobantePago); // Solo ID
                facturaProducto.getIdFactura().getIdComprobante().setNumero(row.numeroComprobantePago); // Número del comprobante
                facturaProducto.getIdFactura().setNumeroFactura(row.numeroFactura);
                facturaProducto.getIdFactura().setFechaFactura(row.fechaFactura);
                facturaProducto.getIdFactura().setDetallesAdicionales(row.detallesAdicionales);
                facturaProducto.getIdFactura().setImpuesto(row.impuesto);
                facturaProducto.getIdFactura().setDescuento(row.descuento);
                facturaProducto.getIdFactura().setEstado(row.estadoFactura);

                // Llenar Producto (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdProducto().setIdProducto(row.idProducto);
                facturaProducto.getIdProducto().setCategoria(row.idCategoriaProducto); // Solo ID
                facturaProducto.getIdProducto().setNombre(row.nombreProducto);
                facturaProducto.getIdProducto().setDescripcion(row.descripcionProducto);
                facturaProducto.getIdProducto().setCantidad(row.cantidadTotalProducto);
                facturaProducto.getIdProducto().setUnidadMedicion(row.unidadMedicion);
                facturaProducto.getIdProducto().setEstado(row.estadoProducto);

                // Llenar Usuario (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdUsuario().setIdUsuario(row.idUsuario);
                facturaProducto.getIdUsuario().setNombreUsuario(row.nombreUsuario);
                facturaProducto.getIdUsuario().setRol(row.idRol); // Solo ID
                facturaProducto.getIdUsuario().setPassword(row.password);
                facturaProducto.getIdUsuario().setEstado(row.estadoUsuario);

                // Llenar Colaborador (usando el objeto existente dentro de Usuario)
                facturaProducto.getIdUsuario().getIdColaborador().setIdColaborador(row.idColaborador);
                facturaProducto.getIdUsuario().getIdColaborador().getIdDepartamento().setNombre(row.nombreDepartamento);
                facturaProducto.getIdUsuario().getIdColaborador().getIdPuesto().setNombre(row.nombrePuestoTrabajo);
                facturaProducto.getIdUsuario().getIdColaborador().setNombre(row.nombreColaborador);
                facturaProducto.getIdUsuario().getIdColaborador().setPrimerApellido(row.primerApellido);
                facturaProducto.getIdUsuario().getIdColaborador().setSegundoApellido(row.segundoApellido);
                facturaProducto.getIdUsuario().getIdColaborador().setFechaNacimiento(row.fechaNacimiento);
                facturaProducto.getIdUsuario().getIdColaborador().setNumTelefono(row.numTelefono);
                facturaProducto.getIdUsuario().getIdColaborador().setFechaIngreso(row.fechaIngreso);
                facturaProducto.getIdUsuario().getIdColaborador().setFechaSalida(row.fechaSalida);
                facturaProducto.getIdUsuario().getIdColaborador().setEstado(row.estadoColaborador);
                facturaProducto.getIdUsuario().getIdColaborador().setCorreo(row.correo);
                facturaProducto.getIdUsuario().getIdColaborador().setCedula(row.cedula);

                return facturaProducto;
            });

            return facturasProductos;

        } catch (error) {
            console.error('Error al obtener los productos de la factura:', error.message);
            throw new Error('Error al obtener los productos de la factura: ' + error.message);
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }

    async actualizarFacturaYProductos(facturaProductoActual, nuevosFacturaProducto, actualizarFacturaProducto, eliminarFacturaProducto) {
        let connection;

        try {
            connection = await this.#db.conectar();

            // Actualizar la factura en sigm_factura
            const factura = facturaProductoActual.getIdFactura();
            const updateFacturaQuery = `
            UPDATE sigm_factura
            SET 
                ID_PROVEEDOR = ${factura.getIdProveedor().getIdProveedor()},
                ID_COMPROBANTE_PAGO = ${factura.getIdComprobante().getIdComprobantePago()},
                NUM_FACTURA = '${factura.getNumeroFactura()}',
                FEC_FACTURA = '${factura.getFechaFactura()}',
                DSC_DETALLE_FACTURA = '${factura.getDetallesAdicionales()}',
                MONTO_IMPUESTO = ${factura.getImpuesto()},
                MONTO_DESCUENTO = ${factura.getDescuento()}
            WHERE ID_FACTURA = ${factura.getIdFactura()}
        `;
            const [updateFacturaResult] = await connection.query(updateFacturaQuery);

            if (updateFacturaResult.affectedRows === 0) {
                throw new Error('No se actualizó ninguna factura. Verifique el ID_FACTURA.');
            }

            // Insertar nuevos FacturaProducto si el array no está vacío
            if (nuevosFacturaProducto.length > 0) {
                for (const nuevo of nuevosFacturaProducto) {
                    // Obtener la cantidad actual del producto desde sigm_producto
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
                    const nuevaCantidad = cantidadActual + nuevo.getCantidadEntrando();

                    // Actualizar la cantidad en sigm_producto
                    const updateProductoQuery = `
                    UPDATE sigm_producto
                    SET NUM_CANTIDAD = ${nuevaCantidad}
                    WHERE ID_PRODUCTO = ${nuevo.getIdProducto().getIdProducto()}
                `;
                    const [updateProductoResult] = await connection.query(updateProductoQuery);

                    if (updateProductoResult.affectedRows === 0) {
                        console.log('Esta mamando');
                        throw new Error(`No se actualizó la cantidad del producto con ID ${nuevo.getIdProducto().getIdProducto()}`);
                    }

                    // Insertar el nuevo FacturaProducto en sigt_factura_producto
                    const insertQuery = `
                    INSERT INTO ${this.#table} (
                        ID_PRODUCTO, 
                        NUM_CANTIDAD_ANTERIOR, 
                        NUM_CANTIDAD_ENTRANDO, 
                        MONTO_PRECIO_NUEVA, 
                        ID_USUARIO,
                        ID_FACTURA
                    ) VALUES (
                        ${nuevo.getIdProducto().getIdProducto()},
                        ${nuevo.getCantidadAnterior()},
                        ${nuevo.getCantidadEntrando()},
                        ${nuevo.getPrecioNuevo()},
                        ${nuevo.getIdUsuario().getIdUsuario()},
                        ${nuevo.getIdFactura().getIdFactura()}
                    )
                `;
                    await connection.query(insertQuery);
                }
            }

            // Actualizar FacturaProducto si el array no está vacío
            if (actualizarFacturaProducto.length > 0) {
                for (const actualizar of actualizarFacturaProducto) {
                    // Obtener el valor actual de NUM_CANTIDAD_ENTRANDO desde sigt_factura_producto
                    const selectFacturaProductoQuery = `
                    SELECT NUM_CANTIDAD_ENTRANDO
                    FROM ${this.#table}
                    WHERE ID_FACTURA_PRODUCTO = ${actualizar.getIdFacturaProducto()}
                `;
                    const [facturaProductoResult] = await connection.query(selectFacturaProductoQuery);

                    if (facturaProductoResult.length === 0) {
                        console.warn(`No se encontró el FacturaProducto con ID ${actualizar.getIdFacturaProducto()}`);
                        continue; // Saltar esta iteración si no existe el registro
                    }

                    const cantidadEntrandoAnterior = facturaProductoResult[0].NUM_CANTIDAD_ENTRANDO || 0;
                    const cantidadEntrandoNueva = actualizar.getCantidadEntrando();

                    // Si la cantidad entrante cambió, actualizar NUM_CANTIDAD en sigm_producto
                    if (cantidadEntrandoAnterior !== cantidadEntrandoNueva) {
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
                        const nuevaCantidadProducto = cantidadActualProducto - cantidadEntrandoAnterior + cantidadEntrandoNueva;

                        const updateProductoQuery = `
                        UPDATE sigm_producto
                        SET NUM_CANTIDAD = ${nuevaCantidadProducto}
                        WHERE ID_PRODUCTO = ${actualizar.getIdProducto().getIdProducto()}
                    `;
                        const [updateProductoResult] = await connection.query(updateProductoQuery);

                        if (updateProductoResult.affectedRows === 0) {
                            throw new Error(`No se actualizó la cantidad del producto con ID ${actualizar.getIdProducto().getIdProducto()}`);
                        }
                    }

                    // Actualizar el FacturaProducto en sigt_factura_producto
                    const updateQuery = `
                    UPDATE ${this.#table}
                    SET 
                        ID_PRODUCTO = ${actualizar.getIdProducto().getIdProducto()},
                        NUM_CANTIDAD_ANTERIOR = ${actualizar.getCantidadAnterior()},
                        NUM_CANTIDAD_ENTRANDO = ${actualizar.getCantidadEntrando()},
                        MONTO_PRECIO_NUEVA = ${actualizar.getPrecioNuevo()}
                    WHERE ID_FACTURA_PRODUCTO = ${actualizar.getIdFacturaProducto()}
                `;
                    const [updateResult] = await connection.query(updateQuery);
                    if (updateResult.affectedRows === 0) {
                        console.warn(`No se actualizó el FacturaProducto con ID ${actualizar.getIdFacturaProducto()}`);
                    }
                }
            }

            // Eliminar FacturaProducto si el array no está vacío
            if (eliminarFacturaProducto.length > 0) {
                for (const eliminar of eliminarFacturaProducto) {
                    // Obtener el valor actual de NUM_CANTIDAD_ENTRANDO desde sigt_factura_producto
                    const selectFacturaProductoQuery = `
                    SELECT NUM_CANTIDAD_ENTRANDO, ID_PRODUCTO
                    FROM ${this.#table}
                    WHERE ID_FACTURA_PRODUCTO = ${eliminar.getIdFacturaProducto()}
                `;
                    const [facturaProductoResult] = await connection.query(selectFacturaProductoQuery);

                    if (facturaProductoResult.length > 0) {
                        const cantidadEntrandoEliminar = facturaProductoResult[0].NUM_CANTIDAD_ENTRANDO || 0;
                        const idProducto = facturaProductoResult[0].ID_PRODUCTO;

                        // Obtener la cantidad actual del producto desde sigm_producto
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
                        const nuevaCantidadProducto = cantidadActualProducto - cantidadEntrandoEliminar;

                        // Actualizar la cantidad en sigm_producto
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
                        console.warn(`No se encontró el FacturaProducto con ID ${eliminar.getIdFacturaProducto()} para ajustar la cantidad`);
                    }

                    // Eliminar el FacturaProducto de sigt_factura_producto
                    const deleteQuery = `
                    DELETE FROM ${this.#table}
                    WHERE ID_FACTURA_PRODUCTO = ${eliminar.getIdFacturaProducto()}
                `;
                    const [deleteResult] = await connection.query(deleteQuery);
                    if (deleteResult.affectedRows === 0) {
                        console.warn(`No se eliminó el FacturaProducto con ID ${eliminar.getIdFacturaProducto()}`);
                    }
                }
            }

            // Retornar éxito
            return {
                success: true,
                message: 'Factura y productos actualizados correctamente'
            };

        } catch (error) {
            console.error('Error en actualizarFacturaYProductos:', error.message);
            return {
                success: false,
                message: 'Error al procesar la factura y productos: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = FacturaProductoDB;