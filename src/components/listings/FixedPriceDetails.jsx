import BuyNowBox from "./BuyNowBox";

function FixedPriceDetails({ listing, onPurchased }) {
  const seller =
    typeof listing.seller === "object" && listing.seller !== null
      ? listing.seller.username
      : listing.seller;

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
      <p>Price: BD {listing.price}</p>
      {listing.buyNowPrice ? <p>Buy now: BD {listing.buyNowPrice}</p> : null}
      <p>Seller: {seller}</p>

      <h3>Description</h3>
      <p>{listing.description}</p>

      <BuyNowBox listing={listing} onPurchased={onPurchased} />
      <button>Add to watchlist</button>
    </div>
  );
}

export default FixedPriceDetails;
