import React from 'react';

interface V2JobGalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface V2JobGallerySectionProps {
  data?: {
    images?: V2JobGalleryImage[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

const defaultImages: (V2JobGalleryImage & { width: string; height: string })[] = [
  { id: '1', src: 'https://c.animaapp.com/L22lErDL/img/1.png', alt: 'Gallery image 1', width: '416px', height: '530px' },
  { id: '2', src: 'https://c.animaapp.com/L22lErDL/img/2.png', alt: 'Gallery image 2', width: '984px', height: '530px' },
  { id: '3', src: 'https://c.animaapp.com/L22lErDL/img/2-1.png', alt: 'Gallery image 3', width: '984px', height: '530px' },
  { id: '4', src: 'https://c.animaapp.com/L22lErDL/img/1-1.png', alt: 'Gallery image 4', width: '416px', height: '530px' },
];

export const V2JobGallerySection: React.FC<V2JobGallerySectionProps> = ({ data }) => {
  const images = data?.images ?? defaultImages;
  const row1 = images.slice(0, 2);
  const row2 = images.slice(2, 4);

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-start gap-[var(--spacing-10x)] pt-[var(--spacing-15x)] pr-[var(--spacing-60x)] pb-[var(--spacing-15x)] pl-[var(--spacing-60x)]">
        {[row1, row2].map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-[var(--spacing-10x)] relative self-stretch w-full flex-[0_0_auto]"
          >
            {row.map((image, index) => (
              <img
                key={image.id || `${rowIndex}-${index}`}
                className={`relative h-auto object-cover ${
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

export default V2JobGallerySection;
