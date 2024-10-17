const ConectarDB = require('./ConectarDB');
const Colaborador = require('../domain/Colaborador');

class ColaboradorDB {
    #table;

    constructor() {
        this.#table = 'SIGM_COLABORADOR';
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
                    C.ID_COLABORADOR AS idColaborador, C.ID_DEPARTAMENTO AS idDepartamento,
                    C.ID_PUESTO AS idPuesto, C.DSC_SEGUNDO_APELLIDO AS segundoApellido,
                    C.FEC_NACIMIENTO AS fechaNacimiento, C.NUM_TELEFONO AS  numTelefono,
                    C.FEC_INGRESO AS fechaIngreso, C.FEC_SALIDA AS fechaSalida, C.ESTADO AS estado,
                    C.DSC_CORREO AS correo, C.DSC_CEDULA AS cedula, C.DSC_NOMBRE AS nombreColaborador,
                    C.DSC_PRIMER_APELLIDO AS primerApellido,
                    D.DSC_NOMBRE_DEPARTAMENTO AS nombreDepartamento,
                    P.DSC_NOMBRE AS nombrePuesto
                FROM 
                    ${this.#table} C
                INNER JOIN 
                    SIGM_DEPARTAMENTO D ON C.ID_DEPARTAMENTO = D.ID_DEPARTAMENTO
                INNER JOIN 
                    SIGM_PUESTO_TRABAJO P ON C.ID_PUESTO = P.ID_PUESTO_TRABAJO
            `);

            // Mapear cada fila a un objeto de tipo Colaborador
            rows.forEach(row => {
                const colaborador = new Colaborador();

                // Setear valores del colaborador
                colaborador.setIdColaborador(row.idColaborador);
                colaborador.setNombre(row.nombreColaborador);
                colaborador.setPrimerApellido(row.primerApellido);
                colaborador.setSegundoApellido(row.segundoApellido);
                colaborador.setFechaNacimiento(row.fechaNacimiento);
                colaborador.setNumTelefono(row.numTelefono);
                colaborador.setFechaIngreso(row.fechaIngreso);
                colaborador.setFechaSalida(row.fechaSalida);
                colaborador.setEstado(row.estado);
                colaborador.setCorreo(row.correo);
                colaborador.setCedula(row.cedula);
                colaborador.getIdDepartamento().setNombre(row.nombreDepartamento);
                colaborador.getIdPuesto().setNombre(row.nombrePuesto);

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
