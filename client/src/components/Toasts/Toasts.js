import React from 'react'

import { connect } from 'react-redux'

import Toast from '../UI/Toast/Toast'

const errorMessageMap = {
    fetchBuzzError: 'Error fetching posts.',
    fetchComplaintsError: 'Error fetching complaints.',
    formConfigError: 'Error fetching form data.',
    buzzImagesError: 'Error fetching buzz images.',
    complaintImagesError: 'Error fetching complaint images.',
    commentError: 'Something went wrong while adding/fetching comment(s).',
    requestsError: 'Something went wrong while updating/fetching request(s).',
    fetchChats: 'Error fetching chat history.',
    deleteChatError: 'Chat could not be deleted.',
    userSearchError: 'Error in searching user.',
    selectedUserError: 'Error fetching selected profile.',
    socketError: 'Error connecting with chat server.',
    socialDataError: `Error fetching user's social data.`
}

const boolenMap = {
    'false': false,
    'true': true
}

const Toasts = ({ errors }) => {
    return (
        Object.entries(errors).map(([errorName, errorValue]) => {
            return <Toast key={errorName} message={errorMessageMap[errorName]} open={boolenMap[errorValue]} />
        })
    )
}

const mapStateToProps = state => {
    return {
        errors: {
            fetchBuzzError: state.buzz.error,
            fetchComplaintsError: state.complaint.error,
            formConfigError: state.form.formConfigError,
            buzzImagesError: state.images.buzzError,
            complaintImagesError: state.images.complaintError,
            commentError: state.comment.error,
            requestsError: state.requests.error,
            fetchChats: state.chat.chatsError,
            deleteChatError: state.chat.deleteChatError,
            userSearchError: state.search.error,
            selectedUserError: state.search.selectedUserError,
            socketError: state.socket.error,
            socialDataError: state.social.error
        }
    }
}

export default connect(mapStateToProps)(Toasts)
