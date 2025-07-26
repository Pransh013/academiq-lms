import Image from "next/image";
import Link from "next/link";
import { BarChart, Edit2, Timer } from "lucide-react";

import { AdminCourseType } from "@/app/data/admin/get-courses-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { construcUrl, formatDuration } from "@/lib/utils";

export function AdminCourseCard({
  id,
  title,
  smallDescription,
  fileKey,
  duration,
  price,
  level,
}: AdminCourseType) {
  return (
    <Card className="relative max-w-sm shadow-none bg-muted gap-4">
      <CardHeader>
        <Image
          src={construcUrl(fileKey)}
          alt="image placeholder"
          width={600}
          height={400}
          className="w-full rounded-lg aspect-video h-full object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {smallDescription}
        </CardDescription>
        <div className="space-x-4 flex items-center">
          <Badge variant="outline" className="py-1">
            <Timer />
            {formatDuration(duration)}
          </Badge>
          <Badge variant="outline" className="py-1">
            ₹ {`${price}`}
          </Badge>
          <Badge variant="outline" className="py-1">
            <BarChart />
            {level}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/admin/courses/${id}/edit`}>
            <Edit2 />
            Edit Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
