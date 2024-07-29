import { Editor } from '@tiptap/react';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Terminal,
  Underline as UnderlineIcon
} from 'lucide-react';

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {

  if (!editor) {
    return null;
  }

  const handleSubscript = () => editor.chain().focus().toggleSubscript().run();

  const handleSuperscript = () =>
    editor.chain().focus().toggleSuperscript().run();

  const handleHeading1 = () =>
    editor.chain().focus().toggleHeading({ level: 1 }).run();

  const handleHeading2 = () =>
    editor.chain().focus().toggleHeading({ level: 2 }).run();

  const handleHeading3 = () =>
    editor.chain().focus().toggleHeading({ level: 3 }).run();

  const handleBold = () => editor.chain().focus().toggleBold().run();

  const handleItalic = () => editor.chain().focus().toggleItalic().run();

  const handleStrike = () => editor.chain().focus().toggleStrike().run();

  const handleUnderline = () => editor.chain().focus().toggleUnderline().run();

  const handleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();

  const handleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();

  const handleTaskList = () => editor.chain().focus().toggleTaskList().run();

  const handleHighlight = () => editor.chain().focus().toggleHighlight().run();

  const handleCode = () => editor.chain().focus().toggleCode().run();

  const handleCodeblock = () => editor.chain().focus().toggleCodeBlock().run();

  const handleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();

  const handleHorizontalRule = () =>
    editor.chain().focus().setHorizontalRule().run();

  return (
    <>
      <div className="p-4 flex gap-2 items-center justify-between bg-neutral-100 border-b border-neutral-300">
        <div className="flex gap-3 items-center flex-wrap">
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleHeading1}
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleHeading2}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleHeading3}
          >
            <Heading3 size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleBold}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleItalic}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleUnderline}
          >
            <UnderlineIcon size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleStrike}
          >
            <Strikethrough size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleSubscript}
          >
            <SubscriptIcon size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleSuperscript}
          >
            <SuperscriptIcon size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleBulletList}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleOrderedList}
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleTaskList}
          >
            <ListChecks size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleHighlight}
          >
            <Highlighter size={16} />
          </button>
          {/* <button
          type="button"
          className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
        >
          <TableIcon size={16} />
        </button> */}
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleCode}
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleCodeblock}
          >
            <Terminal size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleBlockquote}
          >
            <MessageSquareQuote size={16} />
          </button>
          <button
            type="button"
            className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
            onClick={handleHorizontalRule}
          >
            <Minus size={16} />
          </button>
        </div>
        <div> 
          
        </div>
      </div>
    </>
  );
};
