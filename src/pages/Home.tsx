import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db, Note } from '../lib/dexie';

export default function Home() {
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
  });

  const notes = useLiveQuery(() => db.notes.toArray());
  const [noteState, setNoteState] = useState<'saved' | 'unsaved' | 'unknown'>('unknown');

  const editor = useEditor({
    extensions: [Highlight, Typography, StarterKit.configure({})],
    editorProps: {
        attributes: {
          class: 'prose prose-sm/6 sm:prose-base/6 lg:prose-lg/6 xl:prose-2xl/6 m-5/6 leading-none focus:outline-none',
        },
      },
    onUpdate: ({ editor }) => {
      setCurrentNote(prev => ({
        ...prev,
        content: editor.getHTML()
      }));
    },
 
  });

  const handleUpdateNote = async (id: number) => {
    try {
      await db.notes.update(id, {
        ...currentNote,
        updated_at: new Date().toISOString(),
      });
      setNoteState('saved');
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateNewNoteEntry = async () => {
    try {
      const date = new Date().toISOString();
      const note = {
        title: date,
        content: '',
        created_at: date,
        updated_at: date,
      };
      const id = await db.notes.add(note);
      setCurrentNote({
        ...note,
        id: id,
      });
      editor?.commands.setContent('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await db.notes.delete(id);
      setCurrentNote({});
      editor?.commands.clearContent();
    } catch (err) {
      console.log(err);
    }
  };

  const getNoteState = () => {
    switch (noteState) {
      case 'saved':
        return 'Salvo!';
      case 'unsaved':
        return 'As alterações não estão salvas';
      case 'unknown':
        return '';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!currentNote.id) {
      setNoteState('unknown');
    } else {
      const noteFromDb = notes?.find(note => note.id === currentNote.id);
      if (noteFromDb) {
        if (currentNote.content === noteFromDb.content && currentNote.title === noteFromDb.title) {
          setNoteState('saved');
        } else {
          setNoteState('unsaved');
        }
      } else {
        setNoteState('unsaved'); // Considera 'unsaved' se a nota não for encontrada
      }
    }
  }, [currentNote, notes]);

  return (
    <div className="grid grid-cols-5 min-h-[100vh] max-h-[100vh] w-full">
      <div className="col-span-1 h-full border-r border-neutral-300 bg-neutral-100 shadow-md min-h-[100vh] max-h-[100vh] flex flex-col">
        <div className="p-4 text-neutral-700 flex gap-4 items-center justify-between border-b border-b-neutral-200">
          <h1 className="text-lg font-extrabold tracking-wider">tapnotes;</h1>
          <button
            type="button"
            onClick={handleCreateNewNoteEntry}
            className="bg-indigo-500 hover:brightness-105 transition-all duration-300 w-fit px-4 py-2 rounded-lg shadow-md text-neutral-50 font-semibold"
          >
            Criar Nota
          </button>
        </div>
        <ul className="flex-grow flex flex-col gap-2 w-full p-4 mb-4 overflow-y-auto">
          {notes
            ?.sort((a, b) => {
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            })
            .map((note) => (
              <li
                key={note.id}
                onClick={() => {
                  setCurrentNote(note);
                  editor?.commands.setContent(note.content);
                }}
                className="px-4 py-2 rounded-md bg-neutral-200 shadow-md flex items-center w-full border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
              >
                {note.title}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-4 w-full bg-neutral-50 flex flex-col justify-between">
        {!currentNote.id ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm italic text-neutral-400">
              Nenhuma nota selecionada
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-neutral-300">
              <input
                name="newnote-title"
                value={currentNote.title}
                onChange={(e) => {
                  setCurrentNote((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
                placeholder="Título da Nota"
                className="font-bold text-lg text-neutral-800 outline-none w-full"
              />
            </div>
            <div className="w-full h-full p-4 ">
              <EditorContent
                editor={editor}
                className="w-full h-full outline-none bg-slate-50 rounded-lg border border-neutral-300 p-4"
              />
            </div>
          </>
        )}

        <div className="w-full flex items-center justify-between px-4 py-2 border-t border-t-neutral-300 bg-neutral-100">
          <p className="text-sm text-neutral-500">{getNoteState()}</p>

          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={() => {
                if (currentNote.id) {
                  handleDeleteNote(currentNote.id);
                }
              }}
              className="text-red-600 hover:brightness-105 transition-all duration-300 text-sm"
            >
              Excluir nota
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentNote.id) {
                  handleUpdateNote(currentNote.id);
                }
              }}
              className="bg-indigo-500 px-4 py-1 rounded-md text-neutral-50 font-medium hover:brightness-105 transition-all duration-300 text-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
