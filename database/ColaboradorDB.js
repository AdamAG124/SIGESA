const ConectarDB = require('./ConectarDB');
const Colaborador = require('../domain/Colaborador');

class ColaboradorDB {
    #table;

    constructor() {
        this.#table = 'colaborador';
    }

    // Método para recuperar la lista de colaboradores con sus departamentos y puestos
    async listarColaboradores() {
        const db = new ConectarDB();
        const connection = await db.conectar();
        const colaboradores = [];

        try {
            // Query con INNER JOIN para obtener el nombre del departamento y el puesto de trabajo
            const [rows] = await connection.query(`
                SELECT 
                    c.*,
                    d.nombre AS departamentoNombre,
                    p.nombre AS puestoNombre
                FROM 
                    ${this.#table} c
                INNER JOIN 
                    departamento d ON c.idDepartamento = d.id_departamento
                INNER JOIN 
                    puestotrabajo p ON c.idPuesto = p.id_puestoTrabajo
            `);

            // Mapear cada fila a un objeto de tipo Colaborador
            rows.forEach(row => {
                const colaborador = new Colaborador();

                // Setear valores del colaborador
                colaborador.setIdColaborador(row.id_colaborador);
                colaborador.setNombre(row.nombre);
                colaborador.setPrimerApellido(row.primerApellido);
                colaborador.setSegundoApellido(row.segundoApellido);
                colaborador.setFechaNacimiento(row.fechaNacimiento);
                colaborador.setNumTelefono(row.numTelefono);
                colaborador.setFechaIngreso(row.fechaIngreso);
                colaborador.setFechaSalida(row.fechaSalida);
                colaborador.setEstado(row.estado);
                colaborador.setCorreo(row.correo);
                colaborador.setCedula(row.cedula);
                colaborador.getIdDepartamento().setNombre(row.departamentoNombre);
                colaborador.getIdPuesto().setNombre(row.puestoNombre);

                // Añadir el colaborador a la lista
                colaboradores.push(colaborador);
            });

            return colaboradores; // Retornar la lista de colaboradores
        } catch (error) {
            console.error('Error al listar colaboradores:', error);
            throw error; // Propagar el error
        } finally {
            if (connection) {
                await connection.end(); // Cerrar la conexión
            }
        }
    }
}

module.exports = ColaboradorDB;
