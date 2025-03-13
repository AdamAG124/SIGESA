const ConectarDB = require('./ConectarDB'); // Asumo que esta es tu clase de conexión
const FacturaProducto = require('../domain/FacturaProducto');

class FacturaProductoDB {
    #table;
    #db;

    constructor() {
        this.#table = 'SIGM_FACTURA_PRODUCTO';
        this.#db =  new ConectarDB();
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
                    c.DSC_CEDULA AS cedula
                FROM 
                    sigt_factura_producto fp
                INNER JOIN 
                    sigm_factura f ON fp.ID_FACTURA = f.ID_FACTURA
                INNER JOIN 
                    sigm_producto p ON fp.ID_PRODUCTO = p.ID_PRODUCTO
                INNER JOIN 
                    sigm_usuario u ON fp.ID_USUARIO = u.ID_USUARIO
                INNER JOIN 
                    sigm_colaborador c ON u.ID_COLABORADOR = c.ID_COLABORADOR
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
                facturaProducto.setPrecioNueva(row.precioNueva);
                facturaProducto.setEstado(row.estadoFacturaProducto);

                // Llenar Factura (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdFactura().setIdFactura(row.idFactura);
                facturaProducto.getIdFactura().setIdProveedor(row.idProveedor); // Solo ID, no objeto Proveedor
                facturaProducto.getIdFactura().setIdComprobante(row.idComprobantePago); // Solo ID, no objeto ComprobantePago
                facturaProducto.getIdFactura().setNumeroFactura(row.numeroFactura);
                facturaProducto.getIdFactura().setDetallesAdicionales(row.detallesAdicionales);
                facturaProducto.getIdFactura().setImpuesto(row.impuesto);
                facturaProducto.getIdFactura().setDescuento(row.descuento);
                facturaProducto.getIdFactura().setEstado(row.estadoFactura);

                // Llenar Producto (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdProducto().setIdProducto(row.idProducto);
                facturaProducto.getIdProducto().setCategoria(row.idCategoriaProducto); // Solo ID, no objeto CategoriaProducto
                facturaProducto.getIdProducto().setNombre(row.nombreProducto);
                facturaProducto.getIdProducto().setDescripcion(row.descripcionProducto);
                facturaProducto.getIdProducto().setCantidad(row.cantidadTotalProducto);
                facturaProducto.getIdProducto().setUnidadMedicion(row.unidadMedicion);
                facturaProducto.getIdProducto().setEstado(row.estadoProducto);

                // Llenar Usuario (usando el objeto existente dentro de FacturaProducto)
                facturaProducto.getIdUsuario().setIdUsuario(row.idUsuario);
                facturaProducto.getIdUsuario().setNombreUsuario(row.nombreUsuario);
                facturaProducto.getIdUsuario().setRol(row.idRol); // Solo ID, no objeto Rol
                facturaProducto.getIdUsuario().setPassword(row.password);
                facturaProducto.getIdUsuario().setEstado(row.estadoUsuario);

                // Llenar Colaborador (usando el objeto existente dentro de Usuario)
                facturaProducto.getIdUsuario().getIdColaborador().setIdColaborador(row.idColaborador);
                facturaProducto.getIdUsuario().getIdColaborador().setIdDepartamento(row.idDepartamento); // Solo ID, no objeto Departamento
                facturaProducto.getIdUsuario().getIdColaborador().setIdPuesto(row.idPuesto); // Solo ID, no objeto PuestoTrabajo
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
}

module.exports = FacturaProductoDB;