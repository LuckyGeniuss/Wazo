export type EditorBlock = 
  | HeroBlock 
  | HeadingBlock 
  | ParagraphBlock 
  | ImageBlock 
  | ProductGridBlock 
  | BannerSliderBlock 
  | FeaturedProductsBlock 
  | TestimonialsBlock 
  | VideoBlock 
  | ButtonBlock 
  | DividerBlock
  | CarouselBlock
  | ImageGridBlock
  | FAQBlock
  | PricingBlock
  | FeaturesBlock
  | ColumnsBlock
  | CountdownTimerBlock
  | NewsletterFormBlock
  | AccordionBlock
  | DropdownMenuBlock
  | PopupBannerBlock
  | GridContainerBlock;

export interface BaseBlock {
  id: string;
  type: BlockType;
  settings?: {
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
    animation?: "fade" | "slide-up" | "zoom-in" | "none";
    shapeDividerTop?: string;
    shapeDividerBottom?: string;
  };
  styles?: {
    backgroundColor?: string;
    color?: string;
    gradient?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
}

export type BlockType = 
  | "Hero" 
  | "Heading" 
  | "Paragraph" 
  | "Image" 
  | "ProductGrid"
  | "BannerSlider"
  | "FeaturedProducts"
  | "Testimonials"
  | "Video"
  | "Button"
  | "Divider"
  | "Carousel"
  | "ImageGrid"
  | "FAQ"
  | "Pricing"
  | "Features"
  | "Columns"
  | "CountdownTimer"
  | "NewsletterForm"
  | "Accordion"
  | "DropdownMenu"
  | "PopupBanner"
  | "GridContainer";

export interface HeroBlock extends BaseBlock {
  type: "Hero";
  content: {
    title: string;
    subtitle: string;
  };
}

export interface HeadingBlock extends BaseBlock {
  type: "Heading";
  content: {
    text: string;
  };
}

export interface ParagraphBlock extends BaseBlock {
  type: "Paragraph";
  content: {
    text: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: "Image";
  content: {
    src: string;
    alt: string;
  };
}

export interface ProductGridBlock extends BaseBlock {
  type: "ProductGrid";
  content: {
    title: string;
    limit: string;
  };
}

export interface BannerSliderBlock extends BaseBlock {
  type: "BannerSlider";
  content: {
    autoPlay: boolean;
    interval: string;
    showDots: boolean;
  };
}

export interface FeaturedProductsBlock extends BaseBlock {
  type: "FeaturedProducts";
  content: {
    title: string;
    limit: string;
    showStoreName: boolean;
  };
}

export interface TestimonialsBlock extends BaseBlock {
  type: "Testimonials";
  content: {
    title?: string;
    description?: string;
    testimonials: {
      id: string;
      text: string;
      author: string;
      rating: number;
    }[];
  };
}

export interface VideoBlock extends BaseBlock {
  type: "Video";
  content: {
    src: string;
  };
}

export interface ButtonBlock extends BaseBlock {
  type: "Button";
  content: {
    text: string;
    href: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: "Divider";
  content: {};
}

export interface CarouselBlock extends BaseBlock {
  type: "Carousel";
  content: {
    images: { src: string; alt: string; href?: string }[];
  };
}

export interface ImageGridBlock extends BaseBlock {
  type: "ImageGrid";
  content: {
    images: { src: string; alt: string; href?: string }[];
    columns: string;
    gap: string;
  };
}

export interface FAQBlock extends BaseBlock {
  type: "FAQ";
  content: {
    title: string;
    items: { question: string; answer: string }[];
  };
}

export interface PricingBlock extends BaseBlock {
  type: "Pricing";
  content: {
    title: string;
    plans: {
      name: string;
      price: string;
      features: string[];
      buttonText: string;
      buttonHref: string;
      isPopular?: boolean;
    }[];
  };
}

export interface FeaturesBlock extends BaseBlock {
  type: "Features";
  content: {
    title: string;
    features: { title: string; description: string; icon?: string }[];
  };
}

export interface Column {
  id: string;
  width: string; // e.g., "col-span-6" or "50%"
  blocks: EditorBlock[];
}

export interface ColumnsBlock extends BaseBlock {
  type: "Columns";
  content: {
    columns: Column[];
  };
}

export interface CountdownTimerBlock extends BaseBlock {
  type: "CountdownTimer";
  content: {
    title: string;
    targetDate: string; // ISO date string
  };
}

export interface NewsletterFormBlock extends BaseBlock {
  type: "NewsletterForm";
  content: {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
  };
}

export interface AccordionBlock extends BaseBlock {
  type: "Accordion";
  content: {
    title: string;
    items: { question: string; answer: string }[];
  };
}

export interface DropdownMenuBlock extends BaseBlock {
  type: "DropdownMenu";
  content: {
    label: string;
    items: { label: string; href: string }[];
  };
}

export interface PopupBannerBlock extends BaseBlock {
  type: "PopupBanner";
  content: {
    title: string;
    message: string;
    buttonText: string;
    buttonHref: string;
  };
  settings?: BaseBlock["settings"] & {
    trigger?: "onLoad" | "onExitIntent";
    delayInSeconds?: number;
  };
}

export interface GridContainerBlock extends BaseBlock {
  type: "GridContainer";
  content: {
    columns: number;
    gap: string;
    items: {
      id: string;
      colSpan: number;
      rowSpan: number;
      blocks: EditorBlock[];
    }[];
  };
}

