export interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  text: string;
}

export interface CarouselProps {
  images: CarouselImage[];
  fadeDuration?: number;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}
