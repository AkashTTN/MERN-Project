import React, { useEffect, useCallback, useRef } from 'react'

import './Carousel.css'
import defaultBuzzImage from '../../../assets/images/default-buzz-image.png' 


const Carousel = ({ imageArray }) => {

    let i = 0
    let timerId

    // const [images] = useState(imageArray)
    const imageElemRef = useRef(null)

    const changeImage = useCallback((imageArray) => {

        if (!imageArray || !imageElemRef.current) return

        imageElemRef.current.src = imageArray[i] || defaultBuzzImage

        if (timerId) {
            clearTimeout(timerId)
        }
        
        if (i < imageArray.length - 1) {
            i++
        } else {
            i = 0
        }

        timerId = setTimeout(() => changeImage(imageArray), 3000)

    }, [])

    useEffect(() => {
        changeImage(imageArray)
        // if (images) {
        // }
    }, [changeImage, imageArray])

    // useEffect(() => {

    //     (async function () {
    //         const images = await fetchImage(imageArray)
    //         setImages(images)
    //     })()

    // }, [setImages, imageArray])

    return (
        <div className="Carousel">
            <img ref={imageElemRef} className="CarouselImage" alt="buzz-pic" />
        </div>
    )
}

export default Carousel