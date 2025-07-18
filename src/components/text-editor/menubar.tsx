"use client";

import { type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  ListIcon,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input p-1.5 bg-card ">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                size="sm"
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                size="sm"
                className={cn(
                  editor.isActive("italic") && "bg-muted text-muted-foreground"
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                size="sm"
                className={cn(
                  editor.isActive("strike") && "bg-muted text-muted-foreground"
                )}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                size="sm"
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading1 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                size="sm"
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading2 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                size="sm"
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Heading3 />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                size="sm"
                className={cn(
                  editor.isActive("bulletList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                size="sm"
                className={cn(
                  editor.isActive("orderedList") &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                size="sm"
                className={cn(
                  editor.isActive({ textAlign: "left" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignLeft />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                size="sm"
                className={cn(
                  editor.isActive({ textAlign: "center" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignCenter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                size="sm"
                className={cn(
                  editor.isActive({ textAlign: "right" }) &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <AlignRight />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
