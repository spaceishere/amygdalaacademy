"use client";

import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Smartphone,
  Palette,
  Code,
  Camera,
  TrendingUp,
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Social Marketing": <Megaphone className="h-4 w-4" />,
  "Digital Marketing": <Smartphone className="h-4 w-4" />,
  Branding: <Palette className="h-4 w-4" />,
  "Web Development": <Code className="h-4 w-4" />,
  Photography: <Camera className="h-4 w-4" />,
  Business: <TrendingUp className="h-4 w-4" />,
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Ангилал</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="gap-2"
        >
          Бүгд
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="gap-2"
          >
            {categoryIcons[category]}
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
