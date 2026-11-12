import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { getListingById } from "../../services/listingService";
import FixedPriceDetails from "../../components/listings/FixedPriceDetails";
import AuctionDetails from "../../components/listings/AuctionDetails";

function ListingDetails() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMounted = useRef(true);

  // Lets the retry loop in handleAuctionEnd stop once the user leaves the page
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  // Called when the countdown reaches zero. Reloading the listing makes the server close the auction.
  // The device clock can be slightly ahead of the server's, so if the auction is still Active,
  // try again every 5 seconds (up to 6 times) until the server has closed it.
  async function handleAuctionEnd() {
    for (let attempt = 0; attempt < 6; attempt++) {
      const data = await getListingById(listingId);
      if (!isMounted.current) return;

      setListing(data || null);
      if (!data || data.status !== "Active") return;

      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (!isMounted.current) return;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listing) return <div>Listing not found</div>;

  // The listing type is stored on the document as "Fixed" or "Auction"
  if (listing.type?.toLowerCase() === "fixed") {
    return <FixedPriceDetails listing={listing} />;
  }

  if (listing.type?.toLowerCase() === "auction") {
    return (
      <AuctionDetails
        listing={listing}
        onBidPlaced={refreshListing}
        onAuctionEnd={handleAuctionEnd}
      />
    );
  }

  return <div>Unknown listing type: {listing.type}</div>;
}

export default ListingDetails;
