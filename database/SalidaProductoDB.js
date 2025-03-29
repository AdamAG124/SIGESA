const ConectarDB = require('./ConectarDB');

class SalidaProductoDB {
    #db;

    constructor() {
        this.#db = new ConectarDB();
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
                    sigt_salida_producto sp
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
                salidaProducto.setDetallesSalida(row.detalleSalida);
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
                salidaProducto.getIdSalida().setIdUsuario(row.idUsuarioSalida);
                salidaProducto.getIdSalida().getIdUsuario().setNombreUsuario(row.nombreUsuario);
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
}

module.exports = SalidaProductoDB;