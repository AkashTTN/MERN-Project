import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { submitForm } from '../../../store/actions'

import './Form.css'

const Form = ({
    userEmail,
    userName,
    formType,
    formConfig,
    submitForm,
    postSubmitted,
    complaintSubmitted,
    formConfigError
}) => {

    const [numFiles, setNumFiles] = useState(0)
    const [files, setFiles] = useState('')
    const [formData, setFormData] = useState({
        department: '',
        concernText: '',
        issueTitle: '',
        buzzCategory: '',
        buzzText: ''
    })
    const [fileKey, setFileKey] = useState(Date.now());

    let form = null

    const resetForm = useCallback(
        () => {
            setFormData({
                department: '',
                concernText: '',
                issueTitle: '',
                buzzCategory: '',
                buzzText: ''
            })
            setNumFiles(0)
            setFiles('')
        },
        [setFormData, setNumFiles, setFiles]
    )

    // reset form on changing form type
    useEffect(
        () => {
            resetForm()
        },
        [resetForm, formType]
    )

    // reset formData if formData is stored successfully
    useEffect(
        () => {

            if (formType === 'Complaint' ? complaintSubmitted : postSubmitted) {
                return resetForm()
            }

        },
        [formType, postSubmitted, complaintSubmitted, resetForm]
    )

    const handleOnChange = useCallback(
        (e) => {
            // console.log('changed', e.target.name, 'value', e.target.value)
            const newFormData = { ...formData, [e.target.name]: e.target.value }
            setFormData(newFormData)
        },
        [formData, setFormData]
    )

    const handleOnFileUpload = useCallback(
        (e) => {
            setFiles(e.target.files)
            setNumFiles(e.target.files.length)
        },
        [setFiles, setNumFiles]
    )

    const resetFile = useCallback(
        () => {
            setFileKey(Date.now());
            setNumFiles(0);
            setFiles('');
        },
        []
    )

    const handleOnSubmit = useCallback(
        (e) => {

            e.preventDefault()

            const formDataToBeSent = new FormData();

            // Adding files to form data
            for (let i = 0; i < files.length; i++) {
                formDataToBeSent.append(`images`, files[i]);
            }

            // adding name and email to formData
            formData.email = userEmail
            formData.name = userName

            formDataToBeSent.append("data", JSON.stringify(formData))

            submitForm({ data: formDataToBeSent, type: formType })
        },
        [files, formData, submitForm, formType, userEmail, userName]
    )

    if (formConfigError) {
        form = <p>Form cannot be loaded. Try refreshing or logging in again.</p>
    } else {
        switch (formType) {
            case 'Complaint':

                form = (

                    <form onSubmit={handleOnSubmit} >
                        <h3 className="FormHeader" >Complaint Box</h3>
                        <div className="form-group flex-container">
                            <div>
                                <label className="ComplaintFieldLabel" htmlFor="department">Select Department</label>

                                <select value={formData.department} onChange={handleOnChange} className="ComplaintField" name="department" id="department" required>
                                    <option value="" disabled hidden></option>
                                    {
                                        formConfig ? formConfig.complaint.departments.map(((department, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={department.toUpperCase()}
                                                >{department}</option>
                                            )
                                        })) : null
                                    }
                                </select>

                            </div>
                            <div>
                                <label className="ComplaintFieldLabel" htmlFor="issueTitle">Issue Title</label>

                                <select value={formData.issueTitle} onChange={handleOnChange} className="ComplaintField" name="issueTitle" id="issueTitle" required>
                                    <option value="" disabled hidden></option>
                                    {
                                        formConfig ? formConfig.complaint.types.map(((type, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={type.toUpperCase()}
                                                >{type}</option>
                                            )
                                        })) : null
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="form-group flex-container">
                            <div>
                                <label className="ComplaintFieldLabel" htmlFor="name" >Your Name</label>
                                <input className="ComplaintField" name="name" id="name" type="text" value={userName} disabled />
                            </div>
                            <div>
                                <label className="ComplaintFieldLabel" htmlFor="email" >Email Id</label>
                                <input className="ComplaintField" name="email" id="email" type="email" value={userEmail} disabled />
                            </div>
                        </div>

                        <div className="form-group flex-container">
                            <label className="ComplaintFieldLabel" htmlFor="concern" >Your Concern</label>
                            <textarea id="concern" onChange={handleOnChange} name="concernText" value={formData['concernText']} required></textarea>
                        </div>

                        <div className="form-group flex-container">
                            <div className="image-attachment-overlay">
                                {
                                    numFiles > 0
                                        ? <i onClick={resetFile} className="far fa-times-circle"></i>
                                        : null
                                }&nbsp;
                                <label htmlFor="myfile">Attachments{`(${numFiles})`}&nbsp;&nbsp;</label>
                                <i className="far fa-image"></i>
                            </div>
                            <input type="file" id="ImageAttachment" key={fileKey} onChange={handleOnFileUpload} name="image" multiple accept="image/*" />
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
                        <h3 className="FormHeader" ><i className="fas fa-pencil-alt"></i>&nbsp;&nbsp;Create Buzz</h3>
                        <div className="BuzzFormBody" >
                            <textarea id="buzz" onChange={handleOnChange} name="buzzText" value={formData.buzzText} placeholder="Share your thoughts..." required ></textarea>
                        </div>
                        <div className="BuzzFormFooter flex-container">
                            <select value={formData.buzzCategory} onChange={handleOnChange} className="BuzzCategory" name="buzzCategory" id="buzzCategory" required>
                                <option value="" disabled hidden>
                                    Category
                                </option>
                                <option value="lostAndFound">Lost & Found</option>
                                <option value="activity">Activity</option>
                            </select>

                            <div className="image-attachment-overlay">
                                <input type="file" onChange={handleOnFileUpload} key={fileKey} id="BuzzImageAttachment" name="image" accept="image/*" />
                                <i className="far fa-image"></i>
                            </div>
                            &nbsp;{`${numFiles === 0 ? '' : '(Uploaded)'}`}&nbsp;
                            {
                                numFiles > 0
                                    ? <i className="far fa-times-circle" onClick={resetFile}></i>
                                    : null
                            }

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
        formConfig: state.form.formConfig,
        formConfigError: state.form.formConfigError
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)