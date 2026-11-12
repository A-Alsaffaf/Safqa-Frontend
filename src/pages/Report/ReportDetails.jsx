
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'

function ReportDetails() {

    const [report, setReport] = useState(null)
    const { id } = useParams()

    async function getReport() {
        const response = await axios.get(
            `${import.meta.env.VITE_BACK_END_SERVER_URL}/admin/reports/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )

        console.log(response.data)
        setReport(response.data)
    }

    useEffect(() => {
        getReport()
    }, [id])

    return (
        <div>
            <h1>Report Details</h1>

            {report ? (
                <>
                    <h2>Reason: {report.reason}</h2>
                    <p>Description: {report.description}</p>
                    <p>Target: {report.targetId?._id}</p>
                    <p>Status: {report.status}</p>
                </>
            ) : (
                <p>Loading....</p>
            )}
        </div>
    )
}

export default ReportDetails
