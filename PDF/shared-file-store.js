// Shared cross-page file storage (IndexedDB) so a dropped file follows the user between tool pages.
if (!window.SharedFileStore) {
const DB_NAME = 'pdf-img-mgr-shared';
const STORE = 'files';
const KEY = 'active';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveSharedFile(file) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ name: file.name, type: file.type, blob: file }, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadSharedFile() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => {
      const rec = req.result;
      if (!rec) return resolve(null);
      resolve(new File([rec.blob], rec.name, { type: rec.type }));
    };
    req.onerror = () => reject(req.error);
  });
}

async function clearSharedFile() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

window.SharedFileStore = { saveSharedFile, loadSharedFile, clearSharedFile };
}
