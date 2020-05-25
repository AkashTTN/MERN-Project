import React, { useCallback, useEffect, useState } from 'react'

import './Form.css'
import { submitForm } from '../../../store/actions'
import { connect } from 'react-redux'

const Form = ({ userEmail, userName, formType, submitForm, postSubmitted, complaintSubmitted }) => {

    const [numFiles, setNumFiles] = useState(0)
    const [files, setFiles] = useState('')
    const [formData, setFormData] = useState({})
    let form = null

    // reset formData on on changing form or when the component rerenders and if the form is submitted
    useEffect(
        () => {
            setFormData({})
            setNumFiles(0)
            setFiles('')
        },
        [formType, postSubmitted, complaintSubmitted]
    )

    const handleOnChange = useCallback(
        (e) => {
            // console.log('changed', e.target.name, 'value', e.target.value)
            const newFormData = { ...formData, [e.target.name]: e.target.value }
            setFormData(newFormData)
        },
        [formData]
    )

    const handleOnFileUpload = useCallback(
        (e) => {
            setFiles(e.target.files)
            setNumFiles(e.target.files.length)
        },
        [setFiles, setNumFiles]
    )

    const handleOnSubmit = useCallback(
        (e) => {
            e.preventDefault()
            const formDataToBeSent = new FormData();
            // Adding files to form data
            for (let i = 0; i < files.length; i++) {
                formDataToBeSent.append(`image${i + 1}`, files[i]);
            }

            // adding name and email to formData
            formData.email = userEmail
            formData.name = userName

            formDataToBeSent.append("data", JSON.stringify(formData))

            // for testing
            // fetch(constants.SERVER_URL, {
            //     method: "POST",
            //     body: formDataToBeSent
            // })

            submitForm({data: formDataToBeSent, type: formType})
        },
        [files, formData, submitForm, formType]
    )

    // updating number of files using vanila js
    // useEffect(
    //     () => {
    //         if (form) {
    //             inputElement = formType === 'Buzz'
    //                 ? document.getElementById("BuzzImageAttachment")
    //                 : document.getElementById("ImageAttachment")
    //             inputElement.addEventListener("change", getNumberOfUploadedFiles, false);
    //         }
    //     },
    //     [form]
    // )

    // const getNumberOfUploadedFiles = useCallback(
    //     () => {
    //         const fileList = inputElement.files
    //         setNumFiles(fileList.length)
    //     },
    //     [inputElement, setNumFiles]
    // )

    switch (formType) {
        case 'Complaint':

            form = (

                <form onSubmit={handleOnSubmit} >
                    <h3 className="FormHeader" >Complaint Box</h3>
                    <div className="form-group flex-container">
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="department">Select Department</label>

                            <select defaultValue={'none'} onChange={handleOnChange} className="ComplaintField" name="department" id="department">
                                <option value="none" disabled hidden></option>
                                <option value="admin">Admin</option>
                                <option value="management">Management</option>
                                <option value="hr">HR</option>
                                <option value="it">IT</option>
                            </select>

                        </div>
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="issueTitle">Issue Title</label>

                            <select defaultValue={'none'} onChange={handleOnChange} className="ComplaintField" name="issueTitle" id="issueTitle">
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
                            <input className="ComplaintField" onChange={handleOnChange} name="name" id="name" type="text" value={userName} disabled />
                        </div>
                        <div>
                            <label className="ComplaintFieldLabel" htmlFor="email" >Email Id</label>
                            <input className="ComplaintField" onChange={handleOnChange} name="email" id="email" type="email" value={userEmail} disabled />
                        </div>
                    </div>

                    <div className="form-group flex-container">
                        <label className="ComplaintFieldLabel" htmlFor="concern" >Your Concern</label>
                        <textarea id="concern" onChange={handleOnChange} name="concernText"></textarea>
                    </div>

                    <div className="form-group flex-container">
                        <div className="image-attachment-overlay">
                            <label htmlFor="myfile">Attachments{`(${numFiles})`}&nbsp;&nbsp;</label>
                            <i className="far fa-image"></i>
                        </div>
                        <input type="file" id="ImageAttachment" onChange={handleOnFileUpload} name="image" multiple accept="image/*" />
                    </div>

                    <div className="form-group flex-container">
                        <button id="SubmitComplaint" type="submit">Submit</button>
                    </div>

                </form>

            )
            break
        case 'Buzz':
            form = (

                <form onSubmit={handleOnSubmit}>
                    <h3 className="FormHeader" >Create Buzz</h3>
                    <div className="BuzzFormBody" >
                        <textarea id="buzz" onChange={handleOnChange} name="buzzText" placeholder="Share your thoughts..."></textarea>
                    </div>
                    <div className="BuzzFormFooter flex-container">
                        <select defaultValue={'none'} onChange={handleOnChange} className="BuzzCategory" name="buzzCategory" id="buzzCategory">
                            <option value="none" disabled hidden>
                                Category
                            </option>
                            <option value="lostAndFound">Lost & Found</option>
                            <option value="activity">Activity</option>
                        </select>

                        <div className="image-attachment-overlay">
                            <input type="file" onChange={handleOnFileUpload} id="BuzzImageAttachment" name="image" accept="image/*" />
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

const mapStateToProps = state => {
    return {
        postSubmitted: state.form.postSubmitted,
        complaintSubmitted: state.form.complaintSubmitted,
        userEmail: state.authData.user.email,
        userName: state.authData.user.name,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)