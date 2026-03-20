"use client";

import { EditorBlock } from "@/types/builder";
import { useEffect, useState } from "react";

export function CountdownTimerBlock({ block }: { block: EditorBlock }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (block.type !== "CountdownTimer") return;

    const targetDate = new Date(block.content.targetDate).getTime();

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(intervalId);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [block]);

  if (block.type !== "CountdownTimer") return null;

  return (
    <div className="py-12 px-4 text-center">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{block.content.title}</h3>
      <div className="flex justify-center gap-4">
        {[
          { label: "Дней", value: timeLeft.days },
          { label: "Часов", value: timeLeft.hours },
          { label: "Минут", value: timeLeft.minutes },
          { label: "Секунд", value: timeLeft.seconds }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center bg-gray-100 p-4 rounded-lg min-w-[80px]">
            <span className="text-3xl font-bold text-blue-600">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-sm text-gray-500 uppercase tracking-wide mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
