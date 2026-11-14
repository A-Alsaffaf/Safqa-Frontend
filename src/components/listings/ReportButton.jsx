import { useNavigate } from 'react-router'

function ReportButton({ listing }) {
  const navigate = useNavigate()
  let targetType = ''
  if (listing && listing.type) {
    targetType = listing.type.toLowerCase()
  }

  function handleClick() {
    // The route is /listings/:id/reports. ReportForm reads listingId and targetType from the query string.
    navigate(`/listings/${listing._id}/reports?listingId=${listing._id}&targetType=${targetType}`)
  }

  return (
    <button type='button' className='btn-report' onClick={handleClick}>
      Report
    </button>
  )
}

export default ReportButton
