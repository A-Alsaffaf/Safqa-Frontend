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

function AuctionDetails({ listing, onBidPlaced, onAuctionEnd }) {
  const seller =
    typeof listing.seller === "object" && listing.seller !== null
      ? listing.seller.username
      : listing.seller;

  const currentBidder =
    typeof listing.currentBidder === "object" && listing.currentBidder !== null
      ? listing.currentBidder.username
      : listing.currentBidder;

  const winner =
    typeof listing.winner === "object" && listing.winner !== null
      ? listing.winner.username
      : listing.winner;

  const isActive = listing.status === "Active";

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

      <CountDown startsAt={listing.startsAt} endsAt={listing.endsAt} onEnd={onAuctionEnd} />

      <h3>Description</h3>
      <p>{listing.description}</p>

      {listing.status === "Sold" ? (
        <p>Sold to {winner} for BD {listing.currentBid}</p>
      ) : null}
      {listing.status === "Closed" ? <p>Auction ended with no bids</p> : null}

      {isActive ? <BidForm listing={listing} onBidPlaced={onBidPlaced} /> : null}
      {isActive ? <button>Buy now</button> : null}
      <button>Add to watchlist</button>
    </div>
  );
}

export default AuctionDetails;
