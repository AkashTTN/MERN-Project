import React from 'react'

import './NavListItem.css'

const NavListItem = (props) => {

    const feedMode = props.name

    return (
        <li className="NavListItem flex-container" onClick={() => props.changeFeed(feedMode)} >
            <span>{props.name}</span>
            <i className="fas fa-chevron-right"></i>
        </li>
    )
}

export default NavListItem