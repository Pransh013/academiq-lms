import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCoursesAdmin } from "@/app/data/admin/get-courses-admin";
import { AdminCourseCard } from "./_components/admin-course-card";

export default async function CoursesPage() {
  const courses = await getCoursesAdmin();
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Your Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/new">Create a Course</Link>
        </Button>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <AdminCourseCard {...course} key={course.id} />
        ))}
      </div>
    </>
  );
}
