import { useState } from 'react'
import { useNavigate } from "react-router";
import {createListing} from "../../services/listingService"

function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "fixed",        // "fixed" or "auction"
    condition: "used",    // "new", "used", or "damaged"
    price: "",            // fixed price only
    buyNowPrice: "",      // optional, auction only
    startingBid: "",      // auction only
    startsAt: "",         // auction only
    endsAt: "",           // auction only
    images: [],
  })

  const { title, description, type, condition, category, price, buyNowPrice, startingBid, startsAt, endsAt } = formData

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event){
      event.preventDefault();
      try {
        await createListing(formData);
        navigate('/listings')
      } catch (err) {
        console.log(err);
        setError(err.response.data.message);
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
        <input type="text" id="listingType" name="type" onChange={handleChange} value={type} />
        <br />

        <label htmlFor="listingCondition">Condition: </label>
        <input type="text" id="listingCondition" name="condition" onChange={handleChange} value={condition} />
        <br />

        <label htmlFor="listingPrice">Price: </label>
        <input type="number" id="listingPrice" name="price" onChange={handleChange} value={price} />
        <br />

        <label htmlFor="buyNowPrice">Buy Now Price: </label>
        <input type="number" id="buyNowPrice" name="buyNowPrice" onChange={handleChange} value={buyNowPrice} />
        <br />

        <label htmlFor="startingBid">Starting Bid Price: </label>
        <input type="number" id="startingBid" name="startingBid" onChange={handleChange} value={startingBid} />
        <br />

        <label htmlFor="startsAt">Starts at: </label>
        <input type="datetime-local" id="startsAt" name="startsAt" onChange={handleChange} value={startsAt} />
        <br />

        <label htmlFor="endsAt">Ends at: </label>
        <input type="datetime-local" id="endsAt" name="endsAt" onChange={handleChange} value={endsAt} />
        <br />

        <button>Submit Form</button>
      </form>
    </>
  )
}

export default CreateListing