class ModuleSelector {
  constructor({ containerId, moduleId, editable = true, deletable = true, creatable = true, handlers }) {
    this.container = document.getElementById(containerId);
    this.moduleId = moduleId;
    this.editable = editable;
    this.deletable = deletable;
    this.creatable = creatable;
    this.handlers = handlers;
    this.modules = [];
    this.selected = null; // ← Guardar el objeto seleccionado

    // Selectores del DOM
    this.moduleList = this.container.querySelector('#module-list');
    this.selectedModule = this.container.querySelector('#selected-module');
    this.addBtn = this.container.querySelector('#add-module-btn');
    this.popup = document.getElementById('module-popup');
    this.inputNew = document.getElementById('new-module-name');
    this.saveBtn = document.getElementById('save-module');
    this.cancelBtn = document.getElementById('cancel-module');

    this.init();
  }

  async init() {
    this.selectedModule.addEventListener('click', () => {
      this.container.classList.toggle('open');
    });

    if (this.creatable) {
      this.addBtn.style.display = 'inline-block';
      this.addBtn.addEventListener('click', (e) => { e.preventDefault(); this.showPopup() });
      this.saveBtn.addEventListener('click', (e) => { e.preventDefault(); this.saveNewModule() });
      this.cancelBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.closePopup() });
    } else {
      this.addBtn.style.display = 'none';
    }

    this.fetchModules();
  }

  fetchModules(callback) {
    this.handlers.list(this.moduleId, (items) => {
      if (items) {
        // Normalizar los objetos
        this.modules = items.map(item => this.normalizeItem(item));
        this.renderModules();
        if (typeof callback === "function") callback();
      } else {
        console.error("No se pudieron cargar los módulos.");
      }
    });
  }

  renderModules() {
    this.moduleList.innerHTML = '';

    this.modules.forEach((mod, i) => {
      const item = document.createElement('div');
      item.className = 'module-item';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = mod.nombre;
      input.readOnly = true;

      if (this.editable) {
        input.addEventListener('click', (e) => {
          e.stopPropagation();
          input.readOnly = false;
          input.focus();
          input.select();
        });

        input.addEventListener('keydown', async (e) => {
          if (e.key === 'Enter') {
            const newValue = input.value.trim();
            if (newValue && newValue !== mod.nombre) {
              await this.handlers.update(this.moduleId, mod.id, newValue);
              await this.fetchModules();
            }
          } else if (e.key === 'Escape') {
            input.value = mod.nombre;
            input.readOnly = true;
          }
        });
      }

      input.addEventListener('dblclick', () => {
        this.updateSelectedDisplay(mod);
        this.selected = mod;
        this.container.classList.remove('open');
      });

      item.appendChild(input);

      if (this.deletable) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = () => this.confirmDelete(mod.id);
        item.appendChild(deleteBtn);
      }

      this.moduleList.appendChild(item);
    });
  }

  confirmDelete(id) {
    const index = this.modules.findIndex(m => m.id === id);
    const mod = this.modules[index];

    const item = this.moduleList.children[index];
    item.className = 'module-item deleting-module';
    item.innerHTML = `
        <input type="text" readonly value="${mod.nombre}" />
        <div class="delete-buttons-container">
            <button class="confirm">Eliminar</button>
            <button class="cancel">Cancelar</button>
        </div>
      `;

    item.querySelector('.confirm').onclick = async () => {
      await this.handlers.delete(this.moduleId, id);
      await this.fetchModules();
      this.showUndoToast(mod, index);
    };

    item.querySelector('.cancel').onclick = () => this.renderModules();
  }

  showUndoToast(mod, index) {
    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.innerHTML = `Unidad eliminada: <strong>${mod.nombre}</strong> <button>Deshacer</button>`;
    toast.querySelector('button').onclick = async () => {
      await this.handlers.undoDelete?.(this.moduleId, mod, index);
      await this.fetchModules();
      toast.remove();
    };
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 10000);
  }

  showPopup() {
    this.inputNew.value = '';
    this.popup.style.display = 'flex';
    this.inputNew.focus();

    const errorMsg = document.getElementById('module-error');

    this._handleOutsideClick = (e) => {
      const popupContent = this.popup.querySelector('.popup-content');

      if (!popupContent.contains(e.target)) {
        this.closePopup();
      }
    };

    setTimeout(() => {
      document.addEventListener('click', this._handleOutsideClick);
    }, 0);
  }

  closePopup() {
    this.popup.style.display = 'none';
    const errorMsg = document.getElementById('module-error');
    if (errorMsg) errorMsg.style.display = 'none';

    document.removeEventListener('click', this._handleOutsideClick);
    document.removeEventListener('keydown', this._handleEscape);
  }

  async saveNewModule() {
    const newName = this.inputNew.value.trim();
    const errorMsg = document.getElementById('module-error');

    if (newName && !this.modules.some(m => m.nombre === newName)) {
      try {
        await this.handlers.create(this.moduleId, newName); // Crear la nueva unidad
        this.fetchModules(); // Cargar la lista actualizada
        this.showAlert('success', 'Operación exitosa', `"${newName}" ha sido creado.`);
        this.popup.style.display = 'none';
        errorMsg.style.display = 'none';
      } catch (error) {
        console.error("Error al guardar el nuevo módulo:", error);
        this.showAlert('error', 'Error', 'No se pudo crear el módulo. Intente nuevamente.');
      }
    } else {
      errorMsg.textContent = "Ingrese un nombre válido y único.";
      errorMsg.style.display = 'block';
      this.inputNew.focus();
    }
  }

  getSelectedId() {
    return this.selected?.id || null;
  }

  getSelectedNombre() {
    return this.selected?.nombre || null;
  }

  setSelectedById(id) {
    const mod = this.modules.find(m => m.id === id || m.idUnidadMedicion === id);
    if (mod) {
      this.selected = mod;
      this.updateSelectedDisplay(mod);
    } else {
      console.warn("Set selected by ID: no se encontró un módulo con id", id);
    }
  }

  reset() {
    this.selected = null;
    this.selectedModule.textContent = "Seleccionar unidad"; // ← o el texto por defecto que quieras
  }
  // Agregar el módulo para que se pueda normalizar
  normalizeItem(item) {
    switch (this.moduleId) {
      case 1: // Unidades de Medición
        return {
          id: item.idUnidadMedicion,
          nombre: item.nombre,
          estado: item.estado
        };

      // Agregá más casos según tus módulos
      default:
        console.warn("No se reconoce el tipo de módulo para normalización:", this.moduleId);
        return {
          id: item.id || null,
          nombre: item.nombre || '',
          estado: item.estado ?? 1
        };
    }
  }

  updateSelectedDisplay(mod) {
    this.selectedModule.innerHTML = `
      ${mod.nombre}
      <span class="dropdown-icon"></span>
    `;
  }

  showAlert(type, title, message) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `module-selector-alert module-selector-alert-${type}`;
    alertContainer.innerHTML = `
      <div class="module-selector-alert-header">${title}</div>
      <div class="module-selector-alert-body">${message}</div>
      <button class="module-selector-alert-close" onclick="this.parentElement.remove()">Cerrar</button>
    `;

    document.body.appendChild(alertContainer); // Agregar al body como fallback

    // Eliminar automáticamente la alerta después de 5 segundos
    setTimeout(() => {
      alertContainer.remove();
    }, 5000);
  }
}
