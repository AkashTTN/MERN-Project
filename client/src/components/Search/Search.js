import React, { useState, useCallback } from 'react'

import { getUsers } from '../../store/actions'
import { connect } from 'react-redux'

import './Search.css'
import { Link } from 'react-router-dom'

const Search = ({ users, error, loading, getUsers }) => {

    const [searchText, setSearchText] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchTextError, setSearchTextError] = useState('')

    const onChange = useCallback(
        (e) => {
            setSearchText(e.target.value)
            setIsSearching(false)
            setSearchTextError(e.target.value.trim().length === 0 ? 'Empty search text' : '')
        },
        [setSearchText, setIsSearching, setSearchTextError]
    )

    const handleSearch = useCallback(
        () => {
            if (!searchTextError) {
                setIsSearching(true)
                getUsers({ name: searchText })
            }
        },
        [searchTextError, searchText, getUsers, setIsSearching]
    )

    let searchListContent = null

    if (error) {
        searchListContent = <p>Something went wrong</p>
    } else if (loading) {
        searchListContent = <p>Loading...</p>
    } else {
        if (users.length === 0) {
            searchListContent = <p>No users found</p>
        } else {
            searchListContent = users.map((user, index) => {
                return <li className="SearchResultsListItem" key={user}>
                    <Link to={'/user-profile/'+index}>
                        <p> {user.name}</p>
                        <p> {user.email}</p>
                    </Link>
                </li>
            })
        }
    }

    return (
        <div className="Search">
            <div className={searchTextError ? "SearchError SearchBox" : "SearchBox"}>
                <input
                    className="SearchInputField"
                    value={searchText}
                    onChange={onChange}
                    type="text"
                    placeholder="Search by name" />
                <i onClick={handleSearch} className="SearchIcon fas fa-search"></i>
                {isSearching &&
                    <span
                        className="CloseSearchIcon"
                        onClick={() => setIsSearching(false)}>
                        &#10005;&nbsp;&nbsp;
                    </span>
                }
            </div>
            {
                isSearching
                    ?
                    <ul className="SearchResultsList">
                        {searchListContent}
                    </ul>
                    : null
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users.users,
        error: state.users.error,
        loading: state.users.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: (data) => dispatch(getUsers(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
