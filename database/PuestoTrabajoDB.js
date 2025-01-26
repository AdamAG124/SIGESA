const ConectarDB = require('./ConectarDB');
const PuestoTrabajo = require('../domain/PuestoTrabajo');

class PuestoTrabajoDB {
    #table;

    constructor() {
        this.#table = 'sigm_puesto_trabajo';
    }

    async listarPuestos(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();
            const offset = (currentPage - 1) * pageSize;

            let query = `
                SELECT 
                    ID_PUESTO_TRABAJO AS idPuestoTrabajo, 
                    DSC_NOMBRE AS nombrePuestoTrabajo,
                    DSC_PUESTO_TRABAJO AS descripcionPuestoTrabajo, 
                    ESTADO AS estado
                FROM 
                    ${this.#table}
            `;

            let whereClauseAdded = false;

            if (estado !== null) {
                query += ` WHERE ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = `
                    (
                        DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                        DSC_PUESTO_TRABAJO LIKE '${valorBusqueda}%'
                    )
                `;
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const [rows] = await connection.query(query);

            const puestos = rows.map(puestoDB => {
                const puesto = new PuestoTrabajo();
                puesto.setIdPuestoTrabajo(puestoDB.idPuestoTrabajo);
                puesto.setNombre(puestoDB.nombrePuestoTrabajo);
                puesto.setDescripcion(puestoDB.descripcionPuestoTrabajo);
                puesto.setEstado(puestoDB.estado);

                return puesto;
            });

            let countQuery = `SELECT COUNT(*) as total FROM ${this.#table}`;
            whereClauseAdded = false;
            if (estado !== null) {
                countQuery += ` WHERE ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = `
                    DSC_NOMBRE LIKE '${valorBusqueda}%' OR
                    DSC_PUESTO_TRABAJO LIKE '${valorBusqueda}%'
                `;
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            return {
                puestos,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar puestos de trabajo:', error);
            return {
                success: false,
                message: 'Error al listar puestos de trabajo: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async insertarPuesto(puesto) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const nombre = puesto.getNombre();
            const descripcion = puesto.getDescripcion();
            const estado = puesto.getEstado();

            const existingQuery = `SELECT COUNT(*) AS count FROM ${this.#table} WHERE DSC_NOMBRE = ?`;
            const [existingRows] = await connection.query(existingQuery, [nombre]);

            if (existingRows[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre del puesto ya existe.'
                };
            }

            const query = `INSERT INTO ${this.#table} (DSC_NOMBRE, DSC_PUESTO_TRABAJO, ESTADO) VALUES (?, ?, ?)`;
            const params = [nombre, descripcion, estado];

            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Puesto creado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se pudo crear el puesto.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el puesto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async actualizarPuesto(puesto) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const idPuestoTrabajo = puesto.getIdPuestoTrabajo();
            const nombre = puesto.getNombre();
            const descripcion = puesto.getDescripcion();
            const estado = puesto.getEstado();

            const existingQuery = `SELECT COUNT(*) AS count FROM ${this.#table} WHERE DSC_NOMBRE = ? AND ID_PUESTO_TRABAJO <> ?`;
            const [existingRows] = await connection.query(existingQuery, [nombre, idPuestoTrabajo]);

            if (existingRows[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre del puesto ya existe.'
                };
            }

            const query = `
                UPDATE ${this.#table}
                SET 
                    DSC_NOMBRE = ?, 
                    DSC_PUESTO_TRABAJO = ?, 
                    ESTADO = ? 
                WHERE 
                    ID_PUESTO_TRABAJO = ?
            `;
            const params = [nombre, descripcion, estado, idPuestoTrabajo];

            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Puesto actualizado exitosamente.'
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró el puesto o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el puesto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async eliminarPuesto(puesto) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const idPuestoTrabajo = puesto.getIdPuestoTrabajo();
            const estado = puesto.getEstado();

            const query = `UPDATE ${this.#table} SET ESTADO = ? WHERE ID_PUESTO_TRABAJO = ?`;
            const params = [estado, idPuestoTrabajo];

            const [result] = await connection.query(query, params);

            if (result.affectedRows > 0) {
                if (estado === 0) {
                    return {
                        success: true,
                        message: 'Puesto eliminado exitosamente.'
                    };
                } else {
                    return {
                        success: true,
                        message: 'Puesto reactivado exitosamente.'
                    };
                }
            } else {
                return {
                    success: false,
                    message: 'No se encontró el puesto o no se realizaron cambios.'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el puesto: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = PuestoTrabajoDB;