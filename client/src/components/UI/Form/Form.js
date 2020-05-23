import React, { useCallback, useEffect, useState } from 'react'

import './Form.css'

const Form = ({ formType }) => {

    const [numFiles, setNumFiles] = useState(0)
    let form = null
    let inputElement = null

    useEffect(
        () => {
            if (form) {
                inputElement = formType === 'Buzz'
                    ? document.getElementById("BuzzImageAttachment")
                    : document.getElementById("ImageAttachment")
                inputElement.addEventListener("change", getNumberOfUploadedFiles, false);
            }
        },
        [form]
    )

    const getNumberOfUploadedFiles = useCallback(
        () => {
            const fileList = inputElement.files
            setNumFiles(fileList.length)
        },
        [inputElement, setNumFiles]
    )

    switch (formType) {
        case 'Complaint':

            form = (

                <form>
                    <h3 className="FormHeader" >Complaint Box</h3>
                    <div className="form-group flex-container">
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="departments">Select Department</label>

                            <select defaultValue={'none'} className="ComplaintField" name="departments" id="department">
                                <option value="none" disabled hidden></option>
                                <option value="admin">Admin</option>
                                <option value="management">Management</option>
                                <option value="hr">HR</option>
                                <option value="it">IT</option>
                            </select>

                        </div>
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="issueTitle">Issue Title</label>

                            <select defaultValue={'none'} className="ComplaintField" name="issueTitle" id="issueTitle">
                                <option value="none" disabled hidden></option>
                                <option value="hardware">Hardware</option>
                                <option value="infrastructure">Infrastructure</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group flex-container">
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="name" >Your Name</label>
                            <input className="ComplaintField" id="name" type="text" />
                        </div>
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="email" >Email Id</label>
                            <input className="ComplaintField" id="email" type="email" />
                        </div>
                    </div>

                    <div className="form-group flex-container">
                        <label className="ComplaintFieldLabel" htmlFor="concern" >Your Concern</label>
                        <textarea id="concern"></textarea>
                    </div>

                    <div className="form-group flex-container">
                        <div className="image-attachment-overlay">
                            <label htmlFor="myfile">Attachments{`(${numFiles})`}&nbsp;&nbsp;</label>
                            <i className="far fa-image"></i>
                        </div>
                        <input type="file" id="ImageAttachment" name="image" multiple accept="image/*" />
                    </div>

                    <div className="form-group flex-container">
                        <button id="SubmitComplaint" type="submit">Submit</button>
                    </div>

                </form>

            )
            break
        case 'Buzz':
            form = (

                <form>
                    <h3 className="FormHeader" >Create Buzz</h3>
                    <div className="BuzzFormBody" >
                        <textarea id="buzz" placeholder="Share your thoughts..."></textarea>
                    </div>
                    <div className="BuzzFormFooter flex-container">
                        <select defaultValue={'none'} className="BuzzCategory" name="buzzCategory" id="buzzCategory">
                            <option value="none" disabled hidden>
                                Category
                            </option>
                            <option value="lostAndFound">Lost & Found</option>
                            <option value="activity">Activity</option>
                        </select>

                        <div className="image-attachment-overlay">
                            <input type="file" id="BuzzImageAttachment" name="image" accept="image/*" />
                            <i className="far fa-image"></i>
                        </div>
                        &nbsp;{`${numFiles === 0 ? '' : '(Uploaded)'}`}

                        <div className="SubmitBuzz flex-container">
                            <button type="submit"></button>
                            <i className="fas fa-caret-right"></i>
                        </div>

                    </div>
                </form>

            )
            break
        default: form = <p>Wrong form type</p>
    }

    return (
        <div className="Form">
            {form}
        </div>
    )
}

export default Form