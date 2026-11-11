
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

function ReportDetails() {

    const [report, setReport] = useState(null)
    const { id } = useParams()

    async function getReport() {

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/reports/${id}`)
        setReport(response.data)

    }

    useEffect(() => {
        getReport()
    }, [])

    return (
        <div>
            <h1>Report Details</h1>

            {report ? <>
                <h2>Reason: {report.reason}</h2>
                <p>Description: {report.description}</p>
                <p>Target: {report.targetId?._id}</p>
                <p>Status: {report.status}</p>
            </> : <p>Loading....</p>}

        </div>
    )
}

export default ReportDetails
