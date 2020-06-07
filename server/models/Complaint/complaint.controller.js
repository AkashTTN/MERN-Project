const complaints = require('./complaint.service')

module.exports.create = async (data) => {
    const response = await complaints.create(data)
    return response
}

module.exports.changeStatusById = async (data) => {
    const response = await complaints.changeStatusById(data)
    return response
}

module.exports.getAllComplaints = async (data) => {
    const response = await complaints.getAllComplaints(data)
    return response
}

module.exports.getAllComplaintsByUserId = async (data) => {
    const response = await complaints.getAllComplaintsByUserId(data)
    return response
}

module.exports.getComplaintsCount = async () => {
    const response = await complaints.getComplaintsCount()
    return response
}

module.exports.getComplaintsCountById = async (id) => {
    const response = await complaints.getComplaintsCountById(id)
    return response
}