import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';

import { getUsers, initialiseSocket, setProfileUserData } from '../../store/actions'
import { connect } from 'react-redux'

import './Search.css'

const Search = ({ users, error, loading, getUsers, currentUserId,
    socket, initialiseSocket, setProfileUserData }) => {

    const [searchText, setSearchText] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchCompleted, setSearchCompleted] = useState(false)
    const [searchTextError, setSearchTextError] = useState(false)

    const onChange = useCallback(
        (e) => {
            setSearchText(e.target.value)
            setIsSearching(true)
            setSearchCompleted(false)
            setSearchTextError(e.target.value.trim().length === 0)
        },
        [setSearchText, setIsSearching, setSearchTextError, setSearchCompleted]
    )

    const resetSearch = useCallback(
        () => {
            setIsSearching(false)
            setSearchTextError(false)
            setSearchCompleted(false)
            setSearchText('')
        },
        [setIsSearching, setSearchText, setSearchTextError, setSearchCompleted]
    )

    const handleSearch = useCallback(
        () => {
            if (searchTextError === false && isSearching) {
                setIsSearching(false)
                setSearchCompleted(true)
                getUsers({ name: searchText })
            }
        },
        [searchTextError, searchText, getUsers, isSearching, setIsSearching, setSearchCompleted]
    )

    const startChat = useCallback(
        (name, googleId) => {
            if (!socket) {
                return initialiseSocket()
            }
            console.log('socket message')
            socket.emit('create-new-chat', { userId: currentUserId, name, participantId: googleId })
        },
        [initialiseSocket, socket, currentUserId]
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
            searchListContent = users.map((user) => {
                return <li
                    onClick={() => setProfileUserData(user.googleId)}
                    className="SearchResultsListItem flex-container"
                    key={user.googleId} >
                    <Link to='/profile'>
                        <p> {user.name}</p>
                        <p> {user.email}</p>
                    </Link>
                    {
                        user.googleId !== currentUserId
                        && <i
                            onClick={() => startChat(user.name, user.googleId)}
                            className="StartChatIcon far fa-comment-alt">
                        </i>
                    }
                </li >
            })
        }
    }

    return (
        <div className="Search">
            <div className="SearchBox">
                <TextField
                    fullWidth
                    error={searchTextError}
                    label="Search"
                    size="small"
                    value={searchText}
                    onChange={onChange}
                    type="text"
                    placeholder="Search by name"
                    variant="outlined"
                    helperText={searchTextError && "Invalid search value."}
                    InputProps={{
                        startAdornment: (
                            <i
                                onClick={handleSearch}
                                className="SearchIcon fas fa-search fa-xs"
                            >
                            </i>
                        ),
                        endAdornment: (
                            <span
                                className="CloseSearchIcon"
                                onClick={resetSearch}>
                                &#10005;&nbsp;&nbsp;
                            </span>
                        )
                    }}
                />
            </div>
            {
                searchCompleted && !isSearching &&
                <ul className="SearchResultsList">
                    {searchListContent}
                </ul>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.search.users,
        error: state.search.error,
        loading: state.search.loading,
        currentUserId: state.authData.user.googleId,
        socket: state.socket.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: (data) => dispatch(getUsers(data)),
        initialiseSocket: () => { dispatch(initialiseSocket()) },
        setProfileUserData: (userToFetch) => dispatch(setProfileUserData(userToFetch))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
