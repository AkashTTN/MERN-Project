import React from 'react'

import './Card.css'

const Card = ({ content, title, image }) => {
    return (
        <div className="Card flex-container mb-15">
            {
                image &&
                <img className="CardImage" src={image}></img>
            }
            <div>
                <p className="CardTitle">{title}</p>
                <p className="CardContent">{content}</p>
            </div>
        </div>
    )
}

export default Card
