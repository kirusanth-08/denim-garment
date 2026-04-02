import { Product } from '../../products/types/product';

export type LandingHero = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
};

export type LandingStat = {
  label: string;
  value: string;
};

export type LandingHighlight = {
  title: string;
  description: string;
};

export type LandingTestimonial = {
  quote: string;
  author: string;
  company: string;
};

export type LandingResponse = {
  hero: LandingHero;
  stats: LandingStat[];
  featuredProducts: Product[];
  highlights: LandingHighlight[];
  testimonials: LandingTestimonial[];
};
