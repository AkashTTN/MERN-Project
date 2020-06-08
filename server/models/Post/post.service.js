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
                    {
                        $count: "totalPosts"
                    }
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

    const post = await UserModel.find({ buzzId: id });

    return post;
};