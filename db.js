const dbPromise = indexedDB.open("TodoDB", 1);

dbPromise.onupgradeneeded = (e) => {
  const db = e.target.result;

  db.createObjectStore("todos", {
    keyPath: "id",
    autoIncrement: true
  });

  db.createObjectStore("settings");
};

function addTodo(text) {
  return new Promise((resolve) => {
    const db = dbPromise.result;
    const tx = db.transaction("todos", "readwrite");
    tx.objectStore("todos").add({
      text,
      createdAt: Date.now(),
      done: false
    });
    tx.oncomplete = resolve;
  });
}

function getTodos() {
  return new Promise((resolve) => {
    const db = dbPromise.result;
    const tx = db.transaction("todos", "readonly");
    const req = tx.objectStore("todos").getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

function deleteTodo(id) {
  const db = dbPromise.result;
  const tx = db.transaction("todos", "readwrite");
  tx.objectStore("todos").delete(id);
}

function saveSetting(key, value) {
  const db = dbPromise.result;
  const tx = db.transaction("settings", "readwrite");
  tx.objectStore("settings").put(value, key);
}

function getSetting(key) {
  return new Promise((resolve) => {
    const db = dbPromise.result;
    const tx = db.transaction("settings", "readonly");
    const req = tx.objectStore("settings").get(key);
    req.onsuccess = () => resolve(req.result);
  });
}
