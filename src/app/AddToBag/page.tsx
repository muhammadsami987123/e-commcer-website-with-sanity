"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useShoppingCart } from "use-shopping-cart";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface ProductCart {
  id: string;
  name: string;
  price: number;
  image: string; // Resolved image URL for the cart
  currency: string;
  description: string;
  price_id: string;
}

interface AddToBagProps extends Omit<ProductCart, "image"> {
  images: SanityImageSource[]; // Images specific to this component, fetched from Sanity.
}

export default function AddToBag(props: AddToBagProps) {
  const { id, name, price, images, currency, description, price_id } = props;
  const { addItem, handleCartClick } = useShoppingCart();

  // Resolve the main product image URL or fallback
  const imageUrl = images?.[0]?._ref ? urlFor(images[0]).url() : "/fallback.jpg";

  // Construct product object for the shopping cart
  const product: ProductCart = {
    id,
    name,
    description,
    price,
    currency,
    image: imageUrl, // Pass the resolved image URL
    price_id,
  };

  const handleAddToCart = () => {
    addItem(product); // Add the product to the cart
    handleCartClick(); // Optionally open the cart modal
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center"
    >

      Add To Cart
    </Button>
  );
}
