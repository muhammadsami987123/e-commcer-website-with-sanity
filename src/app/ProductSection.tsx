'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { CiHeart, CiShare2, CiSliderHorizontal } from "react-icons/ci";
import { sanityClient } from "@/sanity/lib/sanity";
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  shippingInfo: string;
  trackingLink: string;
}

interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string } | string;
  description: string;
  price: number;
  image: string | null;
  shippingInfo: string;
  trackingLink: string;
}

export default function ProductSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescriptions, setShowFullDescriptions] = useState<{ [key: string]: boolean }>({});
  const [visibleProducts, setVisibleProducts] = useState(4); // Number of initially visible products

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const query = `*[_type == "product"]{
          _id,
          name,
          slug,
          description,
          price,
          "image": image.asset->url,
          shippingInfo,
          trackingLink
        }`;

        const sanityProducts: SanityProduct[] = await sanityClient.fetch(query);
        const formattedProducts = sanityProducts.map((product) => ({
          id: product._id,
          name: product.name,
          slug: typeof product.slug === "object" ? product.slug.current : product.slug,
          description: product.description,
          price: product.price,
          image: product.image || "/placeholder.jpg",
          shippingInfo: product.shippingInfo || "Standard Shipping (3-5 days)",
          trackingLink: product.trackingLink || "#",
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseEnter = (index: number) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const toggleDescription = (id: string) => {
    setShowFullDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the visibility for this specific product
    }));
  };

  const handleShowMore = () => {
    setVisibleProducts((prev) => prev + 4); // Increase the number of visible products by 4
  };

  // Debugging logs
  console.log("Total Products:", products.length);
  console.log("Visible Products:", visibleProducts);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, visibleProducts).map((product, index) => {
          const truncatedDescription =
            product.description.length > 100
              ? `${product.description.slice(0, 100)}...`
              : product.description;

          return (
            <div
              key={product.id}
              className="relative bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/product/${product.slug}`} passHref>
                <div>
                  <Image
                    src={product.image}
                    alt={product.name || "Product"}
                    width={400}
                    height={400}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                </div>
              </Link>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">
                {showFullDescriptions[product.id] ? product.description : truncatedDescription}
                {product.description.length > 100 && (
                  <button
                    onClick={() => toggleDescription(product.id)}
                    className="text-sm text-primary hover:text-primary/80 ml-1"
                  >
                    {showFullDescriptions[product.id] ? "Show Less" : "Show More"}
                  </button>
                )}
              </p>
              <p className="text-lg font-bold mb-4">Rp {product.price}</p>
              <p className="text-sm text-gray-500">{product.shippingInfo}</p>
              {hoveredIndex === index && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    title="Share"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                    aria-label="Share"
                  >
                    <CiShare2 />
                  </button>
                  <button
                    title="Favorite"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                    aria-label="Favorite"
                  >
                    <CiHeart />
                  </button>
                  <button
                    title="Options"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                    aria-label="Options"
                  >
                    <CiSliderHorizontal />
                  </button>
                </div>
              )}
              <Link href={`/product/${product.slug}`} passHref>
                <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/80 transition-colors duration-300">
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {visibleProducts < products.length && (
        <div className="flex justify-center mt-8">
          <button
            className="text-white px-6 py-3 rounded-md text-lg font-bold bg-yellow-600 hover:bg-yellow-800 transition-colors"
            onClick={handleShowMore}
            aria-label="Show more products"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}