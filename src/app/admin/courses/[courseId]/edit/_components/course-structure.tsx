"use client";

import { ReactNode, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronRight, GripVertical, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminCourseType } from "@/app/data/admin/get-course-admin";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export function CourseStructure({ data }: { data: AdminCourseType }) {
  const initialItems = useMemo(() => {
    return (
      data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.position,
        })),
      })) || []
    );
  }, [data]);

  const [items, setItems] = useState(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "chapter" && overType === "chapter") {
      const newItems = arrayMove(
        items,
        items.findIndex((item) => item.id === active.id),
        items.findIndex((item) => item.id === over.id)
      ).map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setItems(newItems);

      const reorderPromise = reorderChapters({
        courseId: data.id,
        chapters: newItems.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        })),
      });

      toast.promise(reorderPromise, {
        loading: "Reordering chapters...",
        success: (res) => res.message,
        error: () => "Failed to reorder chapters",
      });
    } else if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (activeChapterId && activeChapterId === overChapterId) {
        const newItems = items.map((chapter) => {
          if (chapter.id !== activeChapterId) return chapter;

          const newLessons = arrayMove(
            chapter.lessons,
            chapter.lessons.findIndex((l) => l.id === active.id),
            chapter.lessons.findIndex((l) => l.id === over.id)
          ).map((lesson, index) => ({
            ...lesson,
            order: index + 1,
          }));

          return { ...chapter, lessons: newLessons };
        });

        setItems(newItems);
        const reorderPromise = reorderLessons({
          chapterId: activeChapterId,
          lessons:
            newItems
              .find((chapter) => chapter.id === activeChapterId)
              ?.lessons.map((lesson) => ({
                id: lesson.id,
                position: lesson.order,
              })) || [],
        });

        toast.promise(reorderPromise, {
          loading: "Reordering lessons...",
          success: (res) => res.message,
          error: () => "Failed to reorder lessons",
        });
      }
    }
  }

  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging && "z-10")}
      >
        {children(listeners)}
      </div>
    );
  }

  const toggleChapter = useCallback((chapterId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }, []);

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} data={{ type: "chapter" }}>
            {(chapterListeners) => (
              <Card>
                <Collapsible
                  open={item.isOpen}
                  onOpenChange={() => toggleChapter(item.id)}
                  className="flex flex-col gap-2"
                >
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex items-center gap-1 flex-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-grab opacity-60 hover:opacity-100"
                        {...chapterListeners}
                      >
                        <GripVertical />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "transition-transform duration-200",
                            item.isOpen && "rotate-90"
                          )}
                        >
                          <ChevronRight />
                        </Button>
                      </CollapsibleTrigger>
                      <CardTitle className="cursor-pointer hover:text-primary transition-colors duration-200 text-lg">
                        {`${item.order}- ${item.title}`}
                      </CardTitle>
                    </div>
                    <Button
                      size="icon"
                      className="bg-transparent hover:bg-destructive/30"
                    >
                      <Trash2 className="opacity-80" />
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="px-4 md:px-8 lg:px-16">
                      <SortableContext
                        items={item.lessons.map((lesson) => lesson.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {item.lessons.map((lesson) => (
                          <SortableItem
                            key={lesson.id}
                            id={lesson.id}
                            data={{ type: "lesson", chapterId: item.id }}
                          >
                            {(lessonListeners) => (
                              <div className="flex w-full justify-between items-center mb-2 px-4 py-1 rounded-md hover:bg-muted/40 ">
                                <div className="flex items-center gap-1 flex-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="cursor-grab opacity-60 hover:opacity-100"
                                    {...lessonListeners}
                                  >
                                    <GripVertical />
                                  </Button>
                                  <CardTitle className="flex items-center gap-1 text-sm cursor-pointer">
                                    <Link
                                      href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                    >
                                      {`${item.order}.${lesson.order}- ${lesson.title}`}
                                    </Link>
                                  </CardTitle>
                                </div>
                                <Button
                                  size="icon"
                                  className="bg-transparent hover:bg-destructive/30"
                                >
                                  <Trash2 className="opacity-80" />
                                </Button>
                              </div>
                            )}
                          </SortableItem>
                        ))}
                      </SortableContext>
                      <Button className="w-full" variant="outline">
                        Create New Lesson
                      </Button>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
