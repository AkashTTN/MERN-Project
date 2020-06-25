import React from 'react'

import './Modal.css'

const Modal = (props) => {
    return (
        <div id="my-modal" className="modal">
            <div className="modal-content">
                <div className="modal-header mb-15 flex-container">
                    <span onClick={props.closeModal} className="close">&times;</span>
                    <h2>{props.heading}</h2>
                </div>
                {
                    props.children
                }
                {/* <div className="modal-body">
                </div> */}
                <div className="modal-footer mt-15">
                    <button className="btn-primary" onClick={props.closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal