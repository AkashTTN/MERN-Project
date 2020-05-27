import React from 'react'

import { Link } from "react-router-dom";

import './NavListItem.css'

const NavListItem = (props) => {

    return (
        <Link className="NavListItem flex-container" to={`/${props.name.toLowerCase()}`} >
            <span>{props.name}</span>
            <i className="fas fa-chevron-right"></i>
        </Link>
    )
}

export default NavListItem