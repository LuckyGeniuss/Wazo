import React from "react";
import { TestimonialsBlock as TestimonialsBlockType } from "@/types/builder";
import { StarRating } from "@/components/ui/star-rating";

interface TestimonialsBlockProps {
  block: TestimonialsBlockType;
}

export function TestimonialsBlock({ block }: TestimonialsBlockProps) {
  const { title, description, testimonials } = block.content;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        {title && (
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            {description}
          </p>
        )}
        
        {testimonials.length === 0 ? (
          <p className="mt-12 text-gray-500 italic">Пока нет отзывов для отображения.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
                  <div className="-mt-6">
                    <div>
                      <StarRating rating={testimonial.rating} size={16} />
                    </div>
                    <p className="mt-5 text-base text-gray-500 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="mt-6">
                      <p className="text-base font-medium text-gray-900">
                        - {testimonial.author}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
