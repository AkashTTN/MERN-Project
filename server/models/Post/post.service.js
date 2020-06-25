const PostModel = require('./post.model');

module.exports.create = async ({
    buzzId,
    text,
    email,
    imageUrl,
    googleId,
    category
}) => {

    const post = await PostModel.create({
        buzzId,
        text,
        imageUrl,
        user: { email, googleId },
        category
    });

    const newPostObject = { ...post._doc }
    delete newPostObject['_id']
    return {
        buzz: newPostObject
    };

};

module.exports.getPostsByUserId = async ({ limit, skip, userId }) => {

    const posts = await PostModel.aggregate([
        {
            "$facet": {
                "allPosts": [
                    { $project: { _id: 0 } },
                    { $match: { "user.googleId": userId } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $match: { "user.googleId": userId } },
                    { $count: "totalPosts" }
                ]
            }
        }
    ])

    return posts[0]
}

module.exports.getPostsByUserIdAndCategory = async ({ limit, skip, category, userId }) => {

    const posts = await PostModel.aggregate([
        {
            "$facet": {
                "allPosts": [
                    { $match: { category, "user.googleId": userId } },
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $match: { category, "user.googleId": userId } },
                    { $count: "totalPosts" }
                ]
            }
        }
    ])

    return posts[0]
}

module.exports.getPosts = async ({ limit, skip }) => {
    // const posts = await PostModel.find(
    //     {},
    //     { _id: 0 }
    // ).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const posts = await PostModel.aggregate([
        {
            "$facet": {
                "allPosts": [
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $count: "totalPosts" }
                ]
            }
        }
    ])

    return posts[0]
}

module.exports.getPostsByCategory = async ({ limit, skip, category }) => {

    const posts = await PostModel.aggregate([
        {
            "$facet": {
                "allPosts": [
                    { $match: { category } },
                    { $project: { _id: 0 } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],
                "count": [
                    { $match: { category } },
                    { $count: "totalPosts" }
                ]
            }
        }
    ])

    return posts[0]
}

module.exports.changeLike = async ({ buzzId, status, googleId }) => {

    let response

    if (status) {
        response = await PostModel.findOneAndUpdate(
            { buzzId },
            {
                $pull: { dislikedBy: googleId },
                $addToSet: { likedBy: googleId }
            },
            { new: true }
        )
    } else {
        response = await PostModel.findOneAndUpdate(
            { buzzId },
            {
                $pull: { likedBy: googleId }
            },
            { new: true }
        )
    }

    return response
};

module.exports.changeDislike = async ({ buzzId, status, googleId }) => {

    let response

    if (status) {
        response = await PostModel.findOneAndUpdate(
            { buzzId },
            {
                $pull: { likedBy: googleId },
                $addToSet: { dislikedBy: googleId },
            },
            { new: true }
        )
    } else {
        response = await PostModel.findOneAndUpdate(
            { buzzId },
            {
                $pull: { dislikedBy: googleId }
            },
            { new: true }
        )
    }
    return response
};

module.exports.getPostById = async (id) => {

    const post = await PostModel.find({ buzzId: id });

    return post;
};

module.exports.deletePostById = async (id) => {

    const post = await PostModel.deleteOne({ buzzId: id });

    return post;
};

module.exports.addCommentToPost = async ({ buzzId, commentId }) => {

    const post = await PostModel.findOneAndUpdate({ buzzId }, {
        $addToSet: { comments: commentId }
    });

    return post;
};

module.exports.updatePost = async ({
    buzzId,
    text,
    email,
    imageUrl,
    googleId,
    category
}) => {

    const post = await PostModel.findOneAndUpdate({ buzzId }, {
        $set: {
            text,
            imageUrl,
            user: { email, googleId },
            category
        }
    }, { new: true });

    const newPostObject = { ...post._doc }
    delete newPostObject['_id']
    
    return {
        buzz: newPostObject
    };

};