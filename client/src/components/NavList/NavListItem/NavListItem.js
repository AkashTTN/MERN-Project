import React from 'react'

import { NavLink } from "react-router-dom";

import './NavListItem.css'

const NavListItem = (props) => {

    return (
        <li className="border-bottom">
            <NavLink
                activeClassName="active"
                className="NavListItem flex-container"
                to={`/${props.name.replace(' ', '').toLowerCase()}`}
            >
                <span>{props.name}</span>
                <i className="fas fa-chevron-right"></i>
            </NavLink>
        </li>
    )
}

export default NavListItem