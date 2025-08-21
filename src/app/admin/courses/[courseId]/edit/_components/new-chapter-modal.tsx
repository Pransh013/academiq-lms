"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChapterSchema } from "@/lib/schemas";
import { CreateChapterType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createChapter } from "../actions";
import { tryCatch } from "@/lib/utils/try-catch";
import { toast } from "sonner";

export function NewChapterModal({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateChapterType>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      name: "",
      courseId,
    },
  });

  function onSubmit(values: CreateChapterType) {
    startTransition(async () => {
      const { data: response, error } = await tryCatch(createChapter(values));
      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      if (response.status === "error") {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      form.reset();
      handleOpenChange(false);
    });
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new chapter</DialogTitle>
          <DialogDescription>What would you like to name it?</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter chapter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="min-w-36">
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Plus /> Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
