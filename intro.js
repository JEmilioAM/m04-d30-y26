// ========== FUNCIONES AUXILIARES DE ERROR ==========
function showFormError(message) {
  const form = document.querySelector('form');
  let errorBox = document.getElementById('form-error');
  if (!errorBox) {
    errorBox = document.createElement('p');
    errorBox.id = 'form-error';
    errorBox.style.color = '#cc0000';
    errorBox.style.fontSize = '14px';
    errorBox.style.marginTop = '8px';
    form.after(errorBox);
  }
  errorBox.textContent = message;
}

function clearFormError() {
  const errorBox = document.getElementById('form-error');
  if (errorBox) errorBox.remove();
}

function showDeleteError(message) {
  const ul = document.getElementById('task-list-container');
  let errorBox = document.getElementById('delete-error');
  if (!errorBox) {
    errorBox = document.createElement('p');
    errorBox.id = 'delete-error';
    errorBox.style.color = '#cc0000';
    errorBox.style.fontSize = '14px';
    errorBox.style.marginTop = '10px';
    ul.after(errorBox);
  }
  errorBox.textContent = message;
  if (!message) {
    errorBox.remove();
    return;
  }
  setTimeout(() => {
    if (errorBox && errorBox.parentNode) {
      errorBox.remove();
    }
  }, 3000);
}

// ========== CREAR TAREA (CON BOTÓN ELIMINAR ORIGINAL) ==========
function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const task = Object.fromEntries(formData);
  task.id = Date.now();

  // Validación de título duplicado
  const existingTitles = [...document.querySelectorAll('#task-list-container .task-content h3')]
    .map(h3 => h3.textContent.trim().toLowerCase());

  if (existingTitles.includes(task.title.trim().toLowerCase())) {
    showFormError('Ya existe una tarea con ese título.');
    return;
  }

  clearFormError();

  const taskElement = createTaskElement(task);
  const ulContainer = document.getElementById('task-list-container');
  if (!ulContainer) return;

  ulContainer.appendChild(taskElement);
  event.target.reset();
}

function createTaskElement(task) {
  // Contenido
  const divTaskContent = document.createElement('div');
  divTaskContent.classList.add('task-content');

  const h3Title = document.createElement('h3');
  h3Title.textContent = task.title;

  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.value = task.title;
  inputTitle.style.display = 'none';
  inputTitle.classList.add('edit-title-input');

  const pDescription = document.createElement('p');
  pDescription.textContent = task.description;

  const textareaDesc = document.createElement('textarea');
  textareaDesc.value = task.description;
  textareaDesc.style.display = 'none';
  textareaDesc.classList.add('edit-desc-textarea');
  textareaDesc.rows = 2;

  divTaskContent.appendChild(h3Title);
  divTaskContent.appendChild(inputTitle);
  divTaskContent.appendChild(pDescription);
  divTaskContent.appendChild(textareaDesc);

  // Acciones
  const divTaskAction = document.createElement('div');
  divTaskAction.classList.add('task-actions');

  const editTitleBtn = document.createElement('button');
  editTitleBtn.textContent = 'Editar título';
  editTitleBtn.classList.add('edit-title-btn');

  const editDescBtn = document.createElement('button');
  editDescBtn.textContent = 'Editar descripción';
  editDescBtn.classList.add('edit-desc-btn');

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Guardar';
  saveBtn.style.display = 'none';
  saveBtn.classList.add('save-btn');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.style.display = 'none';
  cancelBtn.classList.add('cancel-btn');

  // BOTÓN ELIMINAR PROPIO DE CADA TAREA
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => deleteTaskElement(task));

  divTaskAction.appendChild(editTitleBtn);
  divTaskAction.appendChild(editDescBtn);
  divTaskAction.appendChild(saveBtn);
  divTaskAction.appendChild(cancelBtn);
  divTaskAction.appendChild(deleteButton);

  const taskError = document.createElement('span');
  taskError.classList.add('task-error');
  divTaskAction.appendChild(taskError);

  const li = document.createElement('li');
  li.classList.add('task-item');
  li.id = task.id;
  li.originalTitle = task.title;
  li.originalDescription = task.description;

  li.appendChild(divTaskContent);
  li.appendChild(divTaskAction);

  // Activar lógica de edición
  setupEditMode(li, editTitleBtn, editDescBtn, saveBtn, cancelBtn,
                h3Title, inputTitle, pDescription, textareaDesc, taskError);

  return li;
}

function setupEditMode(li, editTitleBtn, editDescBtn, saveBtn, cancelBtn,
                       h3Title, inputTitle, pDescription, textareaDesc, taskError) {
  let editing = false;

  function enterEditMode() {
    editing = true;
    h3Title.style.display = 'none';
    inputTitle.style.display = 'block';
    pDescription.style.display = 'none';
    textareaDesc.style.display = 'block';

    editTitleBtn.style.display = 'none';
    editDescBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';

    inputTitle.value = li.originalTitle;
    textareaDesc.value = li.originalDescription;
    taskError.textContent = '';
  }

  function exitEditMode(reset = false) {
    editing = false;
    if (reset) {
      inputTitle.value = li.originalTitle;
      textareaDesc.value = li.originalDescription;
    }
    h3Title.style.display = 'block';
    inputTitle.style.display = 'none';
    pDescription.style.display = 'block';
    textareaDesc.style.display = 'none';

    editTitleBtn.style.display = 'inline-block';
    editDescBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    taskError.textContent = '';
  }

  function saveChanges() {
    const newTitle = inputTitle.value.trim();
    const newDesc = textareaDesc.value.trim();

    if (newTitle === '') {
      taskError.textContent = 'El título no puede estar vacío.';
      return;
    }

    const otherTitles = [...document.querySelectorAll('#task-list-container .task-content h3')]
      .map(h3 => h3.textContent.trim().toLowerCase())
      .filter(title => title !== li.originalTitle.toLowerCase());

    if (otherTitles.includes(newTitle.toLowerCase())) {
      taskError.textContent = 'Ya existe una tarea con ese título.';
      return;
    }

    h3Title.textContent = newTitle;
    pDescription.textContent = newDesc;
    li.originalTitle = newTitle;
    li.originalDescription = newDesc;
    exitEditMode(false);
  }

  editTitleBtn.addEventListener('click', enterEditMode);
  editDescBtn.addEventListener('click', enterEditMode);
  saveBtn.addEventListener('click', saveChanges);
  cancelBtn.addEventListener('click', () => exitEditMode(true));
}

// ========== ELIMINAR TAREA (BOTÓN INDIVIDUAL) ==========
function deleteTaskElement(task) {
  const li = document.getElementById(task.id);
  if (!li) {
    showDeleteError('Esa tarea ya no existe.');
    return;
  }
  li.remove();
}

// ========== ELIMINAR POR TÍTULO (SECCIÓN INFERIOR) ==========
function deleteTaskByTitle() {
  const input = document.getElementById('delete-title');
  const title = input.value.trim();
  if (!title) {
    showDeleteError('Debes escribir un título para eliminar.');
    return;
  }

  const items = document.querySelectorAll('#task-list-container .task-item');
  let found = false;
  for (const item of items) {
    const h3 = item.querySelector('.task-content h3');
    if (h3 && h3.textContent.trim().toLowerCase() === title.toLowerCase()) {
      item.remove();
      found = true;
      break;
    }
  }

  if (found) {
    showDeleteError('');
    input.value = '';
  } else {
    showDeleteError('Esa tarea no existe.');
  }
}

// Vincular el botón "Eliminar por título" cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const deleteBtn = document.getElementById('delete-by-title-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteTaskByTitle);
  }
});