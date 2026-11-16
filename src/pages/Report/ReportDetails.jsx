
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import ImageGallery from '../../components/listings/ImageGallery'
import {
    getReportById,
    updateReportStatus,
    deleteReport,
    deleteListing
} from '../../services/reportService'

function ReportDetails() {

    const [report, setReport] = useState(null)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    async function getReport() {
        setError('')
        setLoading(true)

        try {
            const data = await getReportById(id)
            setReport(data)
        } catch (err) {
            setReport(null)
            setError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not load report')
        }

        setLoading(false)
    }

    useEffect(() => {
        getReport()
    }, [id])

    async function handleUpdateStatus(status) {
        if (busy) return
        setActionError('')
        setBusy(true)

        try {
            await updateReportStatus(id, status)
            const data = await getReportById(id)
            setReport(data)
        } catch (err) {
            setActionError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not update or refresh report. Please reload before trying again.')
        }

        setBusy(false)
    }

    async function handleDelete() {
        if (busy) return

        if (window.confirm('Are you sure you want to delete this report?')) {
            setActionError('')
            setBusy(true)

            try {
                await deleteReport(id)
                navigate('/admin/reports')
            } catch (err) {
                setActionError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not delete report')
            }

            setBusy(false)
        }
    }

    async function handleDeleteListing() {
        if (busy || !report?.targetId || report.targetId.status === 'Removed') return

        if (window.confirm('Are you sure you want to delete this listing?')) {
            setActionError('')
            setBusy(true)

            try {
                await deleteListing(report.targetId._id)
                setReport(current => ({
                    ...current,
                    targetId: { ...current.targetId, status: 'Removed' }
                }))
            } catch (err) {
                setActionError(err.response?.data?.message || err.response?.data?.error || err.response?.data?.err || 'Could not remove listing')
            }

            setBusy(false)
        }
    }

    return (
        <div>
            <h1>Report Details</h1>

            {report ? (
                <>
                    <h2>Report Information</h2>
                    <p>Reason: {report.reason}</p>
                    <p>Report Description: {report.description}</p>
                    <p>Status: {report.status}</p>

                    <h2>Listing Details</h2>
                    <div className="report-listing-gallery">
                        <ImageGallery
                            key={id}
                            images={report.targetId?.images}
                            title={report.targetId?.title || 'Reported listing'}
                        />
                    </div>

                    <p>Listing Type: {report.targetType}</p>
                    <p>Title: {report.targetId?.title}</p>
                    <p>Description: {report.targetId?.description}</p>
                    <p>Condition: {report.targetId?.condition}</p>
                    <p>
                        {report.targetType === 'Auction' ? 'Current / Starting Bid: ' : 'Price: '}
                        {report.targetType === 'Auction'
                            ? (report.targetId?.currentBid ?? report.targetId?.startingBid ?? 'Not available')
                            : (report.targetId?.price ?? 'Not available')}
                    </p>
                    <p>Seller Name: {report.targetId?.seller?.username}</p>

                    <button disabled={busy} onClick={() => handleUpdateStatus('reviewed')}>
                        Review
                    </button>

                    <button disabled={busy} onClick={() => handleUpdateStatus('dismissed')}>
                        Dismiss
                    </button>

                    <button disabled={busy} onClick={handleDelete}>
                        Delete Report
                    </button>

                    {report.targetId && (
                        <button
                            onClick={handleDeleteListing}
                            disabled={busy || report.targetId.status === 'Removed'}
                        >
                            {report.targetId.status === 'Removed'
                                ? 'Listing Removed'
                                : 'Delete Listing'}
                        </button>
                    )}
                </>
            ) : (
                loading ? <p>Loading...</p> : <div role="alert">{error || 'Report not found'}</div>
            )}

            {actionError && <div role="alert">{actionError}</div>}
        </div>
    )
}

export default ReportDetails
