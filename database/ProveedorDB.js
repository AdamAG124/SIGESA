const ConectarDB = require('./ConectarDB');
const Proveedor = require('../domain/Proveedor'); // Importamos la clase Categoria

class ProveedorDB {
    #table;

    constructor() {
        this.#table = 'SIGM_PROVEEDOR';
    }

    async listarProveedores(pageSize, currentPage, estadoProveedor) {
        const db = new ConectarDB();
        let connection;
        try {
            connection = await db.conectar();

            // Calcular el OFFSET para la paginación
            const offset = (currentPage - 1) * pageSize;

            // Consultar todas las categorías
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

            if (pageSize && currentPage) {
                query += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }
            console.log(pageSize, currentPage, estadoProveedor, offset);

            const [rows] = await connection.query(query);

            const proveedores = rows.map(proveedorDB => {
                const proveedor = new Proveedor();
                // Setear la información en el objeto Proveedor
                proveedor.setIdProveedor(proveedorDB.idProveedor);
                proveedor.setNombre(proveedorDB.nombre);
                proveedor.setProvincia(proveedorDB.provincia);
                proveedor.setCanton(proveedorDB.canton);
                proveedor.setDistrito(proveedorDB.distrito);
                proveedor.setDireccion(proveedorDB.direccion);
                proveedor.setEstado(proveedorDB.estado);

                return proveedor;
            });

            let countQuery = `
                SELECT COUNT(*) as total
                FROM ${this.#table} P
            `;
            if (estadoProveedor !== null) {
                countQuery += ` WHERE P.ESTADO = ${estadoProveedor}`;
                whereClauseAdded = true;
            }

            if (pageSize && currentPage) {
                countQuery += ` LIMIT ${pageSize} OFFSET ${offset}`;
            }
            
            const [countResult] = await connection.query(countQuery);
            const totalRecords = countResult[0].total;
        
            // Calcular el número total de páginas
            const totalPages = pageSize ? Math.ceil(totalRecords / pageSize) : 1;

            // Retornar los proveedores y los datos de paginación
            return {
                proveedores,
                pagination: {
                    currentPage: currentPage || 1,
                    pageSize: pageSize || totalRecords, // Si no hay paginación, el tamaño de la página es el total
                    totalPages,
                    totalRecords,
                    firstPage: 1,
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
                await connection.end(); // Asegúrate de cerrar la conexión
            }
        }
    }
}

// Exportar la clase
module.exports = ProveedorDB;