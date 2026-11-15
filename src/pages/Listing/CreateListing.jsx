import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from "react-router";
import {getCategories} from "../../services/categoryService"
import {createListing, getListingEnums, uploadImages} from "../../services/listingService"
import ImagePicker from "../../components/listings/ImagePicker"

const MAX_IMAGES = 5
const MAX_DESCRIPTION = 100   // matches the Listing model (20-100 characters)
const TYPE_FALLBACK = ["Fixed", "Auction"]

// The fields that only belong to one listing type
const TYPE_FIELDS_RESET = {
  price: "",
  buyNowPrice: "",
  startingBid: "",
  startsAt: "",
  endsAt: "",
}

// "Fixed" is shown as "Fixed price" to match the wireframe
function typeLabel(value) {
  return value === "Fixed" ? "Fixed price" : value
}

// Prices are in Bahraini dinar, shown with three decimals (fils)
function formatBD(value) {
  const n = Number(value)
  if (!value || Number.isNaN(n)) return "BD ---"
  return `BD ${n.toFixed(3)}`
}

function formatEnd(value) {
  if (!value) return "Not set"
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true,
  })
}

function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [enums, setEnums] = useState({ type: [], condition: [] });
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getListingEnums()
      .then(setEnums)
      .catch((err) => console.log(err));

    getCategories()
      .then(setCategories)
      .catch((err) => console.log(err));
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Fixed",        // "Fixed" or "Auction"
    condition: "Used",    // "New", "Used", or "Damaged"
    category: [],         // array of category ids (the form picks one)
    price: "",            // fixed price only
    buyNowPrice: "",      // optional, auction only
    startingBid: "",      // auction only
    startsAt: "",         // auction only
    endsAt: "",           // auction only
    images: [],
  })

  const { title, description, type, condition, category, price, buyNowPrice, startingBid, startsAt, endsAt } = formData

  // Which set of fields to show
  const isAuction = type === "Auction"
  const typeOptions = enums.type.length ? enums.type : TYPE_FALLBACK

  // The first chosen photo is shown in the preview card
  const coverUrl = useMemo(() => (files.length ? URL.createObjectURL(files[0]) : ""), [files])

  useEffect(() => {
    return () => {
      if (coverUrl) URL.revokeObjectURL(coverUrl)
    }
  }, [coverUrl])

  function handleChange(event) {
    setError("");
    const { name, value } = event.target

    // Switching the type clears the other type's fields so old values are not submitted
    if (name === "type") {
      setFormData({ ...formData, type: value, ...TYPE_FIELDS_RESET })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  function handleCategoryChange(event) {
    setError("");
    const { value } = event.target
    setFormData({ ...formData, category: value ? [value] : [] })
  }

  async function handleSubmit(event){
      event.preventDefault();
      // Send only the fields that belong to the chosen type
      const newListing = {
        title,
        description,
        type,
        condition,
        category,
        images: formData.images,
      }

      if (isAuction) {
        newListing.startingBid = startingBid
        if (buyNowPrice) newListing.buyNowPrice = buyNowPrice
        if (startsAt) newListing.startsAt = startsAt
        newListing.endsAt = endsAt
      } else {
        newListing.price = price
      }

      try {
        setPublishing(true)
        if (files.length > 0) {
          newListing.images = await uploadImages(files)
        }
        await createListing(newListing);
        navigate('/listings')
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || err.message);
        setPublishing(false)
      }
    }

  return (
    <div className="listing-page">
      <div className="listing-page__head">
        <h1>Create listing</h1>
        <span className="lf-hint">Fields marked * are required</span>
      </div>

      {error ? <p className="lf-error" role="alert">{error}</p> : null}

      <form className="listing-form" onSubmit={handleSubmit}>
        {/* ---------- Left column: what is being sold ---------- */}
        <div className="listing-form__col">
          <div className="lf-field">
            <label className="lf-label" htmlFor="listingTitle">Title *</label>
            <input
              className="lf-input"
              type="text"
              id="listingTitle"
              name="title"
              minLength={3}
              maxLength={80}
              required
              aria-describedby="titleHelp"
              onChange={handleChange}
              value={title}
            />
            <span className="lf-hint" id="titleHelp">3-80 characters. Include brand and model.</span>
          </div>

          <div className="lf-field">
            <label className="lf-label" htmlFor="listingCategory">Category</label>
            <select
              className="lf-input"
              id="listingCategory"
              name="category"
              onChange={handleCategoryChange}
              value={category[0] ?? ""}
            >
              <option value="">Choose a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <fieldset className="lf-group lf-group--field">
            <legend>Condition *</legend>
            <div className="lf-choice-row">
              {enums.condition.map((value) => (
                <label key={value} className="lf-radio">
                  <input
                    type="radio"
                    name="condition"
                    value={value}
                    checked={condition === value}
                    onChange={handleChange}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
            <span className="lf-hint">Damaged items can be listed and show a Damaged tag.</span>
          </fieldset>

          <div className="lf-field">
            <label className="lf-label" htmlFor="listingDescription">
              Description * <span className="lf-count">{description.length}/{MAX_DESCRIPTION}</span>
            </label>
            <textarea
              className="lf-input lf-textarea"
              id="listingDescription"
              name="description"
              minLength={20}
              maxLength={MAX_DESCRIPTION}
              required
              aria-describedby="descHelp"
              onChange={handleChange}
              value={description}
            />
            <span className="lf-hint" id="descHelp">20-{MAX_DESCRIPTION} characters.</span>
          </div>

          <div className="lf-field">
            <div className="lf-photos-head">
              <span className="lf-label">Photos</span>
              <span className="lf-hint">{files.length} of {MAX_IMAGES} added</span>
            </div>
            <ImagePicker files={files} onChange={setFiles} maxFiles={MAX_IMAGES} onError={setError} />
            <span className="lf-hint">1-{MAX_IMAGES} photos. The first photo is the cover.</span>
          </div>
        </div>

        {/* ---------- Right column: how it is sold (changes with the type) ---------- */}
        <div className="listing-form__col">
          <fieldset className="lf-group lf-group--field lf-type">
            <legend>Listing type</legend>
            <div className="lf-toggle">
              {typeOptions.map((value) => (
                <label key={value} className="lf-toggle__option">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={type === value}
                    onChange={handleChange}
                  />
                  <span>{typeLabel(value)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {isAuction ? (
            <>
              <div className="lf-field">
                <label className="lf-label" htmlFor="startingBid">Starting bid (BD) *</label>
                <input className="lf-input" type="number" id="startingBid" name="startingBid" min="1" step="0.001" required onChange={handleChange} value={startingBid} />
                <span className="lf-hint">Up to three decimals (fils).</span>
              </div>

              <div className="lf-field">
                <label className="lf-label" htmlFor="buyNowPrice">Buy-now price (optional)</label>
                <input className="lf-input" type="number" id="buyNowPrice" name="buyNowPrice" min="1" step="0.001" onChange={handleChange} value={buyNowPrice} />
              </div>

              <div className="lf-field">
                <label className="lf-label" htmlFor="startsAt">Starts at (optional)</label>
                <input className="lf-input" type="datetime-local" id="startsAt" name="startsAt" onChange={handleChange} value={startsAt} />
                <span className="lf-hint">Leave blank to start now.</span>
              </div>

              <div className="lf-field">
                <label className="lf-label" htmlFor="endsAt">Ends at *</label>
                <input className="lf-input" type="datetime-local" id="endsAt" name="endsAt" required onChange={handleChange} value={endsAt} />
              </div>
            </>
          ) : (
            <div className="lf-field">
              <label className="lf-label" htmlFor="listingPrice">Price (BD) *</label>
              <input className="lf-input" type="number" id="listingPrice" name="price" min="1" step="0.001" required onChange={handleChange} value={price} />
              <span className="lf-hint">Up to three decimals (fils).</span>
            </div>
          )}

          <div className="lf-preview" aria-label="Listing preview">
            <span className="lf-preview__label">Preview</span>
            <div className="lf-preview__photo">
              {coverUrl ? <img src={coverUrl} alt="Cover photo preview" /> : <span>Listing photo</span>}
            </div>
            <strong className="lf-preview__title">{title || "Your listing title"}</strong>
            <div className="lf-preview__row">
              <span>{isAuction ? "Starting bid" : "Price"}</span>
              <span className="lf-preview__price">{formatBD(isAuction ? startingBid : price)}</span>
            </div>
            {isAuction ? (
              <div className="lf-preview__row">
                <span>Ends</span>
                <span>{formatEnd(endsAt)}</span>
              </div>
            ) : null}
          </div>

          <button type="submit" className="lf-submit" disabled={publishing}>
            {publishing ? "Publishing..." : "Publish listing"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing
