"use client";

import { Button } from "@/components/ui/button";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import image from "next/image";
import { useShoppingCart } from "use-shopping-cart";

// import { ProductCart } from "@/app/AddToBag/page";

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
  const { id, name, price, images, currency, description, price_id } = props; {
  const { checkoutSingleItem } = useShoppingCart();

  function buyNow(priceId: string) {
    checkoutSingleItem(priceId);
  }

  const product = {
    name: name,
    description: description,
    price: price,
    currency: currency,
    image: image,
    price_id: price_id,
  };
  return (
    <Button
      variant="outline"
      onClick={() => {
        buyNow(product.price_id);
      }}
    >
      Checkout Now
    </Button>
  );
}
}