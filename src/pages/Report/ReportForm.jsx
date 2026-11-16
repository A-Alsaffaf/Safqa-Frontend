
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { createReport } from '../../services/reportService'

function ReportForm() {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
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

        if (submitting) return

        setMessage('')
        setError('')

        if (!formData.reason.trim() || !formData.description.trim()) {
            setError('Reason and description are required')
            return
        }

        setSubmitting(true)

        try {
            await createReport(listingId, formData)
            setMessage('Report submitted successfully!')
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not submit report')
        }

        setSubmitting(false)
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

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                </button>

                {error && <div role="alert">{error}</div>}
                <p role="status">{message}</p>
            </form>
        </div>
    )
}

export default ReportForm
