import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateCourseForm } from "./_components/create-course-form";

export default function NewCoursePage() {
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
          <CreateCourseForm />
        </CardContent>
      </Card>
    </>
  );
}
