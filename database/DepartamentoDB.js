const ConectarDB = require('./ConectarDB'); // Asumiendo que tienes un módulo de conexión a la base de datos
const Departamento = require('../domain/Departamento'); // Asumiendo

class DepartamentoDB {
    #table;

    constructor() {
        this.#table = 'SIGM_DEPARTAMENTO';
    }

    async listarDepartamentos(pageSize, currentPage, estado, valorBusqueda) {
        const db = new ConectarDB();
        let connection;

        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Construir la consulta SQL principal
            let query = `
                SELECT 
                    ID_DEPARTAMENTO AS idDepartamento, 
                    DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamento,
                    DSC_DEPARTAMENTO AS descripcionDepartamento, 
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
                        DSC_NOMBRE_DEPARTAMENTO LIKE '${valorBusqueda}%' OR
                        DSC_DEPARTAMENTO LIKE '${valorBusqueda}%'
                    )
                `;
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Añadir la cláusula de LIMIT y OFFSET solo si se solicita paginación
            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            // Ejecutar la consulta SQL para obtener los departamentos
            const [rows] = await connection.query(query);

            // Crear un array para almacenar los departamentos
            const departamentos = rows.map(departamentoDB => {
                const departamento = new Departamento();

                departamento.setIdDepartamento(departamentoDB.idDepartamento);
                departamento.setNombre(departamentoDB.nombreDepartamento);
                departamento.setDescripcion(departamentoDB.descripcionDepartamento);
                departamento.setEstado(departamentoDB.estado);
            });

            // Obtener el total de departamentos para la paginación
            let countQuery = `SELECT COUNT(*) as total FROM ${this.#table}`;

            // Añadir las mismas condiciones de los filtros al query de conteo
            whereClauseAdded = false;
            if (estado !== null) {
                countQuery += ` WHERE ESTADO = ${estado}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = `
                    DSC_NOMBRE_DEPARTAMENTO LIKE '${valorBusqueda}%' OR
                    DSC_DEPARTAMENTO LIKE '${valorBusqueda}%'
                `;
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            // Ejecutar la consulta para contar el total de departamentos
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los departamentos y los datos de paginación
            return {
                departamentos,
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
            console.error('Error al listar departamentos:', error);
            return {
                success: false,
                message: 'Error al listar departamentos: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }
}

module.exports = DepartamentoDB;
