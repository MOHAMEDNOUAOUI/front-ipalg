/** A file the user attached to a property, kept in this browser until the backend takes over. */
export interface StoredDoc {
  id: string;
  name: string;
  mime: string;
  ext: string;
  size: number;
  date: string;
  blob: Blob;
  /** Files a .gltf points to (bin, textures), by file name. */
  extra?: { name: string; blob: Blob }[];
}

const DB = 'ipalg-documents';
const STORE = 'files';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const docStore = {
  list: async (key: string): Promise<StoredDoc[]> => {
    try {
      return ((await run('readonly', (s) => s.get(key))) as StoredDoc[] | undefined) ?? [];
    } catch {
      return [];
    }
  },
  save: (key: string, docs: StoredDoc[]) => run('readwrite', (s) => s.put(docs, key)),
};
