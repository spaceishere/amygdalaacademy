import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ensure Button is installed (shadcn)
import { LayoutDashboard, BookOpen, Users, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-6 border-b border-primary/20">
          <h1 className="text-2xl font-bold">LMS Админ</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-4">
          <Link href="/admin">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Самбар
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Курсууд
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <Users className="mr-2 h-4 w-4" />
              Хэрэглэгчид
            </Button>
          </Link>
          <Link href="/admin/enrollments">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Элсэлтүүд
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-primary/20">
          <Link href="/api/auth/signout" className="w-full block">
            <Button variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Гарах
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background p-8">{children}</main>
    </div>
  );
}
