function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const task = Object.fromEntries(formData);
  task.id = Date.now();

  // 4. No permitir tareas duplicadas (segun titulo)
  const existingTitles = [...document.querySelectorAll('#task-list-container .task-content h3')]
    .map(h3 => h3.textContent.trim().toLowerCase());

  if (existingTitles.includes(task.title.trim().toLowerCase())) {
    showFormError('Ya existe una tarea con ese titulo.');
    return;
  }

  // Limpiar error si se envi¢ correctamente
  clearFormError();

  const taskElement = createTaskElement(task);
  const ulContainer = document.getElementById('task-list-container');
  if (!ulContainer) return;

  ulContainer.appendChild(taskElement);
  event.target.reset(); // Limpiar formulario tras a¤adir
}

function createTaskElement(task) {
  const divTaskContent = document.createElement('div');
  divTaskContent.classList.add('task-content');

  const h3Title = document.createElement('h3');
  h3Title.textContent = task.title;

  const pDescription = document.createElement('p');
  pDescription.textContent = task.description;

  divTaskContent.appendChild(h3Title);
  divTaskContent.appendChild(pDescription);

  const divTaskAction = document.createElement('div');
  divTaskAction.classList.add('task-actions');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => deleteTaskElement(task));

  divTaskAction.appendChild(deleteButton);

  const li = document.createElement('li');
  li.classList.add('task-item');
  li.id = task.id;

  li.appendChild(divTaskContent);
  li.appendChild(divTaskAction);

  return li;
}

function deleteTaskElement(task) {
  const li = document.getElementById(task.id);
  
  // 5. Mensaje visual si se intenta borrar una tarea que ya no existe
  if (!li) {
    showDeleteError('Esa tarea ya no existe.');
    return;
  }
  
  li.remove();
}

function deleteTaskByTitle() {
    const input = document.getElementById('delete-title');
    const title = input.value.trim();
    
    if (!title) {
        showDeleteError('Debes escribir un titulo para eliminar.');
        return;
    }
    
    // Buscar el primer elemento cuyo h3 coincida exactamente (sin distinguir mayusculas/minusculas)
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
        // Mostrar confirmaci¢n breve (o simplemente limpiar mensajes)
        showDeleteError(''); // Elimina cualquier error visible
        input.value = '';    // Limpiar campo
    } else {
        // 5. Mensaje visual de error si no existe
        showDeleteError('Esa tarea no existe.');
    }
}

// --- Funciones auxiliares para mostrar/ocultar errores (sin modificar HTML) ---
function showFormError(message) {
  // Busca o crea un contenedor de error debajo del formulario
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
    
    // Si el mensaje est  vacio, simplemente ocultamos el error
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

document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('delete-by-title-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteTaskByTitle);
    }
});