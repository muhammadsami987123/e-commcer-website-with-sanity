const handleCheckoutClick = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
  
    try {
      console.log("Preparing checkout with cart details:", cartDetails);
  
      const lineItems = Object.values(cartDetails ?? {}).map((entry) => {
        if (!entry.price_id) {
          throw new Error(`Missing price_id for product: ${entry.name}`);
        }
  
        return {
          price: entry.price_id, // Stripe price_id
          quantity: entry.quantity,
        };
      });
  
      console.log("Line items for Stripe checkout:", lineItems);
  
      // Redirect to Stripe Checkout
      const result = await redirectToCheckout({
        mode: "payment",
        lineItems: lineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      });
  
      if (result?.error) {
        console.error("Error during checkout:", result.error);
        alert(`Error during checkout: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Unexpected error during checkout:", error);
      alert(`Error during checkout: ${error.message}`);
    }
  };
  