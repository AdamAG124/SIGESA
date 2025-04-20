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
      this.cancelBtn.addEventListener('click', () => this.popup.style.display = 'none');
    } else {
      this.addBtn.style.display = 'none';
    }

    this.fetchModules();
  }

  fetchModules() {
    this.handlers.list(this.moduleId, (unidades) => {  // Callback en lugar de `await`
      if (unidades) {
        this.modules = unidades;  // Aquí se recibe el array de unidades de medición
        this.renderModules();
      } else {
        console.error("No se pudieron cargar las unidades de medición.");
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
        this.selectedModule.textContent = mod.nombre;
        this.selected = mod; // ← Guardar objeto completo
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

    const handleClickOutside = (e) => {
      if (e.target === this.popup) {
        errorMsg.style.display = 'none';
        this.popup.removeEventListener('click', handleClickOutside);
      }
    };

    this.popup.addEventListener('click', handleClickOutside);
  }

  async saveNewModule() {
    const newName = this.inputNew.value.trim();
    const errorMsg = document.getElementById('module-error');

    if (newName && !this.modules.some(m => m.nombre === newName)) {
      await this.handlers.create(this.moduleId, newName);
      await this.fetchModules();
      this.popup.style.display = 'none';
      errorMsg.style.display = 'none';
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
    const mod = this.modules.find(m => m.id === id);
    if (mod) {
      this.selectedModule.textContent = mod.nombre;
      this.selected = mod;
    }
  }
}
