import { useEffect, useMemo, useRef, useState } from 'react'

function ImagePicker({ files, onChange, maxFiles, onError }) {
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef(null)

    const previews = useMemo(() => {
        return files.map((file) => URL.createObjectURL(file))
    }, [files])

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [previews])

    // Shared by both ways of adding images: the file dialog and drag and drop
    function addFiles(selected) {
        const images = selected.filter((file) => file.type.startsWith('image/'))

        if (images.length !== selected.length) {
            onError('Only image files are allowed')
            return
        }

        if (files.length + images.length > maxFiles) {
            onError(`You can add up to ${maxFiles} images`)
            return
        }

        onChange([...files, ...images])
    }

    // Way 1: choose files with the dialog
    function handleSelect(event) {
        const selected = Array.from(event.target.files)
        event.target.value = ''
        addFiles(selected)
    }

    // Way 2: drag files onto the zone
    function handleDragOver(event) {
        event.preventDefault()
        if (maxFiles > 0) setDragging(true)
    }

    function handleDragLeave() {
        setDragging(false)
    }

    function handleDrop(event) {
        event.preventDefault()
        setDragging(false)
        if (maxFiles <= 0) return
        addFiles(Array.from(event.dataTransfer.files))
    }

    function handleRemove(index) {
        onChange(files.filter((file, i) => i !== index))
    }

    let dropClass = 'image-picker__drop'
    if (dragging) dropClass += ' image-picker__drop--active'
    if (maxFiles <= 0) dropClass += ' image-picker__drop--disabled'

    return (
        <div className='image-picker'>
            <div
                className={dropClass}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <span className='image-picker__title'>Drag images here, or</span>
                <button
                    type='button'
                    className='image-picker__choose'
                    disabled={maxFiles <= 0}
                    onClick={() => inputRef.current.click()}
                >
                    Choose files
                </button>
                <span className='image-picker__hint'>Up to {maxFiles} images, 5MB each</span>
                <input
                    ref={inputRef}
                    type='file'
                    id='listingImages'
                    className='image-picker__input'
                    accept='image/*'
                    multiple
                    disabled={maxFiles <= 0}
                    onChange={handleSelect}
                    tabIndex={-1}
                    aria-label='Choose images'
                />
            </div>

            {previews.length > 0 && (
                <div className='image-picker__grid'>
                    {previews.map((url, index) => (
                        <div key={url} className='image-picker__item'>
                            <img src={url} alt={files[index].name} />
                            <button
                                type='button'
                                className='image-picker__remove'
                                aria-label={`Remove ${files[index].name}`}
                                onClick={() => handleRemove(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ImagePicker
