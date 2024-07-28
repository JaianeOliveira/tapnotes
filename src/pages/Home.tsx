import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLiveQuery } from 'dexie-react-hooks';
import { common, createLowlight } from 'lowlight';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EditorToolbar } from '../components/EditorTollbar';
import { db, Note } from '../lib/dexie';

const lowlight = createLowlight(common);

export default function Home() {
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
  });

  const notes = useLiveQuery(() => db.notes.toArray());
  const [noteState, setNoteState] = useState<'saved' | 'unsaved' | 'unknown'>(
    'unknown'
  );

  const editor = useEditor({
    extensions: [
      Highlight,
      Typography,
      StarterKit.configure({}),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'plaintext',
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({}),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        protocols: [
          'ftp',
          'mailto',
          {
            scheme: 'tel',
            optionalSlashes: true,
          },
        ],
        defaultProtocol: 'https',
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Subscript,
      Superscript,
      Underline,
      Placeholder.configure({
        placeholder: 'Escreava algo aqui...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm/6 sm:prose-base/6 lg:prose-lg/6 xl:prose-2xl/6 m-5 leading-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setCurrentNote((prev) => ({
        ...prev,
        content: editor.getHTML(),
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
      toast.success('Alterações salvas!');
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
      toast.success('Nota excluída com sucesso!');
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
      const noteFromDb = notes?.find((note) => note.id === currentNote.id);
      if (noteFromDb) {
        if (
          currentNote.content === noteFromDb.content &&
          currentNote.title === noteFromDb.title
        ) {
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
    <div className="grid grid-cols-5 h-[100vh] w-full overflow-hidden">
      <div className="col-span-1 h-full border-r border-neutral-300 bg-neutral-100 shadow-md flex flex-col">
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
        <ul className="flex-grow flex flex-col gap-2 w-full p-4 mb-4 overflow-y-auto h-0">
          {' '}
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
                className="px-4 py-2 rounded-md bg-neutral-200 shadow-md flex items-center w-full border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {note.title}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-4 w-full bg-neutral-50 flex flex-col">
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
            <EditorToolbar editor={editor} />
            <div className="flex-grow p-4 overflow-y-auto h-0">
              <EditorContent editor={editor} />
            </div>
            <div className="px-4 py-2 border-t border-neutral-300 flex items-center justify-between">
              <p className="text-xs italic text-neutral-400">
                {getNoteState()}
              </p>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteNote(currentNote.id!);
                  }}
                  className="text-red-500 px-4 py-1 font-medium"
                >
                  Excluir nota
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateNote(currentNote.id!);
                  }}
                  className="bg-indigo-500 px-4 py-1 rounded-md shadow-md text-neutral-50 font-semibold"
                >
                  Salvar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
