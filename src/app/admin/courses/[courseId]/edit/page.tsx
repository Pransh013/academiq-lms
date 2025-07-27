import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getCourseAdmin } from "@/app/data/admin/get-course-admin";
import { EditCourseForm } from "./_components/edit-course-form";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseAdmin(courseId);

  return (
    <>
      <div className="flex gap-3 md:gap-6 items-center">
        <Button asChild size="icon" variant="outline">
          <Link href="/admin/courses">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Edit Course</h1>
      </div>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Make changes to your course here. Click update when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <EditCourseForm data={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Manage the course chapters and lessons.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* TODO: Add your course structure management UI here */}
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
