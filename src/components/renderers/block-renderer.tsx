import { EditorBlock } from "@/types/builder";
import { ProductGrid } from "./product-grid";
import { Suspense } from "react";
import { TestimonialsBlock } from "@/modules/builder/components/testimonials-block";
import { VideoBlock } from "@/modules/builder/components/video-block";
import { ButtonBlock } from "@/modules/builder/components/button-block";
import { DividerBlock } from "@/modules/builder/components/divider-block";
import { CountdownTimerBlock } from "@/modules/builder/components/countdown-timer-block";
import { NewsletterFormBlock } from "@/modules/builder/components/newsletter-form-block";
import { MotionDiv } from "@/components/ui/motion-div";
import { HeroBannerBlock } from "@/modules/builder/components/hero-banner-block";
import { prisma } from "@/lib/prisma";

// Обертка для анимаций
function AnimationWrapper({ block, children }: { block: EditorBlock; children: React.ReactNode }) {
  const animation = block.settings?.animation || "none";
  
  if (animation === "none") return <>{children}</>;

  const variants = {
    "fade": { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
    "zoom-in": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  };

  const selectedVariant = variants[animation as keyof typeof variants] || variants["fade"];

  return (
    <MotionDiv
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        initial: selectedVariant.initial,
        animate: selectedVariant.animate,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </MotionDiv>
  );
}

// Новый async Server Component для BannerSlider
async function BannerSliderRenderer({ block, storeId }: { block: EditorBlock; storeId: string }) {
  const banners = await prisma.banner.findMany({
    where: { storeId, isActive: true, location: "HOME" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <HeroBannerBlock
      banners={banners}
      autoPlay={(block.content as any).autoPlay}
      interval={Number((block.content as any).interval) || 5000}
      showDots={(block.content as any).showDots}
    />
  );
}

export function BlockRenderer({ blocks, storeId, isInner = false }: { blocks: EditorBlock[], storeId: string, isInner?: boolean }) {
  if (!blocks || blocks.length === 0) {
    if (isInner) return null;
    return (
      <div className="py-20 text-center text-gray-500">
        Эта страница пока пуста
      </div>
    );
  }

  return (
    <div className="w-full">
      {blocks.map((block) => {
        // Адаптивность: скрытие блока
        const isHiddenOnMobile = block.settings?.hideOnMobile;
        const isHiddenOnDesktop = block.settings?.hideOnDesktop;
        
        let visibilityClasses = "";
        if (isHiddenOnMobile && isHiddenOnDesktop) visibilityClasses = "hidden";
        else if (isHiddenOnMobile) visibilityClasses = "hidden md:block";
        else if (isHiddenOnDesktop) visibilityClasses = "md:hidden";

        const renderContent = () => {
          switch (block.type) {
            case "Hero":
              return (
                <div key={block.id} className="py-24 px-8 text-center bg-gray-50">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                      {(block.content as any).title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      {(block.content as any).subtitle}
                    </p>
                  </div>
                </div>
              );
              
            case "Heading":
              return (
                <div key={block.id} className="py-8 px-8 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {(block.content as any).text}
                  </h2>
                </div>
              );
              
            case "Paragraph":
              return (
                <div key={block.id} className="py-4 px-8 max-w-4xl mx-auto">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {(block.content as any).text}
                  </p>
                </div>
              );
              
            case "Image":
              return (
                <div key={block.id} className="py-8 px-8 max-w-4xl mx-auto">
                  <img 
                    src={(block.content as any).src} 
                    alt={(block.content as any).alt || "Изображение"}
                    className="w-full h-auto object-cover rounded-xl shadow-md"
                  />
                </div>
              );
              
            case "ProductGrid":
              return (
                <div key={block.id} className="w-full">
                  <Suspense fallback={<div className="py-20 text-center text-gray-500">Загрузка товаров...</div>}>
                    <ProductGrid 
                      storeId={storeId} 
                      title={(block.content as any).title} 
                      limit={Number((block.content as any).limit)} 
                    />
                  </Suspense>
                </div>
              );
              
            case "BannerSlider":
              return (
                <Suspense fallback={<div className="py-20 text-center text-gray-500">Загрузка баннеров...</div>}>
                  <BannerSliderRenderer block={block} storeId={storeId} />
                </Suspense>
              );

            case "Testimonials":
              return (
                <TestimonialsBlock key={block.id} block={block as any} />
              );

            case "Video":
              return <VideoBlock key={block.id} block={block as any} />;
            
            case "Button":
              return <ButtonBlock key={block.id} block={block as any} />;

            case "Divider":
              return <DividerBlock key={block.id} />;
              
            case "CountdownTimer":
              return <CountdownTimerBlock key={block.id} block={block as any} />;
              
            case "NewsletterForm":
              return <NewsletterFormBlock key={block.id} block={block as any} />;

            case "Accordion":
              return (
                <div key={block.id} className="py-8 px-8 max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold mb-6">{(block.content as any).title}</h3>
                  <div className="space-y-2">
                    {((block as any).content.items || []).map((item: any, idx: number) => (
                      <details key={idx} className="group border border-gray-200 rounded-xl bg-white overflow-hidden transition-all hover:border-blue-200">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 list-none">
                          {item.question}
                          <span className="transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                        </summary>
                        <div className="p-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );

            case "DropdownMenu":
              return (
                <div key={block.id} className="py-4 px-8 flex justify-center">
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
                      {(block.content as any).label}
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                      {((block as any).content.items || []).map((item: any, idx: number) => (
                        <a key={idx} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );

            case "PopupBanner":
              return (
                <div key={block.id} className="hidden">
                  {/* Popup logic would typically be handled by a separate client component with state */}
                  {/* This is a simplified representation for the renderer */}
                </div>
              );

            case "Columns":
              return (
                <div key={block.id} className="w-full py-8 px-4 max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row flex-wrap w-full gap-4">
                    {(block as any).content.columns?.map((col: any) => (
                      <div 
                        key={col.id} 
                        className="flex-1 min-w-[250px]"
                        style={{ flexBasis: col.width === 'auto' ? 'auto' : col.width || '100%' }}
                      >
                        <BlockRenderer blocks={col.blocks || []} storeId={storeId} isInner={true} />
                      </div>
                    ))}
                  </div>
                </div>
              );

            case "Carousel":
              return (
                <div key={block.id} className="w-full relative overflow-hidden h-[400px]">
                  {/* Simplified Carousel for demonstration */}
                  <div className="flex transition-transform duration-500">
                    {((block as any).content.images || []).map((img: any, idx: number) => (
                      <img key={idx} src={img.src} alt={img.alt} className="w-full h-[400px] object-cover flex-shrink-0" />
                    ))}
                  </div>
                </div>
              );

            case "ImageGrid":
              return (
                <div key={block.id} className="py-8 px-8 max-w-6xl mx-auto">
                  <div 
                    className="grid" 
                    style={{ 
                      gridTemplateColumns: `repeat(${(block as any).content.columns || 3}, minmax(0, 1fr))`,
                      gap: (block as any).content.gap || '1rem'
                    }}
                  >
                    {((block as any).content.images || []).map((img: any, idx: number) => (
                      <img key={idx} src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-lg shadow-sm" />
                    ))}
                  </div>
                </div>
              );

            case "FAQ":
              return (
                <div key={block.id} className="py-12 px-8 max-w-3xl mx-auto">
                  <h3 className="text-3xl font-bold text-center mb-8">{(block.content as any).title}</h3>
                  <div className="space-y-4">
                    {((block as any).content.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h4 className="text-lg font-semibold mb-2">{item.question}</h4>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case "Pricing":
              return (
                <div key={block.id} className="py-16 px-8 bg-gray-50">
                  <div className="max-w-6xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-12">{(block.content as any).title}</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      {((block as any).content.plans || []).map((plan: any, idx: number) => (
                        <div key={idx} className={`bg-white rounded-2xl shadow-lg p-8 border ${plan.isPopular ? 'border-blue-500' : 'border-gray-200'} relative`}>
                          {plan.isPopular && (
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Популярный
                            </span>
                          )}
                          <h4 className="text-xl font-semibold mb-4">{plan.name}</h4>
                          <div className="text-4xl font-bold mb-6">{plan.price}</div>
                          <ul className="space-y-3 mb-8">
                            {(plan.features || []).map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <a href={plan.buttonHref || '#'} className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                            {plan.buttonText || 'Выбрать'}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );

            case "Features":
              return (
                <div key={block.id} className="py-16 px-8 max-w-6xl mx-auto">
                  <h3 className="text-3xl font-bold text-center mb-12">{(block.content as any).title}</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {((block as any).content.features || []).map((feature: any, idx: number) => (
                      <div key={idx} className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        {feature.icon && (
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
                            {feature.icon}
                          </div>
                        )}
                        <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        };

        return (
          <div key={block.id} className={visibilityClasses}>
            <AnimationWrapper block={block}>
              {renderContent()}
            </AnimationWrapper>
          </div>
        );
      })}
    </div>
  );
}
