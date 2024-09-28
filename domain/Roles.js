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
    get idRole() {
        return this.#id_role;
    }

    get roleName() {
        return this.#role_name;
    }

    get roleDescription() {
        return this.#role_description;
    }

    // Setters
    set idRole(value) {
        this.#id_role = value;
    }

    set roleName(value) {
        this.#role_name = value;
    }

    set roleDescription(value) {
        this.#role_description = value;
    }
}

module.exports = Roles;