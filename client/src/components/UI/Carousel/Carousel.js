import React, { useEffect, useState, useCallback } from 'react'

import fetchImage from '../../utils/fetchImage'

import './Carousel.css'


const Carousel = ({ imageArray, id }) => {

    let i = 0
    let timerId

    const [images, setImages] = useState(imageArray)

    const changeImage = useCallback((imageArray, id) => {

        if (!imageArray) return

        if (timerId) {
            clearTimeout(timerId)
        }

        document.getElementById('CarouselImage' + id).src = imageArray[i]

        if (i < imageArray.length - 1) {
            i++
        } else {
            i = 0
        }

        timerId = setTimeout(() => changeImage(imageArray, id), 3000)

    }, [])

    useEffect(() => {
        if (images) {
            changeImage(images, id)
        }
    }, [changeImage, images, id])

    useEffect(() => {

        (async function () {
            const images = await fetchImage(imageArray)
            setImages(images)
        })()

    }, [setImages, imageArray])

    return (
        <div className="Carousel">
            <img id={'CarouselImage' + id} alt="buzz-pic" />
        </div>
    )
}

export default Carousel
