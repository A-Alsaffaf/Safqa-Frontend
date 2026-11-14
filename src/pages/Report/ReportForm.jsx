
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { createReport } from '../../services/reportService'


function ReportForm() {
const [message, setMessage] = useState('')
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
if (!formData.reason.trim() || !formData.description.trim()) {
    return
}
        await createReport(listingId, formData)
        
        setMessage('Report submitted successfully!')
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
                    required
                />

                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Submit Report</button>
                <p>{message}</p>
            </form>
        </div>
    )
}

export default ReportForm
