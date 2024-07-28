import { Editor } from "@tiptap/react";
import { Bold, Code, Heading1, Heading2, Heading3, Highlighter, Italic, List, ListChecks, ListOrdered, MessageSquareQuote, Minus, Strikethrough, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Table as TableIcon, Terminal, Underline as UnderlineIcon } from "lucide-react";

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const handleSubscript = () => 
      editor.chain().focus().toggleSubscript().run()

    const handleSuperscript = () => 
      editor.chain().focus().toggleSuperscript().run()
    

    return <>
         <div className="p-4 flex gap-2 items-center bg-neutral-100 border-b border-neutral-300">
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Heading1 size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Heading2 size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Heading3 size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <UnderlineIcon size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
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
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <ListOrdered size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <ListChecks size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Highlighter size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <TableIcon size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Code size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Terminal size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <MessageSquareQuote size={16} />
              </button>
              <button
                type="button"
                className="bg-neutral-200 p-1 rounded-md flex items-center justify-center aspect-square text-neutral-500 border border-neutral-400 hover:brightness-95"
              >
                <Minus size={16} />
              </button>
            </div>
    </>
}