const { ComplaintModel } = require('./complaint.model')

module.exports.create = async ({
    complaintId,
    name,
    email,
    googleId,
    imageUrl,
    department,
    issueTitle,
    text
}) => {

    const complaint = await ComplaintModel.create({
        complaintId,
        status: 'Open',
        createdBy: { name, email, googleId },
        department,
        imageUrl,
        issueTitle,
        text
    });

    const newComplaintObject = { ...complaint._doc }
    delete newComplaintObject['_id']
    return {
        complaint: newComplaintObject
    };

}

module.exports.changeStatusById = async ({ complaintId, status }) => {
    const response = await ComplaintModel.updateOne({ complaintId }, { $set: { status } })
    return response
}

module.exports.getAllComplaints = async () => {
    const complaints = await ComplaintModel.find({}, { _id: 0 })
    return complaints
}

module.exports.getAllComplaintsByUserId = async (id) => {
    const complaints = await ComplaintModel.find({ "createdBy.googleId": id }, { _id: 0 })
    return complaints
}

module.exports.getComplaintsCount = async () => {
    const numberOfComplaints = await ComplaintModel.countDocuments().exec()
    return numberOfComplaints
}

module.exports.getComplaintsCountById = async (id) => {
    const numberOfComplaints = await ComplaintModel.countDocuments({ "createdBy.googleId": id }).exec()
    return numberOfComplaints
}