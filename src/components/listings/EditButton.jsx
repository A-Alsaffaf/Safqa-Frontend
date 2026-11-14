import { useNavigate } from 'react-router'

// Shown only to the seller of an Active listing. Opens the edit page.
// `user` is the logged-in user passed down from App.jsx (null when logged out).
function EditButton({ listing, user }) {
  const navigate = useNavigate()

  let sellerId = listing.seller
  if (typeof listing.seller === 'object' && listing.seller) {
    sellerId = listing.seller._id
  }

  if (!user || user._id !== sellerId || listing.status !== 'Active') return null

  return (
    <button
      type='button'
      className='btn-edit'
      onClick={() => navigate(`/listings/${listing._id}/edit`)}
    >
      Edit listing
    </button>
  )
}

export default EditButton
