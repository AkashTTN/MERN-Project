import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getImages } from '../../../store/actions'

import classes from './Images.module.css'

const Images = ({
    imageUrl,
    buzzId = null,
    type,
    error,
    buzzImages,
    complaintImages, getImages }) => {

    let images = null
    let imageUrlArray = (type === 'complaint' ? complaintImages : buzzImages)

    useEffect(
        () => {
            if (imageUrl.length === 0) {
                return
            }
            getImages({ imageUrl, type, buzzId })
        },
        [getImages, imageUrl, type, buzzId]
    )

    if (error) {
        images = <p>Something went wrong</p>
    } else {
        if (imageUrl.length === 0) {
            if (type === 'complaint') {
                images = <p>No images to display</p>
            }
        } else {

            if (type === 'buzz') {
                images = (
                    <div className={classes.BuzzImage} >
                        < img name="BuzzImage" src={imageUrlArray[buzzId]} alt="buzz-pic" />
                    </div>
                )

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
    }

    return (
        <div className={classes.Images}>
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