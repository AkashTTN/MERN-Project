const ComplaintModel = require('./complaint.model')
const users = require('../User/user.controller');

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

    await ComplaintModel.create({
        complaintId,
        status: 'Open',
        createdBy: { name, email, googleId },
        department,
        imageUrl,
        issueTitle,
        text
    });

    const assignedUser = await users.assignUserToComplaint({
        complaintId,
        department
    })

    const complaint = await this.assignComplaintToUser({
        complaintId,
        name: assignedUser.name,
        googleId: assignedUser.googleId
    })

    const newComplaintObject = { ...complaint._doc }
    delete newComplaintObject['_id']

    return {
        complaint: newComplaintObject
    };

}

module.exports.changeStatusById = async ({ complaintId, status }) => {

    const response = await ComplaintModel.findOneAndUpdate(
        { complaintId },
        { $set: { status } },
        { new: true }
    )
    return response

}

module.exports.assignComplaintToUser = async ({ complaintId, name, googleId }) => {
    return await ComplaintModel.findOneAndUpdate(
        { complaintId },
        { $set: { assignedTo: { name, googleId } } },
        { new: true }
    )
}

module.exports.getAllComplaints = async ({ limit, skip }) => {
    const response = await ComplaintModel.aggregate([
        {
            "$facet": {
                "userComplaints": [
                    { $match: {} },
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    {
                        $count: "totalComplaints"
                    }
                ]
            }
        }
    ])

    return response[0]
}

module.exports.getAllComplaintsByStatusTypes = async ({ status, limit, skip }) => {

    const response = await ComplaintModel.aggregate([
        {
            "$facet": {
                "userComplaints": [
                    { $match: { status } },
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $match: { status } },
                    { $count: "totalComplaints" }
                ]
            }
        }
    ])

    return response[0]

}

module.exports.getAllComplaintsByUserId = async ({ id, limit, skip }) => {
    // const complaints = await ComplaintModel.find(
    //     { "createdBy.googleId": id },
    //     { _id: 0 }
    // ).skip(skip).limit(limit)

    // return complaints
    // const complaintsCursor = await ComplaintModel.aggregate([
    //     { $match: { "createdBy.googleId": id } },
    //     { $project: { _id: 0 } },
    //     { $skip: skip },
    //     { $limit: limit }
    // ])

    const response = await ComplaintModel.aggregate([
        {
            "$facet": {
                "userComplaints": [
                    { $match: { "createdBy.googleId": id } },
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $match: { "createdBy.googleId": id } },
                    { $count: "totalComplaints" }
                ]
            }
        }
    ])

    return response[0]

}

module.exports.getComplaintById = async ({ complaintId }) => {
    const response = await ComplaintModel.find({ complaintId }, { _id: 0 })
    return response[0]
}

module.exports.getComplaintsCount = async () => {
    const numberOfComplaints = await ComplaintModel.countDocuments().exec()
    return numberOfComplaints
}

module.exports.getComplaintsCountById = async (id) => {
    const numberOfComplaints = await ComplaintModel.countDocuments(
        { "createdBy.googleId": id }
    ).exec()
    return numberOfComplaints
}

module.exports.updateComplaint = async ({ complaintId, concernText }) => {
    return await ComplaintModel.findOneAndUpdate(
        { complaintId },
        { $set: { text: concernText } },
        { new: true }
    )
}