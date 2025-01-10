"use client";

import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { useShoppingCart } from "use-shopping-cart";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface ProductCart {
  id: string;
  name: string;
  price: number;
  image: string; // URL string for the image.
  currency: string;
  description: string;
  price_id: string;
}

export default function AddToBag(props: ProductCart & { images: SanityImageSource[] }) {
  const { id, name, price, images, currency, description, price_id } = props;
  const { addItem, handleCartClick } = useShoppingCart();

  const imageUrl = images?.[0] ? urlFor(images[0]).url() : "/fallback.jpg";

  const product: ProductCart = {
    id,
    name,
    price,
    image: imageUrl,
    currency,
    description,
    price_id,
  };

  const handleAddToCart = () => {
    addItem(product);
    handleCartClick();
  };

  return <Button onClick={handleAddToCart}>Add To Cart</Button>;
}
