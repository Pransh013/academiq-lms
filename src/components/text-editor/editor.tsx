"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { MenuBar } from "./menubar";

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-80 p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },

    content: value ? JSON.parse(value) : "<div></div>"
  });

  return (
    <div className="border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
