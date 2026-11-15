import { useEffect, useMemo } from 'react'

function ImagePicker({ files, onChange, maxFiles, onError }) {
    const previews = useMemo(() => {
        return files.map((file) => URL.createObjectURL(file))
    }, [files])

    useEffect(() => {
        return () => {
            previews.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [previews])

    function handleSelect(event) {
        const selected = Array.from(event.target.files)
        event.target.value = ''

        if (files.length + selected.length > maxFiles) {
            onError(`You can add up to ${maxFiles} images`)
            return
        }

        onChange([...files, ...selected])
    }

    function handleRemove(index) {
        onChange(files.filter((file, i) => i !== index))
    }

    return (
        <div>
            <label htmlFor='listingImages'>Images (up to {maxFiles}): </label>
            <input
                type='file'
                id='listingImages'
                accept='image/*'
                multiple
                disabled={maxFiles <= 0}
                onChange={handleSelect}
            />

            {previews.map((url, index) => (
                <div key={url}>
                    <img src={url} alt={files[index].name} width='80' />
                    <button type='button' onClick={() => handleRemove(index)}>Remove</button>
                </div>
            ))}
        </div>
    )
}

export default ImagePicker
