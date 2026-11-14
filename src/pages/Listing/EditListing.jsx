import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getListingById, getListingEnums, updateListing } from "../../services/listingService";
import { getCategories } from "../../services/categoryService";

const MAX_CATEGORIES = 5;

// Turns a stored date into the "YYYY-MM-DDTHH:mm" text a datetime-local input needs (local time)
function toInputValue(value) {
  if (!value) return "";

  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// `user` is the logged-in user passed down from App.jsx (null when logged out)
function EditListing({ user }) {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState(null);
  const [enums, setEnums] = useState({ type: [], condition: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getListingById(listingId)
      .then((data) => {
        if (cancelled) return;
        setListing(data || null);

        if (data) {
          setFormData({
            title: data.title ?? "",
            description: data.description ?? "",
            condition: data.condition ?? "",
            category: data.category ?? [],
            price: data.price ?? "",
            buyNowPrice: data.buyNowPrice ?? "",
            startingBid: data.startingBid ?? "",
            startsAt: toInputValue(data.startsAt),
            endsAt: toInputValue(data.endsAt),
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getListingEnums()
      .then((data) => {
        if (!cancelled) setEnums(data);
      })
      .catch((err) => console.log(err));

    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => console.log(err));

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (loading) return <div>Loading...</div>;
  if (error && !listing) return <div>Error: {error}</div>;
  if (!listing) return <div>Listing not found</div>;

  const sellerId = typeof listing.seller === "object" ? listing.seller?._id : listing.seller;

  if (!user || user._id !== sellerId) {
    return <div>Only the seller can edit this listing</div>;
  }

  if (listing.status !== "Active") {
    return <div>This listing can no longer be edited (status: {listing.status})</div>;
  }

  const isAuction = listing.type === "Auction";
  // Once someone has bid, the bidding terms are locked
  const hasBids = isAuction && listing.currentBid != null;

  const { title, description, condition, category, price, buyNowPrice, startingBid, startsAt, endsAt } = formData;

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleCategoryChange(event) {
    setError("");
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);

    if (selected.length > MAX_CATEGORIES) {
      setError(`You can select up to ${MAX_CATEGORIES} categories`);
      return;
    }

    setFormData({ ...formData, category: selected });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Send only the fields this listing can change
    const changes = { title, description, condition, category };

    if (!isAuction) {
      changes.price = price;
    } else if (!hasBids) {
      changes.startingBid = startingBid;
      if (buyNowPrice) changes.buyNowPrice = buyNowPrice;
      if (startsAt) changes.startsAt = startsAt;
      changes.endsAt = endsAt;
    }

    try {
      setSaving(true);
      await updateListing(listingId, changes);
      navigate(`/listings/${listingId}`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1>Edit Listing</h1>
      <p>Type: {listing.type} (cannot be changed)</p>
      {hasBids ? <p>This auction has bids, so its bidding terms can no longer be changed.</p> : null}

      <p>{error}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="listingTitle">Title: </label>
        <input type="text" id="listingTitle" name="title" required onChange={handleChange} value={title} />
        <br />

        <label htmlFor="listingDescription">Description: </label>
        <input type="text" id="listingDescription" name="description" onChange={handleChange} value={description} />
        <br />

        <label htmlFor="listingCondition">Condition: </label>
        <select id="listingCondition" name="condition" onChange={handleChange} value={condition}>
          {enums.condition.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <br />

        <label htmlFor="listingCategory">Categories (up to {MAX_CATEGORIES}): </label>
        <select id="listingCategory" name="category" multiple onChange={handleCategoryChange} value={category}>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <br />

        {isAuction ? (
          <>
            <label htmlFor="startingBid">Starting Bid Price: </label>
            <input type="number" id="startingBid" name="startingBid" min="1" required disabled={hasBids} onChange={handleChange} value={startingBid} />
            <br />

            <label htmlFor="buyNowPrice">Buy Now Price (optional): </label>
            <input type="number" id="buyNowPrice" name="buyNowPrice" min="1" disabled={hasBids} onChange={handleChange} value={buyNowPrice} />
            <br />

            <label htmlFor="startsAt">Starts at (optional): </label>
            <input type="datetime-local" id="startsAt" name="startsAt" disabled={hasBids} onChange={handleChange} value={startsAt} />
            <br />

            <label htmlFor="endsAt">Ends at: </label>
            <input type="datetime-local" id="endsAt" name="endsAt" required disabled={hasBids} onChange={handleChange} value={endsAt} />
            <br />
          </>
        ) : (
          <>
            <label htmlFor="listingPrice">Price: </label>
            <input type="number" id="listingPrice" name="price" min="1" required onChange={handleChange} value={price} />
            <br />
          </>
        )}

        <button disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        <button type="button" onClick={() => navigate(`/listings/${listingId}`)}>Cancel</button>
      </form>
    </>
  );
}

export default EditListing;
