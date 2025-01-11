"use client";

import Image from "next/image";

interface ImageGalleryProps {
  images: string[]; // Array of image URLs
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  // Ensure at least one image or fallback to a placeholder
  const resolvedImages = images.length > 0 ? images : ["/fallback.jpg"];

  function setBigImage(image: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Small images for thumbnails */}
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        {resolvedImages.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              width={100}
              height={100}
              className="h-full w-full object-cover cursor-pointer"
              onClick={() => setBigImage(image)} // Update the main image when clicked
            />
          </div>
        ))}
      </div>

      {/* Main image display */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 lg:col-span-4">
        {resolvedImages[0] ? (
          <Image
            src={resolvedImages[0]}
            alt="Main product image"
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            No Image Available
          </div>
        )}

        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
          Sale
        </span>
      </div>
    </div>
  );
}
