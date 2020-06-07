const ComplaintModel = require('./complaint.model')

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
    const response = await ComplaintModel.findOneAndUpdate(
        { complaintId },
        { $set: { status } },
        { new: true }
    )
    return response
}

module.exports.getAllComplaints = async ({ limit, skip }) => {
    const complaints = await ComplaintModel.find({}, { _id: 0 }).skip(skip).limit(limit)
    return complaints
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