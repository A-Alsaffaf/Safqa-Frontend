import { useState } from "react";
import { placeBid } from "../../services/bidService";

function BidForm({ listing, onBidPlaced }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Next bid must beat the current bid, or meet the starting bid if there are no bids yet
  const hasBids = listing.currentBid != null;
  const minimumBid = hasBids ? listing.currentBid + 1 : listing.startingBid;

  function handleChange(event) {
    setError("");
    setMessage("");
    setAmount(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const bidAmount = Number(amount);
    if (!bidAmount || bidAmount < minimumBid) {
      setError(`Your bid must be at least BD ${minimumBid}`);
      return;
    }

    try {
      setSubmitting(true);
      await placeBid(listing._id, bidAmount);
      setAmount("");
      setMessage("Bid placed");
      if (onBidPlaced) await onBidPlaced();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Place a bid</h3>

      <p>{error}</p>
      <p>{message}</p>

      <label htmlFor="bidAmount">Your bid (min BD {minimumBid}): </label>
      <input
        type="number"
        id="bidAmount"
        name="amount"
        min={minimumBid}
        value={amount}
        onChange={handleChange}
      />
      <br />

      <button disabled={submitting}>{submitting ? "Placing bid..." : "Place bid"}</button>
    </form>
  );
}

export default BidForm;
