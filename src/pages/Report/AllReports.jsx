
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getAllReports } from '../../services/reportService'

function AllReports() {

    const [reports, setReports] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    async function loadReports() {
        setError('')
        setLoading(true)
        try {
            const data = await getAllReports()
            setReports(data)
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not load reports')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReports()
    }, [])

    return (
        <div>
            <h1>All Reports</h1>
            {loading && <p>Loading...</p>}
            {error && <div role="alert">{error}</div>}
            {!loading && !error && reports.length === 0 && <p>No reports found.</p>}

            {reports.map((report) => (
                <div key={report._id}>
                    <h3>Reason: {report.reason}</h3>
                    <p>Reporter: {report.reporter?.username}</p>
                    <p>Status: {report.status}</p>

                    <Link to={`/admin/reports/${report._id}`}>
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default AllReports
