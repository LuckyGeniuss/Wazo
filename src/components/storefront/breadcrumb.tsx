import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/lib/breadcrumb";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  storeSlug: string;
  className?: string;
}

export function Breadcrumb({ items, storeSlug, className = "" }: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-500 mb-4 ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2">
        {/* Перший елемент — Головна з іконкою */}
        <li>
          <Link
            href={`/${storeSlug}`}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Розділювач після головної */}
        {items.length > 0 && (
          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>
        )}

        {/* Прохід по всіх елементах крихт */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id || item.label} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    href={item.href || "#"}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                  )}
                </>
              ) : (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
