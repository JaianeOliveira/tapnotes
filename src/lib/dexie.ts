import Dexie, { EntityTable } from "dexie";

type Note = {
    id: number,
    title: string,
    content: string
    created_at: string
    updated_at: string
}

const db = new Dexie("notesDatabase") as Dexie & {
    notes: EntityTable<
      Note,
      'id' // primary key "id" (for the typings only)
    >;
  };
  

db.version(1).stores({
    notes: "++id, title, content, created_at, updated_at"
})


export { db };
export type { Note };

