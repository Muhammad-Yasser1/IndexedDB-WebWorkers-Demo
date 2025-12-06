const listEl = document.getElementById('todo-list');
const inputEl = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('settings-modal');
const openSettings = document.getElementById('open-settings');
const closeSettings = document.getElementById('close-settings');
const darkToggle = document.getElementById('dark-mode-toggle');
const sortOrderSelect = document.getElementById('sort-order');

dbPromise.onsuccess = async () => {
	await loadSettings();
	await loadTodos();
};

addBtn.onclick = async () => {
	const text = inputEl.value.trim();
	if (!text) return;

	await addTodo(text);
	inputEl.value = '';
	loadTodos();
};

async function loadTodos() {
	let todos = await getTodos();

	const order = (await getSetting('sortOrder')) || 'newest';
	todos.sort((a, b) =>
		order === 'newest'
			? b.createdAt - a.createdAt
			: a.createdAt - b.createdAt
	);

	listEl.innerHTML = '';

	for (const todo of todos) {
		const li = document.createElement('li');
		li.innerHTML = `
      <span>${todo.text}</span>
      <button data-id="${todo.id}">❌</button>
    `;
		listEl.appendChild(li);
	}
}

listEl.onclick = (e) => {
	if (e.target.tagName === 'BUTTON') {
		deleteTodo(Number(e.target.dataset.id));
		loadTodos();
	}
};

openSettings.onclick = () => modal.classList.remove('hidden');
closeSettings.onclick = () => modal.classList.add('hidden');

async function loadSettings() {
	const dark = (await getSetting('darkMode')) || false;
	const order = (await getSetting('sortOrder')) || 'newest';

	darkToggle.checked = dark;
	sortOrderSelect.value = order;

	updateTheme();
}

darkToggle.onchange = () => {
	saveSetting('darkMode', darkToggle.checked);
	updateTheme();
};

sortOrderSelect.onchange = () => {
	saveSetting('sortOrder', sortOrderSelect.value);
	loadTodos();
};

function updateTheme() {
	if (darkToggle.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js');
}
