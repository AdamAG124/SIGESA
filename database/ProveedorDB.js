const ConectarDB = require('./ConectarDB');
const Proveedor = require('../domain/Proveedor'); // Importamos la clase Categoria

class ProveedorDB {
    #table;

    constructor() {
        this.#table = 'SIGM_PROVEEDOR';
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor, valorBusqueda) {
        const db = new ConectarDB();
        let connection;
        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Consultar todos los proveedores
            let query = `
                SELECT
                    P.ID_PROVEEDOR AS idProveedor,
                    P.DSC_NOMBRE AS nombre,
                    P.DSC_PROVINCIA AS provincia,
                    P.DSC_CANTON AS canton,
                    P.DSC_DISTRITO AS distrito,  
                    P.DSC_DIRECCION AS direccion, 
                    P.ESTADO AS estado
                FROM
                    ${this.#table} P
            `;

            let whereClauseAdded = false;

            if (estadoProveedor !== null) {
                query += ` WHERE P.ESTADO = ${estadoProveedor}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = ` P.DSC_NOMBRE LIKE '${valorBusqueda}%' `;
                query += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }

            const [rows] = await connection.query(query);

            const proveedores = rows.map(proveedorDB => {
                const proveedor = new Proveedor();
                proveedor.setIdProveedor(proveedorDB.idProveedor);
                proveedor.setNombre(proveedorDB.nombre);
                proveedor.setProvincia(proveedorDB.provincia);
                proveedor.setCanton(proveedorDB.canton);
                proveedor.setDistrito(proveedorDB.distrito);
                proveedor.setDireccion(proveedorDB.direccion);
                proveedor.setEstado(proveedorDB.estado);
                return proveedor;
            });

            // Consulta para contar total de proveedores
            let countQuery = `SELECT COUNT(*) AS total FROM ${this.#table} P`;
            if (estadoProveedor !== null) {
                countQuery += ` WHERE P.ESTADO = ${estadoProveedor}`;
                whereClauseAdded = true;
            }

            if (valorBusqueda !== null) {
                const likeCondition = ` P.DSC_NOMBRE LIKE '${valorBusqueda}%' `;
                countQuery += whereClauseAdded ? ` AND ${likeCondition}` : ` WHERE ${likeCondition}`;
            }

            const [countResult] = await connection.query(countQuery);

            // Verificar que countResult tenga resultados
            const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los proveedores y los datos de paginación
            return {
                proveedores,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords,
                    totalPages,
                    totalRecords,
                    firstPage: 1,
                    estado: estadoProveedor,
                    valorBusqueda,
                    lastPage: totalPages
                }
            };

        } catch (error) {
            console.error('Error al listar proveedores:', error);
            return {
                success: false,
                message: 'Error al listar proveedores: ' + error.message
            };
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

}

// Exportar la clase
module.exports = ProveedorDB;