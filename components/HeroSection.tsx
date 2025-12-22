"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Танилцуулга видеоны URL
  // Option 1: Local video file
  const introVideoUrl = "/uploads/intro-video.mp4";

  // Option 2: YouTube embed (uncomment to use)
  // const introVideoUrl = "https://www.youtube.com/embed/YOUR_VIDEO_ID";

  // Option 3: Vimeo embed (uncomment to use)
  // const introVideoUrl = "https://player.vimeo.com/video/YOUR_VIDEO_ID";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              <span>Монголын шилдэг онлайн сургалтын платформ</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Мэргэжлээ дээшлүүлж,
              <span className="text-primary block mt-2">Ирээдүйгээ бүтээ</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Мэргэжлийн багш нараас суралцаж, өөрийн хүссэн цагтаа, хүссэн
              газраасаа онлайн хичээл үзэж, шинэ ур чадвар эзэмшээрэй.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-2xl">10,000+</div>
                  <div className="text-sm text-muted-foreground">Сурагчид</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-2xl">50+</div>
                  <div className="text-sm text-muted-foreground">Хичээлүүд</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Star className="h-5 w-5 text-primary fill-current" />
                </div>
                <div>
                  <div className="font-bold text-2xl">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Үнэлгээ</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#courses">
                <Button size="lg" className="gap-2 group">
                  Одоо суралцаж эхлэх
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="h-4 w-4" />
                Танилцуулга үзэх
              </Button>
            </div>
          </div>

          {/* Right content - Image/Video placeholder */}
          <div className="relative">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border cursor-pointer group"
              onClick={() => setIsVideoOpen(true)}
            >
              {/* Placeholder for hero image/video */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-all group-hover:from-primary/30 group-hover:to-primary/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Танилцуулга видео үзэх
                  </p>
                </div>
              </div>
            </div>

            {/* Floating cards decoration */}
            <div className="hidden lg:block absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-2xl rotate-12 blur-xl" />
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-2xl -rotate-12 blur-xl" />
          </div>
        </div>
      </div>

      {/* Wave separator */}

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Танилцуулга видео</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black">
            {introVideoUrl.includes("youtube.com") ||
            introVideoUrl.includes("vimeo.com") ? (
              <iframe
                className="w-full h-full"
                src={introVideoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={introVideoUrl}
              >
                Таны browser видео тоглуулахыг дэмжихгүй байна.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
