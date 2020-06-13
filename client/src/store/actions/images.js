import * as actionTypes from './actionTypes'

export const getImages = ({ imageUrl, type, buzzId = null }) => {
    return (dispatch) => {

        if (type === 'complaint') {
            dispatch({ type: actionTypes.GET_COMPLAINT_IMAGES })
        } else {
            dispatch({ type: actionTypes.GET_BUZZ_IMAGES })
            if (!buzzId) {
                return dispatch({ type: actionTypes.GET_BUZZ_IMAGES_FAILED })
            }
        }

        let localImageUrlArray = imageUrl.map(async (item) => {

            let localUrl = await fetch(item)
                .then(res => res.blob())
                .then(image => {
                    return URL.createObjectURL(image)
                })

            return localUrl

        })

        Promise.all([...localImageUrlArray])
            .then(res => {

                if (type === 'complaint') {
                    return dispatch({
                        type: actionTypes.GET_COMPLAINT_IMAGES_SUCCESS,
                        payload: { images: res }
                    })
                } else if (type === 'buzz') {
                    return dispatch({
                        type: actionTypes.GET_BUZZ_IMAGES_SUCCESS,
                        payload: { buzzId, images: res }
                    })
                }
                
            })
            .catch(err => {
                console.log(err)
                if (type === 'complaint') {
                    return dispatch({ type: actionTypes.GET_COMPLAINT_IMAGES_FAILED })
                } else if (type === 'buzz') {
                    return dispatch({ type: actionTypes.GET_BUZZ_IMAGES_FAILED })
                }
            })

    }
}