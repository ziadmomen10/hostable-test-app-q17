import React from 'react';

interface V2CareerGallery2SectionProps {
  data?: {
    images?: Array<{ id: string; src: string; alt: string }>;
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultImages = [
  { id: '1', src: 'https://c.animaapp.com/kkRHn6VJ/img/1.png', alt: 'Gallery image 1', width: '416px', height: '530px' },
  { id: '2', src: 'https://c.animaapp.com/kkRHn6VJ/img/2.png', alt: 'Gallery image 2', width: '984px', height: '530px' },
  { id: '3', src: 'https://c.animaapp.com/kkRHn6VJ/img/2-1.png', alt: 'Gallery image 3', width: '984px', height: '530px' },
  { id: '4', src: 'https://c.animaapp.com/kkRHn6VJ/img/1-1.png', alt: 'Gallery image 4', width: '416px', height: '530px' },
];

export const V2CareerGallery2Section: React.FC<V2CareerGallery2SectionProps> = ({ data }) => {
  const images = data?.images ?? defaultImages;

  // Row 1: narrow + wide, Row 2: wide + narrow
  const row1 = images.slice(0, 2);
  const row2 = images.slice(2, 4);

  return (
    <section className="w-full relative bg-white">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-start gap-[var(--spacing-10x)] pt-[var(--spacing-30x)] pb-[var(--spacing-15x)] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[240px]">
        {[row1, row2].map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-[var(--spacing-10x)] w-full"
          >
            {row.map((image, index) => (
              <img
                key={image.id || index}
                className={`relative h-auto object-cover rounded-lg ${
                  (rowIndex === 0 && index === 0) || (rowIndex === 1 && index === 1)
                    ? 'w-[30%]'
                    : 'flex-1'
                }`}
                alt={image.alt}
                src={image.src}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default V2CareerGallery2Section;
