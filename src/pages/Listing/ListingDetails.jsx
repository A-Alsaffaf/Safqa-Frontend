import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getListingById } from "../../services/listingService";
import FixedPriceDetails from "../../components/listings/FixedPriceDetails";
import AuctionDetails from "../../components/listings/AuctionDetails";

function ListingDetails() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getListingById(listingId)
      .then((data) => {
        if (!cancelled) setListing(data || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  // Reload the listing without showing the loading state (keeps the bid form mounted)
  async function refreshListing() {
    const data = await getListingById(listingId);
    setListing(data || null);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listing) return <div>Listing not found</div>;

  // The listing type is stored on the document as "Fixed" or "Auction"
  if (listing.type?.toLowerCase() === "fixed") {
    return <FixedPriceDetails listing={listing} />;
  }

  if (listing.type?.toLowerCase() === "auction") {
    return <AuctionDetails listing={listing} onBidPlaced={refreshListing} />;
  }

  return <div>Unknown listing type: {listing.type}</div>;
}

export default ListingDetails;
