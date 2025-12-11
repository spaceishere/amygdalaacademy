import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-foreground">
          LMS Платформ
        </Link>

        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost">Админ Самбар</Button>
                </Link>
              )}
              <span className="text-sm font-medium text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">
                  Гарах
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Нэвтрэх</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Бүртгүүлэх</Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
