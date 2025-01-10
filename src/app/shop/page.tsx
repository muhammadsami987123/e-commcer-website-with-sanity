"use client";

import React, { useState, useEffect } from "react";
import { CiHeart, CiShare2, CiSliderHorizontal } from "react-icons/ci";
import FeatureSection from "../FeatureSection";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/sanity/lib/sanity";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  shippingInfo: string; // Added shipping information
  trackingLink: string; // Tracking link for each product
}

interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string } | string; // Handling dynamic slug formats
  description: string;
  price: string;
  image: string | null;
  shippingInfo: string;
  trackingLink: string;
}

function ProductSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null); // Error handling state

  useEffect(() => {
    const fetchProducts = async () => {
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

      try {
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
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header
        className="relative bg-cover bg-center h-64"
        style={{ backgroundImage: "url('/shop.jpg')" }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
      </header>

      {/* Filter and Products Count */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
            Filter
          </button>
          <p className="text-gray-600">Showing {products.length} products</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-2 px-10 rounded-lg">
        <h2 className="mx-auto py-1 text-3xl font-bold text-center mb-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="relative bg-gray-50 p-4 rounded-lg hover:shadow-xl transition-all"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/product/${product.slug}`} passHref>
                <div>
                  <Image
                    src={product.image}
                    alt={product.name || "Product"}
                    width={500}
                    height={500}
                    className="w-full h-60 object-cover mb-4 rounded-lg transition-all"
                  />
                </div>
              </Link>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-lg font-bold mb-2 text-gray-800">Rp {product.price}</p>
              <p className="text-sm text-gray-500 mb-4">{product.shippingInfo}</p>
              {hoveredIndex === index && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    title="Share"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                  >
                    <CiShare2 />
                  </button>
                  <button
                    title="Favorite"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                  >
                    <CiHeart />
                  </button>
                  <button
                    title="Options"
                    className="p-2 bg-white rounded-full shadow hover:scale-105"
                  >
                    <CiSliderHorizontal />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <FeatureSection />
    </div>
  );
}

export default ProductSection;