import { useEffect, useState } from 'react'
import { useNavigate } from "react-router";
import {createListing, getListingEnums} from "../../services/listingService"
import {getCategories} from "../../services/categoryService"

const MAX_CATEGORIES = 5

// The fields that only belong to one listing type
const TYPE_FIELDS_RESET = {
  price: "",
  buyNowPrice: "",
  startingBid: "",
  startsAt: "",
  endsAt: "",
}

function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enums, setEnums] = useState({ type: [], condition: [] });
  const [categories, setCategories] = useState([]);

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
    type: "Fixed",        // "fixed" or "auction"
    condition: "Used",    // "new", "used", or "damaged"
    category: [],         // array of category ids, max 5
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
    const selected = Array.from(event.target.selectedOptions, (option) => option.value)

    if (selected.length > MAX_CATEGORIES) {
      setError(`You can select up to ${MAX_CATEGORIES} categories`);
      return;
    }

    setFormData({ ...formData, category: selected })
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
        await createListing(newListing);
        navigate('/listings')
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || err.message);
      }
    }

  return (
    <>
      <h1>Create Listing Page</h1>

      <p>{error}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="listingTitle">Title: </label>
        <input type="text" id="listingTitle" name="title" onChange={handleChange} value={title} />
        <br />

        <label htmlFor="listingDescription">Description: </label>
        <input type="text" id="listingDescription" name="description" onChange={handleChange} value={description} />
        <br />

        <label htmlFor="listingType">Type: </label>
        <select id="listingType" name="type" onChange={handleChange} value={type}>
          {enums.type.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
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
            <input type="number" id="startingBid" name="startingBid" min="1" required onChange={handleChange} value={startingBid} />
            <br />

            <label htmlFor="buyNowPrice">Buy Now Price (optional): </label>
            <input type="number" id="buyNowPrice" name="buyNowPrice" min="1" onChange={handleChange} value={buyNowPrice} />
            <br />

            <label htmlFor="startsAt">Starts at (optional, blank starts now): </label>
            <input type="datetime-local" id="startsAt" name="startsAt" onChange={handleChange} value={startsAt} />
            <br />

            <label htmlFor="endsAt">Ends at: </label>
            <input type="datetime-local" id="endsAt" name="endsAt" required onChange={handleChange} value={endsAt} />
            <br />
          </>
        ) : (
          <>
            <label htmlFor="listingPrice">Price: </label>
            <input type="number" id="listingPrice" name="price" min="1" required onChange={handleChange} value={price} />
            <br />
          </>
        )}

        <button>Submit Form</button>
      </form>
    </>
  )
}

export default CreateListing