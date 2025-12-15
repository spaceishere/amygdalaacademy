import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  // Fetch stats
  const [totalUsers, totalCourses, totalEnrollments, recentUsers] =
    await Promise.all([
      db.user.count(),
      db.course.count(),
      db.enrollment.count(),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);

  const stats = [
    {
      title: "Нийт хэрэглэгч",
      value: totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Нийт хичээл",
      value: totalCourses,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Нийт элсэлт",
      value: totalEnrollments,
      icon: GraduationCap,
      href: "/admin/users",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Идэвхтэй",
      value: `${Math.round(
        (totalEnrollments / Math.max(totalUsers, 1)) * 100
      )}%`,
      icon: TrendingUp,
      href: "/admin",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Самбар</h1>
        <p className="text-muted-foreground mt-1">
          LMS Админ Самбарт тавтай морилно уу
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Сүүлийн бүртгүүлсэн</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Хэрэглэгч байхгүй байна
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {user.name || "Нэргүй"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("mn-MN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Түргэн үйлдлүүд</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/courses/new" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Шинэ хичээл үүсгэх
              </Button>
            </Link>
            <Link href="/admin/courses" className="block">
              <Button className="w-full justify-start" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Хичээлүүд удирдах
              </Button>
            </Link>
            <Link href="/admin/users" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Хэрэглэгчид харах
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
