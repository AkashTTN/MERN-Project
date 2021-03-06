import React from 'react'
import NavListItem from './NavListItem/NavListItem'

import './NavList.css'

const NavList = React.memo(({ isAdmin, changeFeedMode }) => {
    return (
        <ul className="NavList" >
            <NavListItem name="BUZZ" changeFeed={changeFeedMode} />
            <NavListItem name="COMPLAINTS" changeFeed={changeFeedMode} />
            {
                isAdmin 
                ? <NavListItem name="RESOLVED" changeFeed={changeFeedMode} />
                : null
            }
        </ul>
    )
})

export default NavList