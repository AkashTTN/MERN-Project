const complaints = require('./complaint.service')

module.exports.create = async (data) => {
    const response = await complaints.create(data)
    return response
}

module.exports.changeStatusById = async (data) => {
    const response = await complaints.changeStatusById(data)
    return response
}

module.exports.getAllComplaints = async () => {
    const response = await complaints.getAllComplaints()
    return response
}

module.exports.getAllComplaintsByUserId = async (id) => {
    const response = await complaints.getAllComplaintsByUserId(id)
    return response
}