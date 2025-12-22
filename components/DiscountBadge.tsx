"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface DiscountBadgeProps {
  discountPercent: number;
  discountEndDate?: Date | null;
}

export function DiscountBadge({
  discountPercent,
  discountEndDate,
}: DiscountBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!discountEndDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(discountEndDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Дууссан");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} өдөр ${hours} цаг`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} цаг ${minutes} минут`);
      } else {
        setTimeLeft(`${minutes} минут`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [discountEndDate]);

  if (discountPercent <= 0) return null;

  return (
    <div className="space-y-2">
      <Badge variant="destructive" className="text-lg font-bold px-3 py-1">
        -{discountPercent}% ХЯМДРАЛ
      </Badge>
      {discountEndDate && timeLeft && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{timeLeft} үлдсэн</span>
        </div>
      )}
    </div>
  );
}

interface PriceDisplayProps {
  price: number;
  discountPercent: number;
}

export function PriceDisplay({ price, discountPercent }: PriceDisplayProps) {
  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? price * (1 - discountPercent / 100)
    : price;

  if (price === 0) {
    return <div className="text-lg font-bold text-foreground">Үнэгүй</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {price.toLocaleString()}₮
        </span>
      )}
      <span
        className={`font-bold ${
          hasDiscount ? "text-xl text-destructive" : "text-lg text-foreground"
        }`}
      >
        {Math.round(discountedPrice).toLocaleString()}₮
      </span>
    </div>
  );
}
