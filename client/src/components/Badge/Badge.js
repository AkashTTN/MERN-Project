import React, { useCallback } from 'react'

import './Badge.css'

const colorMap = {
    olive: 'bg-olive',
    maroon: 'bg-maroon',
    purple: 'bg-purple'
}

const Badge = React.memo(
    ({ showModal, name, data, color, fetchData }) => {

        const onClickHandler = useCallback(
            () => {
                fetchData(data.googleId)
                showModal(true)
            }, [showModal, fetchData, data]
        )

        return (
            <span className={`Badge ${colorMap[color]}`} onClick={onClickHandler} >
                {data[name.toLowerCase()].length}&nbsp;{name}
            </span>
        )
    }
)

export default Badge
