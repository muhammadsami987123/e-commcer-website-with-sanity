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
  image: string; // The image resolves to a URL string.
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

  const imageUrl = images?.[0] ? urlFor(images[0]) : "/fallback.jpg";

  const product: ProductCart = {
    id,
    name,
    price,
    image: imageUrl, // Always has a fallback image
    currency,
    description,
    price_id,
  };

  const handleAddToCart = () => {
    addItem(product);
    handleCartClick();
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
    >
      <div className="flex items-center">
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className="rounded-md mr-2"
        />
        Add To Cart
      </div>
    </Button>
  );
}