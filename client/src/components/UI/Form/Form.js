import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { submitForm } from '../../../store/actions'
import Spinner from '../Spinner/Spinner'
import fetchImage from '../../utils/fetchImage'

import './Form.css'

const initialFormState = {
    department: '',
    concernText: '',
    issueTitle: '',
    buzzCategory: '',
    buzzText: ''
}

const initialFormErrorState = {
    departmentError: '',
    concernTextError: '',
    issueTitleError: '',
    buzzCategoryError: '',
    buzzTextError: ''
}

const formValid = ({ formType, formErrors, formData }) => {
    let valid = true;
    const buzzFields = [formData.buzzCategory, formData.buzzText]
    const complaintFields = [
        formData.concernText,
        formData.department,
        formData.issueTitle
    ]

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    if (formType === 'Complaint') {
        complaintFields.forEach(val => val.length <= 0 && (valid = false))
    } else if (formType === 'Buzz') {
        buzzFields.forEach(val => val.length <= 0 && (valid = false))
    }

    return valid;
};

const Form = ({
    loading,
    userEmail,
    userName,
    formType,
    formConfig,
    submitForm,
    postSubmitted,
    complaintSubmitted,
    formConfigError,
    editMode = false,
    editData = ''
}) => {

    const [numFiles, setNumFiles] = useState(0)
    const [files, setFiles] = useState('')
    const [formData, setFormData] = useState(initialFormState)
    const [fileKey, setFileKey] = useState(Date.now());
    const [formErrors, setFormErrors] = useState(initialFormErrorState)
    const [isFormValid, setIsFormValid] = useState(true)

    let form = null

    const resetForm = useCallback(
        () => {

            if (editMode && editData) {
                (async function () {
                    setFormData({
                        buzzCategory: editData.buzzCategory,
                        buzzText: editData.buzzText,
                    })

                    const imagesArray = await fetchImage(editData.imageUrl)
                    console.log(imagesArray)
                    const fileArray = imagesArray && imagesArray.map(async (file, index) => {
                        return await (new Response(file)).arrayBuffer();
                    })
                    setFiles(fileArray)
                    setNumFiles(fileArray.length)

                })()

            } else {
                setFormData(initialFormState)
                setFormErrors(initialFormErrorState)
                setNumFiles(0)
                setFiles('')
                setIsFormValid(true)
            }

        },
        [
            setFormData, setNumFiles, setFiles, editMode, setIsFormValid,
            editData, setFormErrors
        ]
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

            const { name, value } = e.target
            let updatedFormErrors = { ...formErrors }

            const newFormData = { [name]: value }

            switch (name) {
                case 'department':
                    updatedFormErrors.departmentError = value.length <= 0
                        ? 'Choose a department'
                        : ''
                    break

                case 'concernText':
                    updatedFormErrors.concernTextError = value.trim().length <= 0
                        ? 'Describe your complaint'
                        : ''
                    break

                case 'issueTitle':
                    updatedFormErrors.issueTitleError = value.length <= 0
                        ? 'Issue title cannot be empty'
                        : ''
                    break

                case 'buzzCategory':
                    updatedFormErrors.buzzCategoryError = value.length <= 0
                        ? 'Choose a buzz category'
                        : ''
                    break

                case 'buzzText':
                    updatedFormErrors.buzzTextError = value.trim().length <= 0
                        ? 'Empty buzz not allowed'
                        : ''
                    break

                default: return
            }

            setFormErrors((prevFormErrors => ({
                ...prevFormErrors,
                ...updatedFormErrors
            })))

            setFormData((prevFormData => ({
                ...prevFormData,
                ...newFormData
            })))

        },
        [setFormData, setFormErrors, formErrors]
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
        [setFileKey, setNumFiles, setFiles]
    )

    const handleOnSubmit = useCallback(
        (e) => {

            e.preventDefault()

            if (formValid({ formType, formErrors, formData })) {
                
                setIsFormValid(true)
                const formDataToBeSent = new FormData();

                // Adding files to form data
                for (let i = 0; i < files.length; i++) {
                    formDataToBeSent.append(`images`, files[i]);
                }

                // adding name and email to formData
                formData.email = userEmail
                formData.name = userName

                formDataToBeSent.append("data", JSON.stringify(formData))

                submitForm({
                    data: formDataToBeSent,
                    type: formType, editMode, id: editData.id
                })

            } else {
                setIsFormValid(false)
            }

        },
        [
            files, formData, submitForm, formType, formErrors,
            userEmail, userName, editMode, editData.id
        ]
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
                                <label className="ComplaintFieldLabel" htmlFor="department">
                                    Select Department
                                </label>
                                <p>{formErrors.departmentError}</p>
                                <select
                                    value={formData.department}
                                    onChange={handleOnChange}
                                    className="ComplaintField"
                                    name="department" id="department" >
                                    <option value="" disabled hidden></option>
                                    {
                                        formConfig
                                            ? formConfig.complaint.departments.map(((department, index) => {
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

                                <select
                                    value={formData.issueTitle}
                                    onChange={handleOnChange}
                                    className="ComplaintField"
                                    name="issueTitle" id="issueTitle" >
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
                                <input
                                    className="ComplaintField"
                                    name="name"
                                    id="name"
                                    type="text"
                                    value={userName} disabled
                                />
                            </div>
                            <div>
                                <label className="ComplaintFieldLabel" htmlFor="email" >Email Id</label>
                                <input
                                    className="ComplaintField"
                                    name="email"
                                    id="email"
                                    type="email"
                                    value={userEmail}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-group flex-container">
                            <label className="ComplaintFieldLabel" htmlFor="concern" >Your Concern</label>
                            {formErrors.concernTextError
                                ? <p className="error">{formErrors.concernTextError}</p>
                                : null}
                            <textarea
                                id="concern"
                                onChange={handleOnChange}
                                name="concernText"
                                value={formData['concernText']}
                            ></textarea>
                        </div>

                        <div className="form-group flex-container">
                            <div className="image-attachment-overlay">
                                {
                                    numFiles > 0
                                        ? <i onClick={resetFile} className="remove-file far fa-times-circle"></i>
                                        : null
                                }
                                <label htmlFor="myfile">Attachments{`(${numFiles})`}&nbsp;&nbsp;</label>
                                <i className="far fa-image"></i>
                                <input
                                    type="file"
                                    id="ImageAttachment"
                                    key={fileKey}
                                    onChange={handleOnFileUpload}
                                    name="image"
                                    multiple accept="image/*" />
                            </div>
                        </div>

                        <div className="form-group flex-container">
                            {
                                loading
                                    ? <div><Spinner isMarginRequired /></div>
                                    : <button
                                        id="SubmitComplaint"
                                        className="btn-primary"
                                        type="submit">Submit</button>
                            }
                        </div>

                    </form>

                )
                break
            case 'Buzz':
                form = (

                    <form onSubmit={handleOnSubmit}>
                        <h3 className="FormHeader" >
                            <i className="fas fa-pencil-alt"></i>
                            {editMode || <span>&nbsp;&nbsp;Create Buzz</span>}
                        </h3>
                        <div className="BuzzFormBody" >
                            {formErrors.buzzTextError
                                ? <p className="error">{formErrors.buzzTextError}</p>
                                : null}
                            <textarea
                                id="buzz"
                                onChange={handleOnChange}
                                name="buzzText"
                                value={formData.buzzText}
                                placeholder="Share your thoughts..." ></textarea>
                        </div>
                        <div className="BuzzFormFooter flex-container">
                            <select
                                value={formData.buzzCategory}
                                onChange={handleOnChange}
                                className="BuzzCategory"
                                name="buzzCategory"
                                id="buzzCategory"
                                required
                            >
                                <option value="" disabled hidden>
                                    Category
                                </option>
                                <option value="Lost & Found">Lost & Found</option>
                                <option value="Activity">Activity</option>
                            </select>

                            <div className="image-attachment-overlay">
                                <input
                                    type="file"
                                    onChange={handleOnFileUpload}
                                    key={fileKey}
                                    id="BuzzImageAttachment" name="image" accept="image/*" multiple />
                                <i className="far fa-image"></i>
                                &nbsp;{`${numFiles === 0 ? '' : '(Uploaded)'}`}&nbsp;
                                {
                                    numFiles > 0
                                        ? <i className="far fa-times-circle" onClick={resetFile}></i>
                                        : null
                                }
                            </div>
                            <div className="SubmitBuzz flex-container">
                                {
                                    loading
                                        ? <div><Spinner isMarginRequired={false} /></div>
                                        : <button className="btn-primary" type="submit">
                                            {editMode ? 'Repost' : 'Post'}
                                            <i className="fas fa-caret-right"></i>
                                        </button>
                                }
                            </div>

                        </div>
                    </form>

                )
                break
            default: form = <p>Wrong form type</p>
        }
    }

    return (
        <div className={editMode ? 'Form m-none' : 'Form'}>
            {
                !isFormValid
                    ? <p className="error">Form cannot be submitted. Criteria must be satisfied.</p> : null
            }
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
        formConfigError: state.form.formConfigError,
        loading: state.form.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitForm: (data) => dispatch(submitForm(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)