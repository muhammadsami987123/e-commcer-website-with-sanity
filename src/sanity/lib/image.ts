// Correct import statements
import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { dataset, projectId } from '../env';

// Initialize the image URL builder
const builder = createImageUrlBuilder({ projectId, dataset });

// Helper function to generate image URL from Sanity image source
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
