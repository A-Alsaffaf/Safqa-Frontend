import { useState } from "react";
import { buyNow } from "../../services/listingService";

// Buy button for a fixed-price listing or an auction. Calls the buy-now route, then asks the page to reload.
function BuyNowBox({ listing, onPurchased }) {
  // An auction sells at its buy now price, a fixed-price listing at its price
  const price = listing.type === "Auction" ? listing.buyNowPrice : listing.price;

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleBuy() {
    setError("");
    setMessage("");

    try {
      setSubmitting(true);
      await buyNow(listing._id);
      setMessage("Purchase complete. An order has been created for you.");
      if (onPurchased) await onPurchased();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Once sold, the page reloads with status "Sold": show the result instead of the button
  if (listing.status !== "Active") {
    return (
      <div>
        {message ? <p>{message}</p> : null}
        <p>This item is no longer available</p>
      </div>
    );
  }

  return (
    <div>
      <p>{error}</p>
      <p>{message}</p>
      <button type="button" className="btn-buy-now" onClick={handleBuy} disabled={submitting}>
        {submitting ? "Buying..." : `Buy now for BD ${price}`}
      </button>
    </div>
  );
}

export default BuyNowBox;
