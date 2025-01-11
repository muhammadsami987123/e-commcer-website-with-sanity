"use client";

import React, { useEffect, useState, use } from "react"; // Import `use` from React
import { client } from "@/sanity/lib/client";
import { fullProduct } from "../../../../interface";
import ImageGallery from "@/app/ImageGallery";
import { Star, Truck } from "lucide-react";
import AddToBag from "@/app/AddToBag/page";
import CheckoutNow from "@/app/CheckoutNow/page";

// Fetch product data
async function getData(slug: string): Promise<fullProduct | null> {
  const query = `*[_type == 'product' && slug.current == $slug][0] {
    _id,
    images[] {
      asset->{
        _id,
        url
      }
    },
    price,
    description,
    name,
    "slug": slug.current,
    price_id
  }`;

  const data = await client.fetch(query, { slug });
  console.log("Fetched Product Data:", data); // Debug fetched data
  return data || null;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params); // Unwrap the params promise
  const slug = resolvedParams.slug; // Access the slug property

  const [data, setData] = useState<fullProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          const productData = await getData(slug);
          setData(productData);
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Dependency on slug

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

  const imageUrls =
    data.images && data.images.length > 0
      ? data.images.map((image) => image.asset?.url || "/fallback.jpg")
      : ["/fallback.jpg"];

  console.log("Resolved Image URLs:", imageUrls);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ImageGallery images={imageUrls} />
          <div className="md:py-8">
            <div className="mb-2 md:mb-3">
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">{data.name}</h2>
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
                <span className="text-xl font-bold text-gray-800 md:text-2xl">${data.price}</span>
                <span className="mb-0.5 text-red-500 line-through">${data.price + 30}</span>
              </div>
              <span className="text-sm text-gray-500">Incl. VAT plus shipping</span>
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
                images={data.images} // Pass the Sanity images array
                name={data.name}
                key={`add-to-bag-${data._id}`}
                price_id={data.price_id}
                id={data._id}
              />
              <CheckoutNow
                currency="USD"
                price={data.price}
                description={data.description}
                image={imageUrls[0]} // Pass the first resolved image URL
                name={data.name}
                key={`checkout-now-${data._id}`}
                price_id={data.price_id}
                id={data._id}
              />
            </div>
            <p className="mt-12 text-base text-gray-500 tracking-wide">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
