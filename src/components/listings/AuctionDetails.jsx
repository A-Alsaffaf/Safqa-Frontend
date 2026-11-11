import BidForm from "./BidForm";
import CountDown from "../common/CountDown";

// e.g. "12 Nov 2026, 9:00 am" in the viewer's local time
function formatDate(value) {
  if (!value) return "Not set";

  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function AuctionDetails({ listing, onBidPlaced }) {
  const seller =
    typeof listing.seller === "object" && listing.seller !== null
      ? listing.seller.username
      : listing.seller;

  const currentBidder =
    typeof listing.currentBidder === "object" && listing.currentBidder !== null
      ? listing.currentBidder.username
      : listing.currentBidder;

  return (
    <div>
      <h2>{listing.title}</h2>

      <div>
        {listing.images?.length
          ? listing.images.map((src, i) => (
              <img key={i} src={src} alt={`${listing.title} ${i + 1}`} width={120} />
            ))
          : "No images"}
      </div>

      <p>Type: {listing.type}</p>
      <p>Condition: {listing.condition}</p>
      <p>Status: {listing.status}</p>
      <p>Starting bid: BD {listing.startingBid}</p>
      <p>Current bid: BD {listing.currentBid ?? "No bids yet"}</p>
      <p>Current bidder: {currentBidder ?? "None"}</p>
      {listing.buyNowPrice ? <p>Buy now: BD {listing.buyNowPrice}</p> : null}
      <p>Starts at: {formatDate(listing.startsAt)}</p>
      <p>Ends at: {formatDate(listing.endsAt)}</p>
      <p>Seller: {seller}</p>

      <CountDown />

      <h3>Description</h3>
      <p>{listing.description}</p>

      <BidForm listing={listing} onBidPlaced={onBidPlaced} />
      <button>Buy now</button>
      <button>Add to watchlist</button>
    </div>
  );
}

export default AuctionDetails;
