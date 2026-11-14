
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import axios from 'axios'

function AllReports() {

    const [reports, setReports] = useState([])

    async function getAllReports() {
        const response = await axios.get(
            `${import.meta.env.VITE_BACK_END_SERVER_URL}/admin/reports`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        setReports(response.data)
    }

    async function updateStatus(id, status) {
        await axios.put(
            `${import.meta.env.VITE_BACK_END_SERVER_URL}/admin/reports/${id}`,
            { status: status },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        getAllReports()
    }

    useEffect(() => {
        getAllReports()
    }, [])

    return (
        <div>
            <h1>All Reports</h1>

            {reports.map((report) => (
                <div key={report?._id}>
                    <h3>Reason: {report.reason}</h3>
                    <p>Reporter: {report.reporter?.username}</p>
                    <p>Status: {report.status}</p>

                    <Link to={`/admin/reports/${report?._id}`}>
                        View Details
                    </Link>

                    <button onClick={() => updateStatus(report._id, 'reviewed')}>
                        Review
                    </button>

                    <button onClick={() => updateStatus(report._id, 'dismissed')}>
                        Dismiss
                    </button>
                </div>
            ))}
        </div>
    )
}

export default AllReports
