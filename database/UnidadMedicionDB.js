const ConectarDB = require('./ConectarDB');
const UnidadMedicion = require('../domain/UnidadMedicion'); // Importamos la clase Categoria

class UnidadMedicionDB {
    #table;

    constructor() {
        this.#table = 'sigm_unidad_medicion';
    }

    async listarUnidadesMedicion() {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Construir la consulta SQL principal
            let query = `
                SELECT 
                    U.ID_UNIDAD_MEDICION AS idUnidadMedicion,
                    U.DSC_NOMBRE AS nombre,
                    U.ESTADO AS estado
                FROM 
                    ${this.#table} U
                WHERE
                    U.ESTADO = 1
                ORDER BY
                    U.ID_UNIDAD_MEDICION ASC
            `;

            // Ejecutar la consulta SQL para obtener las unidades de medición
            const [rows] = await connection.query(query);

            // Mapear los resultados a objetos de unidades de medición
            const unidadesMedicion = rows.map(unidadDB => {
                const unidadMedicion = new UnidadMedicion();
                unidadMedicion.setIdUnidadMedicion(unidadDB.idUnidadMedicion);
                unidadMedicion.setNombre(unidadDB.nombre);
                unidadMedicion.setEstado(unidadDB.estado);
                return unidadMedicion;
            });


            return unidadesMedicion;
        }
        catch (error) {
            console.error('Error al listar unidades de medición:', error.message);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async crearUnidadMedicion(unidadMedicion) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Verificar si el nombre ya existe
            const checkQuery = `
                SELECT COUNT(*) AS count
                FROM ${this.#table}
                WHERE DSC_NOMBRE = ?
            `;
            const [checkResult] = await connection.query(checkQuery, [unidadMedicion.getNombre()]);

            if (checkResult[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre de la unidad de medición ya existe',
                };
            }

            // Insertar la nueva unidad de medición
            const query = `
                INSERT INTO ${this.#table} (DSC_NOMBRE, ESTADO)
                VALUES (?, ?)
            `;
            const values = [
                unidadMedicion.getNombre(),
                unidadMedicion.getEstado()
            ];

            const [result] = await connection.query(query, values);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Unidad de medición creada exitosamente',
                };
            } else {
                return {
                    success: false,
                    message: 'Error al crear la unidad de medición',
                };
            }
        } catch (error) {
            console.error('Error al crear unidad de medición:', error.message);
            return {
                success: false,
                message: 'Error interno al crear la unidad de medición',
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }

    }

    async editarUnidadMedicion(unidadMedicion) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Verificar si el nombre ya existe
            const checkQuery = `
                SELECT COUNT(*) AS count
                FROM ${this.#table}
                WHERE DSC_NOMBRE = ? AND ID_UNIDAD_MEDICION != ?
            `;
            const [checkResult] = await connection.query(checkQuery, [unidadMedicion.getNombre(), unidadMedicion.getIdUnidadMedicion()]);

            if (checkResult[0].count > 0) {
                return {
                    success: false,
                    message: 'El nombre de la unidad de medición ya existe',
                };
            }

            // Actualizar la unidad de medición
            const query = `
                UPDATE ${this.#table}
                SET DSC_NOMBRE = ?
                WHERE ID_UNIDAD_MEDICION = ?
            `;
            const values = [
                unidadMedicion.getNombre(),
                unidadMedicion.getIdUnidadMedicion()
            ];

            const [result] = await connection.query(query, values);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Unidad de medición editada exitosamente',
                };
            } else {
                return {
                    success: false,
                    message: 'Error al editar la unidad de medición',
                };
            }
        } catch (error) {
            console.error('Error al editar unidad de medición:', error.message);
            return {
                success: false,
                message: 'Error interno al editar la unidad de medición',
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async eliminarUnidadMedicion(unidadMedicion) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            const idUnidad = unidadMedicion.getIdUnidadMedicion();
            const nuevoEstado = unidadMedicion.getEstado();
            const tbProducto = 'sigm_producto';

            // 1. Verificar si la unidad está asociada a productos
            const [asociaciones] = await connection.query(
                `SELECT COUNT(*) AS total FROM ${tbProducto} WHERE ID_UNIDAD_MEDICION = ?`,
                [idUnidad]
            );

            if (asociaciones[0].total > 0 && nuevoEstado === 0) {
                return {
                    success: false,
                    message: 'No se puede deshabilitar la unidad de medición porque está asociada a uno o más productos.',
                };
            }

            const query = `
            UPDATE ${this.#table}
            SET ESTADO = ?
            WHERE ID_UNIDAD_MEDICION = ?
          `;
            const values = [nuevoEstado, idUnidad];

            const [result] = await connection.query(query, values);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Unidad de medición eliminada exitosamente.',
                };
            } else {
                return {
                    success: false,
                    message: 'No se encontró la unidad de medición o no se realizaron cambios.',
                };
            }
        } catch (error) {
            console.error('Error al eliminar unidad de medición:', error.message);
            return {
                success: false,
                message: 'Error interno al eliminar la unidad de medición.',
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async rehabilitarUnidadMedicion(unidadMedicion) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Actualizar el estado de la unidad de medición a 1 (habilitada)
            const query = `
                UPDATE ${this.#table}
                SET ESTADO = ?
                WHERE ID_UNIDAD_MEDICION = ?
            `;
            const values = [unidadMedicion.getEstado(), unidadMedicion.getIdUnidadMedicion()];

            const [result] = await connection.query(query, values);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: 'Unidad de medición habilitada exitosamente',
                };
            } else {
                return {
                    success: false,
                    message: 'Error al habilitar la unidad de medición',
                };
            }
        } catch (error) {
            console.error('Error al habilitar unidad de medición:', error.message);
            return {
                success: false,
                message: 'Error interno al habilitar la unidad de medición',
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

}

module.exports = UnidadMedicionDB;