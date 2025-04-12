class ModuleSelector {
  constructor({ containerId, moduleId, editable = true, deletable = true, creatable = true, handlers }) {
    this.container = document.getElementById(containerId);
    this.moduleId = moduleId;
    this.editable = editable;
    this.deletable = deletable;
    this.creatable = creatable;
    this.handlers = handlers;
    this.modules = [];

    // Selectores dentro del contenedor
    this.moduleList = this.container.querySelector('.module-list');
    this.selectedModule = this.container.querySelector('.selected-module');
    this.addBtn = this.container.querySelector('.add-module-btn');
    this.popup = this.container.querySelector('.popup-overlay');
    this.inputNew = this.container.querySelector('.new-module-name');
    this.saveBtn = this.container.querySelector('.save-module');
    this.cancelBtn = this.container.querySelector('.cancel-module');

    // Iniciar selector
    this.init();
  }

  async init() {
    this.selectedModule.addEventListener('click', () => {
      this.container.classList.toggle('open');
    });

    if (this.creatable) {
      this.addBtn.style.display = 'inline-block';
      this.addBtn.addEventListener('click', () => this.showPopup());
      this.saveBtn.addEventListener('click', () => this.saveNewModule());
      this.cancelBtn.addEventListener('click', () => this.popup.style.display = 'none');
    } else {
      this.addBtn.style.display = 'none';
    }

    await this.fetchModules();
  }

  async fetchModules() {
    this.modules = await this.handlers.list(this.moduleId) || [];
    this.renderModules();
  }

  renderModules() {
    this.moduleList.innerHTML = '';
    this.modules.forEach((mod, i) => {
      const item = document.createElement('div');
      item.className = 'module-item';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = mod;
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
            if (newValue && newValue !== this.modules[i]) {
              await this.handlers.update(this.moduleId, i, newValue);
              await this.fetchModules();
            }
          } else if (e.key === 'Escape') {
            input.value = this.modules[i];
            input.readOnly = true;
          }
        });
      }

      input.addEventListener('dblclick', () => {
        this.selectedModule.firstChild.textContent = input.value;
        this.container.classList.remove('open');
      });

      item.appendChild(input);

      if (this.deletable) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = () => this.confirmDelete(i);
        item.appendChild(deleteBtn);
      }

      this.moduleList.appendChild(item);
    });
  }

  confirmDelete(index) {
    const item = this.moduleList.children[index];
    item.className = 'module-item deleting-module';
    item.innerHTML = `
        <input type="text" readonly value="${this.modules[index]}" />
        <div class="delete-buttons-container">
            <button class="confirm">Eliminar</button>
            <button class="cancel">Cancelar</button>
        </div>
      `;

    item.querySelector('.confirm').onclick = async () => {
      const deleted = this.modules[index];
      await this.handlers.delete(this.moduleId, index);
      await this.fetchModules();
      this.showUndoToast(deleted, index);
    };

    item.querySelector('.cancel').onclick = () => this.renderModules();
  }

  showUndoToast(deleted, index) {
    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.innerHTML = `Módulo eliminado: <strong>${deleted}</strong> <button>Deshacer</button>`;
    toast.querySelector('button').onclick = async () => {
      await this.handlers.undoDelete?.(this.moduleId, deleted, index);
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
  }

  async saveNewModule() {
    const newName = this.inputNew.value.trim();
    if (newName && !this.modules.includes(newName)) {
      await this.handlers.create(this.moduleId, newName);
      await this.fetchModules();
      this.popup.style.display = 'none';
    } else {
      alert("Ingrese un nombre válido y único.");
    }
  }
}
