export const dynamic = "force-dynamic";

import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Шинэ хичээл үүсгэх
      </h1>
      <CourseForm />
    </div>
  );
}
