import React from 'react'

import Card from './Card/Card'

import './Cards.css'

const Cards = ({ data = {} }) => {
    return (
        <div className="Cards flex-container">
            {
                data.map((item, index) => {
                    return (
                        <Card
                            key={index}
                            content={item.content}
                            image={item.image}
                            title={item.title}
                        />
                    )
                })
            }
        </div>
    )
}

export default Cards
