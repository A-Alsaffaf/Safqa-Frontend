
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getAllReports, updateReportStatus } from '../../services/reportService'

function AllReports() {

    const [reports, setReports] = useState([])

    async function loadReports() {
        const reports = await getAllReports()

        setReports(reports)
    }

    async function updateStatus(id, status) {
        await updateReportStatus(id, status)

        await loadReports()
    }

    useEffect(() => {
        loadReports()
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
