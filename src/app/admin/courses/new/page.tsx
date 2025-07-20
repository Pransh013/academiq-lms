"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NewCourseType } from "@/lib/types";
import {
  courseCategory,
  courseLevel,
  courseStatus,
  newCourseSchema,
} from "@/lib/schemas";
import { TextEditor } from "@/components/text-editor/editor";
import { Uploader } from "@/components/file-uploader/uploader";
import { useTransition } from "react";
import { tryCatch } from "@/lib/utils/try-catch";
import { createCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<NewCourseType>({
    resolver: zodResolver(newCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      fileKey: "",
      smallDescription: "",
      category: "Development",
      duration: 0,
      price: 0,
      level: "Beginner",
      status: "Draft",
    },
  });

  function onSubmit(values: NewCourseType) {
    console.log(values);
    startTransition(async () => {
      const { data: response, error } = await tryCatch(createCourse(values));

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
      router.push("/admin/courses");
    });
  }

  return (
    <>
      <div className="flex gap-3 md:gap-6 items-center">
        <Button asChild size="icon" variant="outline">
          <Link href="/admin/courses">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Create a new Course</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>
            Provide information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const titleValue = form.getValues("title");
                    const slugValue = slugify(titleValue, {
                      lower: true,
                      strict: true,
                      trim: true,
                    });
                    form.setValue("slug", slugValue, { shouldValidate: true });
                  }}
                >
                  Generate slug <Sparkles />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-20 resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <Uploader value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseCategory.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevel.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration in minutes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isPending} className="min-w-36">
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Creating
                  </>
                ) : (
                  <>
                    <Plus /> Create Course
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
