const {
    PostModel
} = require('./post.model');

module.exports.create = async ({
    text,
    email,
    imageUrl,
    googleId,
    category
}) => {

    const post = await PostModel.create({
        text,
        imageUrl,
        user: { email, googleId },
        category
    });

    return {
        post
    };
};

module.exports.getPosts = async ({ limit, skip }) => {
    const posts = await PostModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
    return posts
}

module.exports.changeLikeCount = async ({ buzzId, type }) => {
    let response;
    switch (type) {
        case 'increment':
            response = await PostModel.updateOne({ id: buzzId }, { $inc: { likeCount: 1 } })
            break
        case 'decrement':
            response = await PostModel.updateOne({ id: buzzId }, { $inc: { likeCount: -1 } })

    }
};

module.exports.changeDislikeCount = async ({ buzzId, type }) => {
    let response;
    switch (type) {
        case 'increment':
            response = await PostModel.updateOne({ id: buzzId }, { $inc: { dislikeCount: 1 } })
            break
        case 'decrement':
            response = await PostModel.updateOne({ id: buzzId }, { $inc: { dislikeCount: -1 } })

    }
};

module.exports.getPostById = async (id) => {
    const post = await UserModel.find({ id });
    return post;
};