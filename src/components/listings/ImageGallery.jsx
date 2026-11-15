import { useState } from 'react'

// Main image with a row of thumbnails under it. Clicking a thumbnail shows that image.
function ImageGallery({ images, title }) {
  const [selected, setSelected] = useState(0)

  if (!images || images.length === 0) {
    return <div className='listing-gallery'>No images</div>
  }

  // Keeps the index valid if the list of images ever gets shorter
  const current = Math.min(selected, images.length - 1)

  let thumbs = null
  if (images.length > 1) {
    thumbs = (
      <div className='gallery__thumbs'>
        {images.map((src, i) => {
          let thumbClass = 'gallery__thumb'
          if (i === current) thumbClass += ' gallery__thumb--active'

          return (
            <button
              key={src}
              type='button'
              className={thumbClass}
              onClick={() => setSelected(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-pressed={i === current}
            >
              <img src={src} alt='' />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className='gallery'>
      <div className='gallery__main'>
        <img src={images[current]} alt={`${title} ${current + 1}`} />
      </div>
      {thumbs}
    </div>
  )
}

export default ImageGallery
