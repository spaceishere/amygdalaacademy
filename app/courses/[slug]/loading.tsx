import Navbar from "@/components/Navbar";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-3 gap-8 animate-pulse">
          {/* Left: video / overview skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-lg bg-muted/40" />

            <div className="bg-card p-6 rounded shadow-sm border border-border space-y-3">
              <div className="h-6 w-1/3 rounded bg-muted/60" />
              <div className="h-4 w-3/4 rounded bg-muted/40" />
              <div className="h-4 w-2/3 rounded bg-muted/30" />
            </div>
          </div>

          {/* Right: sidebar skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-3">
              <div className="h-5 w-1/3 rounded bg-muted/60" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded bg-muted/20 p-3"
                  >
                    <div className="h-4 w-4 rounded-full bg-muted/60" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-muted/50" />
                      <div className="h-3 w-1/2 rounded bg-muted/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-3">
              <div className="h-5 w-1/4 rounded bg-muted/60" />
              <div className="h-4 w-2/3 rounded bg-muted/40" />
              <div className="h-4 w-1/2 rounded bg-muted/30" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
