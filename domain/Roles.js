// roles.js
class Roles {
    // Atributos privados
    #id_role;
    #role_name;
    #role_description;

    // Constructor sin parámetros
    constructor() {
        this.#id_role = null;
        this.#role_name = '';
        this.#role_description = '';
    }

    // Getters
    getIdRole() {
        return this.#id_role;
    }

    getRoleName() {
        return this.#role_name;
    }

    getRoleDescription() {
        return this.#role_description;
    }

    // Setters
    setIdRole(value) {
        this.#id_role = value;
    }

    setRoleName(value) {
        this.#role_name = value;
    }

    setRoleDescription(value) {
        this.#role_description = value;
    }
}

module.exports = Roles;