import { useNavigate } from 'react-router'

function ReportButton({ listing }) {
  const navigate = useNavigate()
  let targetType = ''
  if (listing && listing.type) {
    targetType = listing.type.toLowerCase()
  }

  function handleClick() {
    navigate(`/reports/new?listingId=${listing._id}&targetType=${targetType}`)
  }

  return (
    <button type='button' className='btn-report' onClick={handleClick}>
      Report
    </button>
  )
}

export default ReportButton
