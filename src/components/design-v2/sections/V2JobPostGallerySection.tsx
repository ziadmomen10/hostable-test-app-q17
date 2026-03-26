import React from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface V2JobPostGallerySectionProps {
  data?: {
    images?: GalleryImage[];
  };
  sectionId?: string;
  isEditing?: boolean;
}

export const V2JobPostGallerySection: React.FC<V2JobPostGallerySectionProps> = ({ data }) => {
  const { items: images, getItemProps, SortableWrapper } = useArrayItems<GalleryImage>(
    'images',
    data?.images ?? []
  );

  const row1 = images.slice(0, 2);
  const row2 = images.slice(2, 4);

  return (
    <section className="w-full relative bg-colors-neutral-25">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-start gap-[var(--spacing-4x)] py-[80px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <SortableWrapper>
          <div className="flex flex-col items-start gap-[var(--spacing-4x)] self-stretch w-full">
            {[row1, row2].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center gap-[var(--spacing-4x)] relative self-stretch w-full flex-[0_0_auto]"
              >
                {row.map((image, colIndex) => {
                  const absoluteIndex = rowIndex * 2 + colIndex;
                  const isNarrow =
                    (rowIndex === 0 && colIndex === 0) ||
                    (rowIndex === 1 && colIndex === 1);
                  return (
                    <div
                      key={image.id}
                      {...getItemProps(absoluteIndex)}
                      className={`${isNarrow ? 'w-[30%] shrink-0' : 'flex-1'} overflow-hidden rounded-2xl`}
                    >
                      <img
                        className="relative w-full h-auto object-cover"
                        alt={image.alt}
                        src={image.src}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </SortableWrapper>
      </div>
    </section>
  );
};

export default V2JobPostGallerySection;
