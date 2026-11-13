import { useNavigate } from "react-router";

// Button that opens the report form for a listing. The report model stores the type in lowercase
// ("auction" or "fixed"), while the listing stores it as "Auction" or "Fixed".
function ReportButton({ listing }) {
  const navigate = useNavigate();
  const targetType = listing.type?.toLowerCase();

  function handleClick() {
    navigate(`/reports/new?listingId=${listing._id}&targetType=${targetType}`);
  }

  return <button onClick={handleClick}>Report this listing</button>;
}

export default ReportButton;
