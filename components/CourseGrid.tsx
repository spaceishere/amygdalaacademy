"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { DiscountBadge, PriceDisplay } from "@/components/DiscountBadge";
import { CategoryFilter } from "@/components/CategoryFilter";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discountPercent: number;
  discountEndDate: Date | null;
  thumbnailUrl: string | null;
  fakeEnrollmentBonus: number;
  category: string | null;
  enrollments: Enrollment[];
}

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = courses
      .map((c) => c.category)
      .filter((c): c is string => c !== null && c !== "");
    return Array.from(new Set(cats));
  }, [courses]);

  // Filter courses by category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return courses;
    return courses.filter((course) => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  return (
    <>
      {categories.length > 0 && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          const realCount = course.enrollments.length;
          const displayCount = realCount + course.fakeEnrollmentBonus;

          return (
            <Card
              key={course.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
            >
              {course.thumbnailUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {course.discountPercent > 0 && (
                    <div className="absolute top-2 right-2">
                      <DiscountBadge
                        discountPercent={course.discountPercent}
                        discountEndDate={course.discountEndDate}
                      />
                    </div>
                  )}
                  {course.category && (
                    <div className="absolute top-2 left-2">
                      <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium">
                        {course.category}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="mr-1 h-4 w-4" />
                  <CountUp value={displayCount} />
                  <span className="ml-1">сурагч одоогоор үзэж байгаа</span>
                </div>
                <PriceDisplay
                  price={course.price}
                  discountPercent={course.discountPercent || 0}
                />
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${course.slug}`} className="w-full">
                  <Button className="w-full">Хичээл үзэх</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {selectedCategory
              ? `"${selectedCategory}" ангилалд хичээл олдсонгүй.`
              : "Одоогоор хичээл байхгүй байна. Удахгүй буцаж ирээрэй!"}
          </div>
        )}
      </div>
    </>
  );
}
