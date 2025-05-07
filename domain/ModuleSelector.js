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

    // Selectores del DOM para unidad de medición
    this.moduleList = this.container.querySelector('#module-list');
    this.selectedModule = this.container.querySelector('#selected-module');
    this.addBtn = this.container.querySelector('#add-module-btn');
    this.popup = document.getElementById('module-popup');
    this.inputNew = document.getElementById('new-module-name');
    this.saveBtn = document.getElementById('save-module');
    this.cancelBtn = document.getElementById('cancel-module');

    // Selectores del DOM para entidades financieras
    this.entidadName = document.getElementById('nombre');
    this.entidadTelefono = document.getElementById('telefono');
    this.entidadEmail = document.getElementById('correo');
    this.entidadTipo = document.getElementById('tipo');

    // Selectores del DOM para productos
    this.nombreProducto = document.getElementById('nombre');
    this.descripcionProducto = document.getElementById('descripcion');
    this.cantidadProducto = document.getElementById('cantidad');
    this.unidadMedicionProductoSelect = document.getElementById('unidadMedicion');
    this.categoriasProductoSelect = document.getElementById('categorias');

    this.init();
  }

  async init() {
    this.selectedModule.addEventListener('click', () => {
      this.container.classList.toggle('open');
    });

    if (this.creatable) {
      this.addBtn.style.display = 'inline-block';
      this.addBtn.addEventListener('click', (e) => { e.preventDefault(); this.showPopup(this.moduleId) });
      this.saveBtn.addEventListener('click', (e) => { e.preventDefault(); this.saveNewModule() });
      this.cancelBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.closePopup() });
    } else {
      this.addBtn.style.display = 'none';
    }

    this.fetchModules();
  }

  fetchModules(callback) {
    console.log("Ejecutando fetchModules para moduleId:", this.moduleId);
    this.handlers.list(this.moduleId, (items) => {
      if (items) {
        // Normalizar los objetos según el módulo
        switch (this.moduleId) {
          case 1:
            this.modules = items.map(item => this.normalizeItem(item));
            break;
          case 2:
            this.modules = items.entidadesFinancieras.map(item => this.normalizeItem(item));
            break;
          case 3:
            this.modules = items.productos.map(item => this.normalizeItem(item));
            break;
          default:
            console.warn("No se reconoce el tipo de módulo:", this.moduleId);
            break;
        }
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

        input.addEventListener('keydown', (e) => {

          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            const newValue = input.value.trim();

            if (newValue && !this.modules.some(m => m.nombre === newValue)) {

              this.handlers.update(this.moduleId, mod.id, newValue, (updatedModules) => {
                if (updatedModules && Array.isArray(updatedModules)) {
                  this.modules = updatedModules.map(item => this.normalizeItem(item));
                  this.renderModules();
                  this.showAlert('success', 'Operación exitosa', `"${newValue}" ha sido actualizado.`);

                } else {
                  this.showAlert('error', 'Error', 'No se pudo actualizar la lista luego de modificar el módulo.');
                }
              });
            } else {
              if (newValue === '') {
                input.value = mod.nombre; // Revertir al nombre original si está vacío
                this.showAlert('error', 'Error', 'El nombre no puede estar vacío');
              }

              if (newValue === mod.nombre) {
                input.value = mod.nombre;
                this.showAlert('success', 'Operación exitosa', `"${newValue}" ha sido actualizado.`);
              }
            }
          } else if (e.key === 'Escape') {
            const mod = input._mod;
            input.value = mod?.nombre || '';
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

    item.querySelector('.confirm').onclick = () => {
      this.handlers.delete(this.moduleId, id, (response) => {
        if (response && response.success) {

          if (Array.isArray(response.updatedModules)) {
            this.modules = response.updatedModules.map(item => this.normalizeItem(item));
            this.renderModules();
          } else {
            this.fetchModules(); // Fallback si no se devuelve data explícita
          }

          this.showAlert('success', 'Operación exitosa', `"${mod.nombre}" ha sido eliminado.`);
          this.showUndoToast(mod);
        } else {
          // Mostrar el mensaje del backend, si lo hay
          const errorMsg = response?.message || 'No se pudo eliminar el módulo.';
          this.showAlert('error', 'Error', errorMsg);
          this.renderModules(); // Restaurar UI si no se elimina
        }
      });
    };

    item.querySelector('.cancel').onclick = () => this.renderModules();
  }

  showUndoToast(mod) {
    const toast = document.createElement('div');
    toast.className = 'undo-toast';
    toast.innerHTML = `Unidad eliminada: <strong>${mod.nombre}</strong> <button>Deshacer</button>`;

    const undoBtn = toast.querySelector('button');
    undoBtn.onclick = () => {
      if (typeof this.handlers.undoDelete === 'function') {
        this.handlers.undoDelete(this.moduleId, mod.id, (response) => {
          if (response && response.success && Array.isArray(response.data)) {
            this.modules = response.data.map(item => this.normalizeItem(item));
            this.renderModules();
            toast.remove();
            this.showAlert('success', 'Deshacer', `"${mod.nombre}" fue restaurado.`);
          } else {
            const msg = response?.message || 'No se pudo deshacer la eliminación.';
            this.showAlert('error', 'Error', msg);
          }
        });
      }
    };

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 10000);
  }

  showPopup(module) {
    switch (module) {
      case 1:
        this.inputNew.value = '';
        this.popup.style.display = 'flex';
        this.inputNew.focus();

        break;
      case 2:
        this.entidadName.value = '';
        this.entidadTelefono.value = '';
        this.entidadEmail.value = '';
        this.entidadTipo.value = '';
        this.popup.style.display = 'flex';
        break;

      case 3:
        this.nombreProducto.value = '';
        this.descripcionProducto.value = '';
        this.cantidadProducto.value = '';
        this.unidadMedicionProductoSelect.value = 0;
        this.categoriasProductoSelect.value = 0;
        this.popup.style.display = 'flex';
        break;
      default:
        console.warn("No se reconoce el módulo para mostrar el popup:", module);
        break;
    }
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

  saveNewModule() {
    const errorMsg = document.getElementById('module-error');
    switch (this.moduleId) {
      case 1:
        const newName = this.inputNew.value.trim();

        if (newName && !this.modules.some(m => m.nombre === newName)) {
          this.handlers.create(this.moduleId, newName, (updatedModules) => {
            if (updatedModules && Array.isArray(updatedModules)) {
              this.modules = updatedModules.map(item => this.normalizeItem(item));
              this.renderModules(); // Recargar lista
              this.showAlert('success', 'Operación exitosa', `"${newName}" ha sido creado.`);
              this.popup.style.display = 'none';
              errorMsg.style.display = 'none';
            } else {
              this.showAlert('error', 'Error', 'No se pudo actualizar la lista luego de crear el módulo.');
              console.error("Error: lista actualizada no recibida.");
            }
          });
        } else {
          errorMsg.textContent = "Ingrese un nombre válido y único.";
          errorMsg.style.display = 'block';
          this.inputNew.focus();
        }
        break;
      case 2:
        const newEntidad = {
          nombre: this.entidadName.value.trim(),
          telefono: this.entidadTelefono.value.trim(),
          correo: this.entidadEmail.value.trim(),
          tipo: this.entidadTipo.value.trim()
        };

        if (newEntidad.nombre && newEntidad.telefono && newEntidad.correo && newEntidad.tipo) {
          this.handlers.create(this.moduleId, newEntidad, (updatedModules) => {
            if (updatedModules && Array.isArray(updatedModules.entidadesFinancieras)) {
              this.modules = updatedModules.entidadesFinancieras.map(item => this.normalizeItem(item));
              this.renderModules(); // Recargar lista
              this.showAlert('success', 'Operación exitosa', `"${newEntidad.nombre}" ha sido creado.`);
              this.popup.style.display = 'none';
            } else {
              this.showAlert('error', 'Error', 'No se pudo actualizar la lista luego de crear el módulo.');
              console.error("Error: lista actualizada no recibida.");
            }
          });
        } else {
          errorMsg.textContent = "Porfavor, complete todos los campos.";
          errorMsg.style.display = 'block';
          this.inputNew.focus();
        }
        break;
      case 3:
        const newProducto = {
          nombre: this.nombreProducto.value.trim(),
          descripcion: this.descripcionProducto.value.trim(),
          cantidad: this.cantidadProducto.value.trim(),
          unidadMedicion: this.unidadMedicionProductoSelect.value,
          categoria: this.categoriasProductoSelect.value
        };
        if (newProducto.nombre && newProducto.descripcion && newProducto.cantidad) {
          this.handlers.create(this.moduleId, newProducto, (updatedModules) => {
            if (updatedModules && Array.isArray(updatedModules.productos)) {
              this.modules = updatedModules.productos.map(item => this.normalizeItem(item));
              this.renderModules(); // Recargar lista
              this.showAlert('success', 'Operación exitosa', `"${newProducto.nombre}" ha sido creado.`);
              this.popup.style.display = 'none';
            } else {
              this.showAlert('error', 'Error', 'No se pudo actualizar la lista luego de crear el módulo.');
              console.error("Error: lista actualizada no recibida.");
            }
          });
        } else {
          errorMsg.textContent = "Porfavor, complete todos los campos.";
          errorMsg.style.display = 'block';
          this.inputNew.focus();
        }
        break;
    }
  }

  getSelectedId() {
    return this.selected?.id || null;
  }

  getSelectedNombre() {
    return this.selected?.nombre || null;
  }

  setSelectedById(id) {
    console.log("Set selected by ID:", id);
    switch (this.moduleId) {
      case 1:
        const mod = this.modules.find(m => m.id === id || m.idUnidadMedicion === id);
        if (mod) {
          console.log("Set selected by ID:", mod);
          this.selected = mod;
          this.updateSelectedDisplay(mod);
        } else {
          console.warn("Set selected by ID: no se encontró un módulo con id", id);
        }
        break;
      case 2:
        const mod2 = this.modules.find(m => m.id === id || m.idEntidadFinanciera === id);
        if (mod2) {
          this.selected = mod2;
          this.updateSelectedDisplay(mod2);
        } else {
          console.warn("Set selected by ID: no se encontró un módulo con id", id);
        }
        break;
      case 3:
        const mod3 = this.modules.find(m => m.id === id || m.idProducto === id);
        if (mod3) {
          this.selected = mod3;
          this.updateSelectedDisplay(mod3);
        } else {
          console.warn("Set selected by ID: no se encontró un módulo con id", id);
        }
        break;
      default:
        console.warn("No se reconoce el tipo de módulo:", this.moduleId);
        break;
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
      case 2: // Entidades Financieras
        return {
          id: item.idEntidadFinanciera,
          nombre: item.nombre,
          telefono: item.telefono,
          correo: item.correo,
          tipo: item.tipo,
          estado: item.estado
        };
      case 3: // Productos
        return {
          id: item.idProducto,
          nombre: item.nombreProducto,
          descripcion: item.descripcionProducto,
          cantidad: item.cantidad
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
    console.log("Update selected display:", mod);
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
