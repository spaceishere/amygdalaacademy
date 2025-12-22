import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourseGrid } from "@/components/CourseGrid";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: { enrollments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroSection />

      <main id="courses" className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Хичээлүүд</h2>
          <p className="text-muted-foreground">
            Өөрт тохирсон хичээлээ сонгож, өнөөдөр суралцаж эхлээрэй
          </p>
        </div>

        <CourseGrid courses={courses} />
      </main>
    </div>
  );
}
