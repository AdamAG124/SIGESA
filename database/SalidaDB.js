const ConectarDB = require('./ConectarDB');

class SalidaDB {
    async listarSalidas(pageSize, currentPage, estado, valorBusqueda, filtroColaboradorSacando, filtroColaboradorRecibiendo, fechaInicio, fechaFin, filtroUsuario) {
        const db = new ConectarDB();
        let connection;
    
        try {
            connection = await db.conectar();
            const offset = (currentPage - 1) * pageSize;
    
            let query = `
                SELECT 
                    s.ID_SALIDA AS idSalida,
                    s.ID_COLABORADOR_SACANDO AS idColaboradorSacando,
                    CONCAT(c1.DSC_NOMBRE, ' ', c1.DSC_PRIMER_APELLIDO, ' ', c1.DSC_SEGUNDO_APELLIDO) AS nombreColaboradorSacando, 
                    s.ID_COLABORADOR_RECIBIENDO AS idColaboradorRecibiendo,
                    CONCAT(c2.DSC_NOMBRE, ' ', c2.DSC_PRIMER_APELLIDO, ' ', c2.DSC_SEGUNDO_APELLIDO) AS nombreColaboradorRecibiendo, 
                    s.FEC_SALIDA AS fechaSalida,
                    s.ID_USUARIO AS idUsuario,
                    u.DSC_NOMBRE AS nombreUsuario,
                    s.ESTADO AS estado
                FROM 
                    sigt_salida s
                LEFT JOIN sigm_colaborador c1 ON s.ID_COLABORADOR_SACANDO = c1.ID_COLABORADOR
                LEFT JOIN sigm_colaborador c2 ON s.ID_COLABORADOR_RECIBIENDO = c2.ID_COLABORADOR
                LEFT JOIN sigm_usuario u ON s.ID_USUARIO = u.ID_USUARIO
            `;
    
            let whereConditions = [];
            let queryParams = [];
    
            if (estado !== null) {
                whereConditions.push(`s.ESTADO = ?`);
                queryParams.push(estado);
            }
    
            if (valorBusqueda) {
                whereConditions.push(`
                    (s.ID_SALIDA LIKE ? OR 
                    CONCAT(c1.DSC_NOMBRE, ' ', c1.DSC_PRIMER_APELLIDO) LIKE ? OR 
                    CONCAT(c2.DSC_NOMBRE, ' ', c2.DSC_PRIMER_APELLIDO) LIKE ? OR
                    u.DSC_NOMBRE LIKE ?)
                `);
                queryParams.push(`%${valorBusqueda}%`, `%${valorBusqueda}%`, `%${valorBusqueda}%`, `%${valorBusqueda}%`);
            }
    
            if (filtroColaboradorSacando) {
                whereConditions.push(`CONCAT(c1.DSC_NOMBRE, ' ', c1.DSC_PRIMER_APELLIDO) LIKE ?`);
                queryParams.push(`%${filtroColaboradorSacando}%`);
            }
    
            if (filtroColaboradorRecibiendo) {
                whereConditions.push(`CONCAT(c2.DSC_NOMBRE, ' ', c2.DSC_PRIMER_APELLIDO) LIKE ?`);
                queryParams.push(`%${filtroColaboradorRecibiendo}%`);
            }
    
            if (filtroUsuario) {
                whereConditions.push(`u.DSC_NOMBRE LIKE ?`);
                queryParams.push(`%${filtroUsuario}%`);
            }
    
            // Nuevo filtro por rango de fechas
            if (fechaInicio && fechaFin) {
                whereConditions.push(`DATE(s.FEC_SALIDA) BETWEEN ? AND ?`);
                queryParams.push(fechaInicio, fechaFin);
            } else if (fechaInicio) {
                whereConditions.push(`DATE(s.FEC_SALIDA) >= ?`);
                queryParams.push(fechaInicio);
            } else if (fechaFin) {
                whereConditions.push(`DATE(s.FEC_SALIDA) <= ?`);
                queryParams.push(fechaFin);
            }
    
            if (whereConditions.length > 0) {
                query += ` WHERE ` + whereConditions.join(" AND ");
            }
    
            query += ` ORDER BY s.ID_SALIDA DESC LIMIT ? OFFSET ?`;
            queryParams.push(pageSize, offset);
    
            const [rows] = await connection.query(query, queryParams);
    
            // Conteo total con los mismos filtros aplicados
            let countQuery = `
                SELECT COUNT(*) AS total
                FROM sigt_salida s
                LEFT JOIN sigm_colaborador c1 ON s.ID_COLABORADOR_SACANDO = c1.ID_COLABORADOR
                LEFT JOIN sigm_colaborador c2 ON s.ID_COLABORADOR_RECIBIENDO = c2.ID_COLABORADOR
                LEFT JOIN sigm_usuario u ON s.ID_USUARIO = u.ID_USUARIO
            `;
    
            if (whereConditions.length > 0) {
                countQuery += ` WHERE ` + whereConditions.join(" AND ");
            }
    
            const [countResult] = await connection.query(countQuery, queryParams.slice(0, -2));
    
            return {
                salidas: rows,
                total: countResult[0].total,
                pageSize: pageSize,
                currentPage: currentPage,
                totalPages: Math.ceil(countResult[0].total / pageSize)
            };
        } catch (error) {
            console.error("Error al listar salidas:", error);
            throw new Error("Error al listar salidas: " + error.message);
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    

}

module.exports = SalidaDB;