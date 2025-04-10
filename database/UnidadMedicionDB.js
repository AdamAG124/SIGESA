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
                connection.release(); // Liberar la conexión
            }
        }
    }

}