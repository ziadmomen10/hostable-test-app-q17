import React from 'react';

interface V2CareerGallerySectionProps {
  data?: {
    images?: Array<{
      id: number;
      src: string;
      alt: string;
    }>;
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2CareerGallerySection: React.FC<V2CareerGallerySectionProps> = ({ data }) => {
  const images = data?.images ?? [
    { id: 1, src: 'https://c.animaapp.com/mjke8DFm/img/1.png', alt: 'Gallery image 1' },
    { id: 2, src: 'https://c.animaapp.com/mjke8DFm/img/2.png', alt: 'Gallery image 2' },
    { id: 3, src: 'https://c.animaapp.com/mjke8DFm/img/2-1.png', alt: 'Gallery image 3' },
    { id: 4, src: 'https://c.animaapp.com/mjke8DFm/img/1-1.png', alt: 'Gallery image 4' },
  ];

  return (
    <section
      className="w-full relative bg-white"
      aria-label="Gallery section"
    >
      <div className="w-full max-w-[1920px] mx-auto flex flex-col gap-6 md:gap-10 py-12 md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        {/* Row 1: narrow + wide */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
          {images[0] && (
            <img
              className="w-full md:w-[30%] h-[300px] md:h-[530px] object-cover rounded-2xl"
              alt={images[0].alt}
              src={images[0].src}
            />
          )}
          {images[1] && (
            <img
              className="w-full md:w-[70%] h-[300px] md:h-[530px] object-cover rounded-2xl"
              alt={images[1].alt}
              src={images[1].src}
            />
          )}
        </div>

        {/* Row 2: wide + narrow */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
          {images[2] && (
            <img
              className="w-full md:w-[70%] h-[300px] md:h-[530px] object-cover rounded-2xl"
              alt={images[2].alt}
              src={images[2].src}
            />
          )}
          {images[3] && (
            <img
              className="w-full md:w-[30%] h-[300px] md:h-[530px] object-cover rounded-2xl"
              alt={images[3].alt}
              src={images[3].src}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default V2CareerGallerySection;
