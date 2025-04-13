const ConectarDB = require('./ConectarDB'); // Módulo de conexión a la base de datos
const Puesto = require('../domain/PuestoTrabajo'); // Modelo de dominio de PuestoTrabajo

class PuestoTrabajoDB {
    #db;
    #table;

    constructor() {
        this.#table = 'sigm_puesto_trabajo';
        this.#db = new ConectarDB();
    }

    // Método para listar los puestos de trabajo con paginación, filtros, y búsqueda
    async listarPuestos(pageSize, currentPage, estado, valorBusqueda) {
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta SQL principal
            let query = `
                SELECT 
                    ID_PUESTO_TRABAJO AS idPuestoTrabajo, 
                    DSC_NOMBRE AS nombrePuestoTrabajo,
                    DSC_PUESTO_TRABAJO AS descripcionPuestoTrabajo, 
                    ESTADO AS estado
                FROM 
                    ${this.#table}
            `;

            // Variable para verificar si ya se ha añadido una condición
            let whereClauseAdded = false;

            // Añadir condiciones según los filtros
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

            // Añadir la cláusula de LIMIT y OFFSET solo si se solicita paginación
            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Ejecutar la consulta SQL para obtener los puestos de trabajo
            const [rows] = await connection.query(query);

            // Crear un array para almacenar los puestos de trabajo
            const puestos = rows.map(puestoDB => {
                const puesto = new Puesto();

                puesto.setIdPuestoTrabajo(puestoDB.idPuestoTrabajo);
                puesto.setNombre(puestoDB.nombrePuestoTrabajo);
                puesto.setDescripcion(puestoDB.descripcionPuestoTrabajo);
                puesto.setEstado(puestoDB.estado);

                return puesto;
            });

            // Obtener el total de puestos de trabajo para la paginación
            let countQuery = `SELECT COUNT(*) as total FROM ${this.#table}`;

            // Añadir las mismas condiciones de los filtros al query de conteo
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

            // Ejecutar la consulta para contar el total de puestos de trabajo
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los puestos de trabajo y los datos de paginación
            return {
                puestos,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords, // Si no hay paginación, el tamaño de la página es el total
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado,
                    valorBusqueda,
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
                await connection.end(); // Cerrar la conexión
            }
        }
    }
}

module.exports = PuestoTrabajoDB;