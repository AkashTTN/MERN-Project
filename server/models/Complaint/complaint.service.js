const { ComplaintModel } = require('./complaint.model')

module.exports.create = async ({
    name,
    email,
    googleId,
    imageUrl,
    department,
    issueTitle,
    text
}) => {

    const complaint = await ComplaintModel.create({
        status: 'Open',
        createdBy: { name, email, googleId },
        department,
        imageUrl,
        issueTitle,
        text
    });
    return {
        complaint
    };

}

module.exports.changeStatusById = async ({ id, status }) => {
    const response = await ComplaintModel.updateOne({ id }, { $set: { status } })
    return response
}

module.exports.getAllComplaints = async () => {
    const complaints = await ComplaintModel.find({})
    return complaints
}

module.exports.getAllComplaintsByUserId = async (id) => {
    const complaints = await ComplaintModel.find({ "createdBy.googleId": id })
    return complaints
}