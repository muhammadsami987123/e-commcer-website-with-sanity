import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlFor = (source: SanityImageSource) => {
  if (!source || !source._ref) {
    console.error("Invalid image source:", source);
    return "/fallback.jpg"; // Return fallback for invalid source
  }
  return builder.image(source);
};
