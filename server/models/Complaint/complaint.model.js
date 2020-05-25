const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        createdBy: {
            name: {
                type: String,
                required: true
            },
            googleId: {
                type: String,
                required: true
            }
        },
        assignedTo: {
            name: {
                type: String,
                default: null
            },
            googleId: {
                type: String,
                default: null
            },
            default: {}
        },
        department: {
            type: String,
            required: true
        },
        imageUrl: {
            type: Array,
            default: []
        },
        status: {
            type: String,
            required: true
        },
        issueTitle: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }
    }
);

complaintSchema.pre('save', async function(next) {
    await this.set({
        createdAt: Date.now(),
    })
    next()
})

const ComplaintModel = mongoose.model('complaint', complaintSchema);

module.exports = {
    ComplaintModel
};