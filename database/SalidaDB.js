const ConectarDB = require('./ConectarDB');

class SalidaDB {
    async listarSalidas(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();
            const offset = (currentPage - 1) * pageSize;

            let query = `
                SELECT 
                    s.ID_SALIDA AS idSalida,
                  s.ID_COLABORADOR_SACANDO AS idColaboradorSacando,
                    CONCAT(c1.DSC_NOMBRE, ' ', c1.DSC_PRIMER_APELLIDO) AS nombreColaboradorSacando, 
                    s.ID_COLABORADOR_RECIBIENDO AS idColaboradorRecibiendo,
                    CONCAT(c2.DSC_NOMBRE, ' ', c2.DSC_PRIMER_APELLIDO) AS nombreColaboradorRecibiendo, 
                    s.FEC_SALIDA AS fechaSalida,
                    s.ID_USUARIO AS idUsuario,
                    u.DSC_NOMBRE AS nombreUsuario,
                    s.ESTADO AS estado
                FROM 
                    sigt_salida s
                LEFT JOIN sigm_colaborador c1 ON s.ID_COLABORADOR_SACANDO = c1.ID_COLABORADOR
                LEFT JOIN sigm_colaborador c2 ON s.ID_COLABORADOR_RECIBIENDO = c2.ID_COLABORADOR
                LEFT JOIN sigm_usuario u ON s.ID_USUARIO = u.ID_USUARIO -- Unión con la tabla de usuarios
            `;

            let whereClauseAdded = false;

            if (estado !== null) {
                query += ` WHERE s.ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const searchCondition = `
                    (s.ID_SALIDA LIKE '%${valorBusqueda}%' OR 
                    CONCAT(c1.DSC_NOMBRE, ' ', c1.DSC_PRIMER_APELLIDO) LIKE '%${valorBusqueda}%' OR 
                     CONCAT(c2.DSC_NOMBRE, ' ', c2.DSC_PRIMER_APELLIDO) LIKE '%${valorBusqueda}%' OR
                        u.DSC_NOMBRE LIKE '%${valorBusqueda}%')
                `;
                query += whereClauseAdded ? ` AND ${searchCondition}` : ` WHERE ${searchCondition}`;
            }

            query += ` ORDER BY s.ID_SALIDA DESC LIMIT ${pageSize} OFFSET ${offset}`;

            const [rows] = await connection.query(query);

            const [countResult] = await connection.query(`
                SELECT COUNT(*) AS total
                FROM sigt_salida s
                LEFT JOIN sigm_colaborador c1 ON s.ID_COLABORADOR_SACANDO = c1.ID_COLABORADOR
                LEFT JOIN sigm_colaborador c2 ON s.ID_COLABORADOR_RECIBIENDO = c2.ID_COLABORADOR
                LEFT JOIN sigm_usuario u ON s.ID_USUARIO = u.ID_USUARIO
            `);

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