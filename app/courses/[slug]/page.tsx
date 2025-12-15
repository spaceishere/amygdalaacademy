import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { notFound } from "next/navigation";
import EnrollButton from "@/components/EnrollButton";
import { Lock, CirclePlay } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { episodeId?: string };
}) {
  const session = await auth();

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      episodes: {
        orderBy: { order: "asc" },
      },
      enrollments: {
        where: { userId: session?.user?.id },
      },
    },
  });

  if (!course) notFound();

  const isEnrolled = course.enrollments.length > 0;
  const realCount = await db.enrollment.count({
    where: { courseId: course.id },
  });
  const displayCount = realCount + course.fakeEnrollmentBonus;

  // Decide which episode to play
  // If searchParams.episodeId exists, verify access.
  // Else if enrolled, maybe auto-select first?
  // Else show overview.

  const activeEpisodeId = searchParams.episodeId;

  const activeEpisode = activeEpisodeId
    ? course.episodes.find((e: any) => e.id === activeEpisodeId) // eslint-disable-line @typescript-eslint/no-explicit-any
    : null;

  // Access check
  const canWatch = (episode: (typeof course.episodes)[0]) => {
    if (episode.isFreePreview) return true;
    if (isEnrolled) return true;
    return false;
  };

  const isLocked = activeEpisode && !canWatch(activeEpisode);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        {/* Header / Player Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeEpisode && !isLocked ? (
              <VideoPlayer
                videoUrl={activeEpisode.videoUrl}
                thumbnail={activeEpisode.thumbnailUrl}
                title={activeEpisode.title}
              />
            ) : (
              <div className="relative bg-primary aspect-video rounded-lg flex flex-col items-center justify-center text-primary-foreground p-6 text-center overflow-hidden">
                {activeEpisode ? (
                  <>
                    <Lock className="h-12 w-12 mb-4 text-primary-foreground/50" />
                    <h3 className="text-xl font-bold">Агуулга түгжигдсэн</h3>
                    <p className="text-primary-foreground/80 mb-4">
                      Энэ Epsoideыг үзэхийн тулд та элсэлтэй байх ёстой.
                    </p>
                    {!isEnrolled && (
                      <EnrollButton
                        courseId={course.id}
                        price={course.price}
                        isPublished={course.isPublished}
                      />
                    )}
                  </>
                ) : (
                  // Course Overview / Thumbnail
                  <>
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover opacity-50"
                      />
                    ) : null}
                    <div className="relative z-10 p-8 max-w-lg bg-black/60 rounded backdrop-blur-sm">
                      <h1 className="text-3xl font-bold mb-2">
                        {course.title}
                      </h1>
                      <p className="text-lg text-slate-200 mb-6">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4">
                        {!isEnrolled && (
                          <EnrollButton
                            courseId={course.id}
                            price={course.price}
                            isPublished={course.isPublished}
                          />
                        )}
                        {isEnrolled && (
                          <div className="bg-green-600 text-white px-4 py-2 rounded font-medium">
                            Элсэлтэй
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-card p-6 rounded shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                {activeEpisode ? activeEpisode.title : "хичээлын тойм"}
              </h2>
              <p className="text-muted-foreground">
                {activeEpisode ? activeEpisode.description : course.description}
              </p>
            </div>
          </div>

          {/* Sidebar: Episode List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <h3 className="font-bold text-lg mb-4 text-foreground">
                хичээлын агуулга
              </h3>
              <div className="space-y-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {course.episodes.map((episode: any, index: number) => {
                  const isAccessible = canWatch(episode);
                  const isActive = activeEpisodeId === episode.id;

                  return (
                    <Link
                      key={episode.id}
                      href={`/courses/${course.slug}?episodeId=${episode.id}`}
                      className={cn(
                        "flex items-center p-3 rounded cursor-pointer transition-colors",
                        isActive
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "hover:bg-muted",
                        !isAccessible && !isActive && "opacity-75"
                      )}
                    >
                      <div className="mr-3 text-muted-foreground text-sm font-mono w-6 text-center">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            isActive && "text-primary"
                          )}
                        >
                          {episode.title}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          {episode.isFreePreview && (
                            <Badge
                              variant="secondary"
                              className="mr-2 text-[10px] px-1 py-0 h-5"
                            >
                              Үнэгүй
                            </Badge>
                          )}
                          <span>Видео</span>
                        </div>
                      </div>
                      <div className="ml-2">
                        {isAccessible ? (
                          <CirclePlay
                            className={cn(
                              "h-4 w-4",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </Link>
                  );
                })}
                {course.episodes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    Одоогоор Epsoide байхгүй байна.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-4">
              <h3 className="font-bold mb-2 text-foreground">Дэлгэрэнгүй</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Элсэлтэй оюутан</span>
                  <span className="font-medium text-foreground">
                    {displayCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Сүүлийн шинэчлэл</span>
                  <span className="font-medium text-foreground">
                    {new Date(course.updatedAt).toLocaleDateString("mn-MN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
