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
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLiveQuery } from 'dexie-react-hooks';
import { common, createLowlight } from 'lowlight';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  FileJson2,
  FileText,
  Menu,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import mammoth from 'mammoth';
import { Sidebar } from 'primereact/sidebar';
import { TieredMenu } from 'primereact/tieredmenu';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Markdown } from 'tiptap-markdown';
import { EditorToolbar } from '../components/EditorTollbar';
import { db, Note } from '../lib/dexie';
const lowlight = createLowlight(common);

export default function Home() {
  const { noteId } = useParams()
  const navigate = useNavigate();

  const menu = useRef<TieredMenu>(null);

  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
  });

  const notes = useLiveQuery(() => db.notes.toArray());
  const [noteState, setNoteState] = useState<'saved' | 'unsaved' | 'unknown'>(
    'unknown'
  );

  const [collapsed, setCollapsed] = useState(false);
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      Highlight,
      Typography,
      StarterKit,
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
        protocols: ['ftp', 'mailto', { scheme: 'tel', optionalSlashes: true }],
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
        placeholder: 'Escreva algo aqui...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Markdown.configure({
        html: true,
        linkify:true,
        breaks: true,
        transformCopiedText: true,
        transformPastedText: true
      })
    ],
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
      navigate(`/${id}`);
      editor?.commands.setContent('');
    } catch (err) {
      console.log(err);
    }
  };

  const exportToHTML = () => {
    const blob = new Blob([currentNote.content || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  const handleCloseNote = () => {
    setCurrentNote({});
    editor?.commands.clearContent();
  };

  const handleImportHTML = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const htmlContent = e.target?.result as string;
        const date = new Date().toISOString();
        const newNote = {
          title: `${file.name.replace('.html', '')} - importado em ${date}`,
          content: htmlContent,
          created_at: date,
          updated_at: date,
        };
        const id = await db.notes.add(newNote);
        setCurrentNote({
          ...newNote,
          id: id,
        });
        editor?.commands.setContent(htmlContent);
      };
      reader.readAsText(file);
    }
  };

  const handleImportJSON = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonContent = e.target?.result as string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...importedNote } = JSON.parse(jsonContent);
        console.log(importedNote);
        console.log(importedNote);
        const date = new Date().toISOString();
        const newNote = {
          ...importedNote,
          title: `${importedNote.title} - importado em ${date}`,
          created_at: date,
          updated_at: date,
        };
        const id = await db.notes.add(newNote);
        setCurrentNote({
          ...newNote,
          id: id,
        });
        editor?.commands.setContent(importedNote.content || '');
      };
      reader.readAsText(file);
    }
  };

  const handleImportTXT = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const textContent = e.target?.result as string;
        const date = new Date().toISOString();
        const newNote = {
          title: `${file.name.replace('.txt', '')} - importado em ${date}`,
          content: textContent,
          created_at: date,
          updated_at: date,
        };
        const id = await db.notes.add(newNote);
        setCurrentNote({
          ...newNote,
          id: id,
        });
        editor?.commands.setContent(textContent);
      };
      reader.readAsText(file);
    }
  };

  const handleImportDOCX = async (file: File) => {
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value; // HTML convertido do arquivo DOCX
        const date = new Date().toISOString();
        const newNote = {
          title: `${file.name.replace('.docx', '')} - importado em ${date}`,
          content: htmlContent,
          created_at: date,
          updated_at: date,
        };
        const id = await db.notes.add(newNote);
        setCurrentNote({
          ...newNote,
          id: id,
        });
        editor?.commands.setContent(htmlContent);

        toast.success('Importado com sucesso!');
      } catch (error) {
        console.error('Erro ao processar o arquivo DOCX:', error);
        toast.error('Erro ao importar o arquivo DOCX');
      }
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];

      if (file) {
        const fileType = file.type;

        if (fileType === 'application/json') {
          handleImportJSON(file);
        } else if (fileType === 'text/html') {
          handleImportHTML(file);
        } else if (fileType === 'text/plain') {
          handleImportTXT(file);
        } else if (
          fileType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          handleImportDOCX(file);
        } else if(fileType === "text/markdown") {
          importFromMd(file);
        }else {
          toast.error('Tipo de arquivo não suportado');
          return;
        }

        toast.success('Importado com sucesso!');
      }
    } catch (err) {
      toast.error('Erro ao importar arquivo');
    }
  };

  const exportToJSON = () => {
    const noteJSON = editor?.getJSON(); // Obtém o JSON do Tiptap
    const blob = new Blob(
      [JSON.stringify({ ...currentNote, content: noteJSON })],
      {
        type: 'application/json',
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToTXT = () => {
    const noteJSON = editor?.getText();
    const blob = new Blob([noteJSON || ''], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importFromMd = async (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        
        const date = new Date().toISOString();
        const newNote = {
          title: `${file.name.replace('.md', '')} - importado em ${date}`,
          created_at: date,
          updated_at: date,
          content,
        };
        const id = await db.notes.add(newNote);
        setCurrentNote({
          ...newNote,
          id: id,
        });
        editor?.commands.setContent(content || '');
      };
      reader.readAsText(file);
    }
  }

  const exportToMd = () => {
    const noteJSON = editor?.storage.markdown.getMarkdown()
    const blob = new Blob([noteJSON || ''], {
      type: 'text/markdown',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
    editor?.commands.setContent(note.content);
    navigate(`/${note.id}`);
  }

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
        setNoteState('unsaved');
      }
    }
  }, [currentNote, notes]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (currentNote.id) {
          await handleUpdateNote(currentNote.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentNote.id, currentNote.content]);

  useEffect(() => {
    if (noteId) {
      const note = notes?.find((note) => String(note.id) === noteId);
      if (!note) {
        navigate('/');
        setCurrentNote({} as Note);
      }
    } else {
      navigate('/');
      setCurrentNote({} as Note);

    }
  }, [noteId])


  return (
    <div className="flex flex-col lg:flex-row h-[100vh] w-full overflow-hidden">
      <input
        id="import-file"
        type="file"
        accept=".md,.html,application/json,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleImport}
        className="hidden"
      />
      <Sidebar
        visible={sideBarIsOpen}
        onHide={() => setSideBarIsOpen(false)}
        position="right"
        header={() => {
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreateNewNoteEntry}
                className="bg-indigo-500 hover:brightness-105 transition-all duration-300 w-fit px-4 py-2 rounded-lg shadow-md text-neutral-50 font-semibold"
              >
                <span>Criar Nota</span>
              </button>
              <label
                htmlFor="import-file"
                className="cursor-pointer p-1 rounded-md flex gap-2 items-center border border-transparent justify-center aspect-square text-neutral-500 hover:bg-neutral-200 hover:border-neutral-300 transition-all duration-300"
              >
                <Upload size={16} />
              </label>
            </div>
          );
        }}
      >
        <ul className="flex flex-col gap-2">
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
                onClick={() => handleSelectNote(note)}  
                className="px-4 py-2 rounded-md bg-neutral-200 shadow-md flex items-center w-full border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {note.title}
              </li>
            ))}
        </ul>
      </Sidebar>
      <div className="flex lg:hidden w-full">
        <div className="w-full p-4 text-neutral-700 flex gap-4 items-center justify-between border-b border-b-neutral-200">
          <h1 className="text-lg font-extrabold tracking-wider">tapnotes;</h1>
          <div className="flex gap-2 items-center ">
            <label
              htmlFor="import-file"
              className="hidden lg:flex cursor-pointer p-1 rounded-md items-center border border-transparent justify-center aspect-square text-neutral-500 hover:bg-neutral-200 hover:border-neutral-300 transition-all duration-300"
            >
              <Upload size={16} />
            </label>
            <button
              type="button"
              onClick={handleCreateNewNoteEntry}
              className="hidden lg:block bg-indigo-500 hover:brightness-105 transition-all duration-300 w-fit px-4 py-2 rounded-lg shadow-md text-neutral-50 font-semibold"
            >
              <span className="hidden xl:block">Criar Nota</span>
              <span className="block xl:hidden">
                <Plus size={16} />
              </span>
            </button>
            <button
              onClick={() => setSideBarIsOpen(!sideBarIsOpen)}
              type="button"
              className="cursor-pointer p-1 rounded-md flex items-center border border-transparent justify-center aspect-square text-neutral-500 hover:bg-neutral-200 hover:border-neutral-300 transition-all duration-300"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`h-full border-r border-neutral-300 bg-neutral-100 shadow-md hidden lg:flex flex-col relative transition-all ${
          !collapsed ? 'w-[25%]' : 'w-8'
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center bg-neutral-200 border-[2px] border-neutral-400 aspect-square text-neutral-400 rounded-full h-6 w-6 absolute -right-3 top-14"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {collapsed ? null : (
          <>
            <div className="p-4 text-neutral-700 flex gap-4 items-center justify-between border-b border-b-neutral-200">
              <h1 className="text-lg font-extrabold tracking-wider">
                tapnotes;
              </h1>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="import-file"
                  className="cursor-pointer p-1 rounded-md flex items-center border border-transparent justify-center aspect-square text-neutral-500 hover:bg-neutral-200 hover:border-neutral-300 transition-all duration-300"
                >
                  <Upload size={16} />
                </label>
                <button
                  type="button"
                  onClick={handleCreateNewNoteEntry}
                  className="bg-indigo-500 hover:brightness-105 transition-all duration-300 w-fit px-4 py-2 rounded-lg shadow-md text-neutral-50 font-semibold"
                >
                  <span className="hidden xl:block">Criar Nota</span>
                  <span className="block xl:hidden">
                    <Plus size={16} />
                  </span>
                </button>
              </div>
            </div>
            <ul className="flex-grow flex flex-col gap-2 w-full p-4 mb-4 overflow-y-auto h-0">
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
                    onClick={() => handleSelectNote(note)}
                    className="px-4 py-2 rounded-md bg-neutral-200 shadow-md flex items-center w-full border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {note.title}
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
      <div className="w-full bg-neutral-50 flex flex-col h-full">
        {!currentNote.id ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm italic text-neutral-400">
              Nenhuma nota selecionada
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-neutral-300 flex items-center justify-between">
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
                className="font-bold text-lg text-neutral-800 outline-none w-full bg-transparent"
              />

              <button
                type="button"
                className="text-neutral-500"
                onClick={handleCloseNote}
              >
                <X size={16} />
              </button>
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
                <TieredMenu
                  model={[
                    {
                      label: 'HTML',
                      icon: <FileCode2 size={16} className="mr-2" />,
                      className: 'text-neutral-500 text-sm',
                      command: () => {
                        exportToHTML();
                      },
                    },
                    {
                      label: 'JSON',
                      icon: <FileJson2 size={16} className="mr-2" />,
                      className: 'text-neutral-500 text-sm',
                      command: () => {
                        exportToJSON();
                      },
                    },
                    {
                      label: 'TXT',
                      icon: <FileText size={16} className="mr-2" />,
                      className: 'text-neutral-500 text-sm',
                      command: () => {
                        exportToTXT();
                      },
                    },
                    {
                      label: 'Markdown',
                      icon: <FileText size={16} className="mr-2" />,
                      className: 'text-neutral-500 text-sm',
                      command: () => {
                        exportToMd();
                      },
                    },
                  ]}
                  popup
                  ref={menu}
                  breakpoint="767px"
                />
                <button
                  onClick={(e) => menu.current && menu.current.toggle(e)}
                  type="button"
                  className="text-neutral-500 py-1 font-medium justify-center text-center inline-flex gap-2 items-center"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Exportar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleDeleteNote(currentNote.id!);
                  }}
                  className="text-red-500 px-4 py-1 font-medium flex items-center justify-center text-center"
                >
                  <Trash2 size={16} className="text-red-500 inline sm:hidden" />
                  <span className="hidden sm:inline">Excluir nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateNote(currentNote.id!);
                  }}
                  className="bg-indigo-500 px-4 py-1 rounded-md shadow-md text-neutral-50 font-semibold flex items-center justify-center text-center"
                >
                  <Save size={16} className="inline sm:hidden" />
                  <span className="hidden sm:inline">Salvar</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
