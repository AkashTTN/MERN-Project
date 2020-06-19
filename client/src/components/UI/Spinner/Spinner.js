import React from 'react'

import './Spinner.css'

const Spinner = ({ isMarginRequired }) => {
    return (
        <div className={isMarginRequired ? 'loader' : 'loader margin-none'}>
        </div>
    )
}

export default Spinner
