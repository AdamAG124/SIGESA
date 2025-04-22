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
                    U.ID_UNIDAD_MEDICION DESC
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
}

module.exports = UnidadMedicionDB;