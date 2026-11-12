
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import axios from 'axios'

function ReportForm() {

    const [searchParams] = useSearchParams()

    const listingId = searchParams.get('listingId')
    const targetType = searchParams.get('targetType')

    const [formData, setFormData] = useState({
        reason: '',
        description: ''
    })

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        await axios.post(
            `${import.meta.env.VITE_BACK_END_SERVER_URL}/listings/${listingId}/reports`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
    }

    return (
        <div>
            <h1>Report Listing</h1>
            <p>Listing Type: {targetType}</p>

            <form onSubmit={handleSubmit}>
                <label>Reason:</label>
                <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                />

                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <button type="submit">Submit Report</button>
            </form>
        </div>
    )
}

export default ReportForm
