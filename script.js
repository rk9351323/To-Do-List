// ===== STATE =====
let todos = [];
let currentFilter = 'all';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set current date in header
  const dateEl = document.getElementById('current-date');
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Allow Enter key to add todo
  document.getElementById('todo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAdd();
  });

  renderTodos();
});

// ===== HANDLE ADD =====
function handleAdd() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.style.borderColor = 'rgba(255,79,106,0.6)';
    setTimeout(() => { input.style.borderColor = ''; }, 800);
    return;
  }
  addTodo(text);
  input.value = '';
  input.focus();
}

// ===== ADD TODO =====
function addTodo(text) {
  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date()
  };
  todos.unshift(todo); // add to top
  renderTodos();
}

// ===== TOGGLE COMPLETE =====
function toggleComplete(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
}

// ===== DELETE TODO =====
function deleteTodo(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      todos = todos.filter(todo => todo.id !== id);
      renderTodos();
    }, 200);
  }
}

// ===== SET FILTER =====
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderTodos();
}

// ===== CLEAR COMPLETED =====
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  renderTodos();
}

// ===== GET FILTERED TODOS =====
function getFiltered() {
  switch (currentFilter) {
    case 'active':    return todos.filter(t => !t.completed);
    case 'completed': return todos.filter(t => t.completed);
    default:          return todos;
  }
}

// ===== RENDER =====
function renderTodos() {
  const list = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const listFooter = document.getElementById('list-footer');
  const filtered = getFiltered();

  // Update stats
  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const active = total - done;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-done').textContent = done;

  // Remaining label
  document.getElementById('remaining-label').textContent =
    active === 1 ? '1 Task left' : `${active} Tasks left`;

  // Show/hide footer
  listFooter.style.display = total > 0 ? 'flex' : 'none';

  // Clear list
  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    const msgs = {
      all: 'No tasks here yet.<br>Add one above!',
      active: 'No active tasks. 🎉<br>Everything is done!',
      completed: 'No completed tasks yet.<br>Keep going!'
    };
    emptyState.querySelector('p').innerHTML = msgs[currentFilter];
    return;
  }

  emptyState.style.display = 'none';

  filtered.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.setAttribute('data-id', todo.id);
    li.style.animationDelay = `${index * 0.04}s`;

    // Checkbox
    const check = document.createElement('button');
    check.className = 'todo-check';
    check.setAttribute('aria-label', todo.completed ? 'Mark incomplete' : 'Mark complete');
    check.innerHTML = todo.completed ? '✓' : '';
    check.addEventListener('click', () => toggleComplete(todo.id));

    // Text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    span.title = 'Click to toggle';
    span.addEventListener('click', () => toggleComplete(todo.id));

    // Delete button
    const del = document.createElement('button');
    del.className = 'todo-delete';
    del.innerHTML = '✕';
    del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => deleteTodo(todo.id));
    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}
