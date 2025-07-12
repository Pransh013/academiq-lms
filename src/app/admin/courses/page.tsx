import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Your Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/new">Create a Course</Link>
        </Button>
      </div>
    </>
  );
}
