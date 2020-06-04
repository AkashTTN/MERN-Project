import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getImages } from '../../../store/actions'

import './Images.css'

const Images = ({ imageUrl, type, error, buzzImages, complaintImages, getImages }) => {

    let images = null
    let imageUrlArray = (type === 'complaint' ? complaintImages : buzzImages)

    useEffect(
        () => {
            if (imageUrl.length === 0) {
                return
            }
            getImages({ imageUrl, type })
        },
        [getImages, imageUrl, type]
    )

    if (error) {
        images = <p>Something went wrong</p>
    } else {
        if (imageUrl.length === 0) {
            if (type === 'complaint') {
                images = <p>No images to display</p>
            }
        } else {
            images = (
                imageUrlArray.map((item, index) => {
                    return (
                        <div key={index} >
                            <img src={item} alt={`complaint-${index + 1}`} />
                        </div>
                    )
                })
            )
        }
    }

    return (
        <div className="Images">
            {images}
        </div>
    )
}

const mapStateToProps = ({ images: { buzzError, complaintError, buzz, complaint } }) => {
    return {
        error: buzzError || complaintError,
        buzzImages: buzz,
        complaintImages: complaint
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getImages: (data) => dispatch(getImages(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Images)