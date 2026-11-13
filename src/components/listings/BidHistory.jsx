import { useEffect, useState } from "react";
import { getBidsByListing } from "../../services/bidService";

// e.g. "12 Nov 2026, 9:00 am" in the viewer's local time
function formatDate(value) {
  if (!value) return "";

  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Lists every bid on an auction, highest first (the backend sorts them).
// `currentBid` is only used to reload the list when a new bid is placed.
function BidHistory({ listingId, currentBid }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getBidsByListing(listingId)
      .then((data) => {
        if (cancelled) return;
        setBids(data || []);
        setError("");
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listingId, currentBid]);

  return (
    <div>
      <h3>Bid history</h3>

      {loading ? <p>Loading bids...</p> : null}
      {error ? <p>Could not load bids: {error}</p> : null}
      {!loading && !error && bids.length === 0 ? <p>No bids yet</p> : null}

      {bids.length > 0 ? (
        <ol>
          {bids.map((bid, index) => (
            <li key={bid._id}>
              BD {bid.amount} by {bid.bidder?.username ?? "Unknown"} on{" "}
              {formatDate(bid.placedAt || bid.createdAt)}
              {index === 0 ? " (highest)" : ""}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export default BidHistory;
