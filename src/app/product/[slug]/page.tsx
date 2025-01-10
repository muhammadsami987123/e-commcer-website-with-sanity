"use client";

import React, { useEffect, useState, use } from "react"; // Import `use`
import { client } from "@/sanity/lib/client";
import { fullProduct } from "../../../../interface";
import ImageGallery from "@/app/ImageGallery";
import { Star, Truck } from "lucide-react"; // Removed unused imports
import AddToBag from "@/app/AddToBag/page";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import CheckoutNow from "@/app/CheckoutNow/page";

async function getData(slug: string): Promise<fullProduct | null> {
  const query = `*[_type == 'product' && slug.current == $slug][0] {
    _id,
    images,
    price,
    description,
    name,
    "slug": slug.current,
    price_id,
  }`;

  console.log('Running query:', query);
  const data = await client.fetch(query, { slug });

  console.log('Fetched data:', data);
  return data || null;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>; // `params` is a Promise
}) {
  const [data, setData] = useState<fullProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrap the `params` Promise using `use`
  const resolvedParams = use(params);
  const slug = resolvedParams.slug; // Access `slug` from the unwrapped `params`

  useEffect(() => {
    console.log('Fetching product with slug:', slug);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          const productData = await getData(slug);
          if (productData !== null) {
            setData(productData);
          } else {
            console.log("Product not found");
          }
        } else {
          console.log("Slug is not provided");
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Use `slug` in the dependency array

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
      </div>
    );
  }

  const imageUrls = data.images?.map((image: SanityImageSource) => urlFor(image).url()) || [];
  // Removed unused `firstImage` variable

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ImageGallery images={imageUrls} />
          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {data.name}
              </h2>
            </div>
            <div className="mb-6 flex items-center md:mb-10">
              <button className="rounded-full bg-blue-600 flex items-center gap-2 py-1 px-3">
                <span className="text-sm text-white">4.2</span>
                <Star className="h-6 w-6 text-white" />
              </button>
              <span className="text-sm text-gray-600 font-medium transition duration-200 hover:text-gray-800 px-2">
                56 Ratings
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-800 md:text-2xl">
                  ${data.price}
                </span>
                <span className="mb-0.5 text-red-500 line-through">
                  ${data.price + 30}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Incl. VAT plus shipping
              </span>
            </div>
            <div className="mb-6 flex items-center gap-2 text-gray-500">
              <Truck className="w-6 h-6" />
              <span className="text-sm">2-4 Day Shipping</span>
            </div>
            <div className="flex gap-2.5">
              <AddToBag
                currency="USD"
                price={data.price}
                description={data.description}
                image={data.images}
                name={data.name}
                key={`add-to-bag-${data._id}`}
                price_id={data.price_id}
              />
              <CheckoutNow
                currency="USD"
                price={data.price}
                description={data.description}
                image={data.images}
                name={data.name}
                key={`checkout-now-${data._id}`}
                price_id={data.price_id}
              />
            </div>
            <p className="mt-12 text-base text-gray-500 tracking-wide">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}