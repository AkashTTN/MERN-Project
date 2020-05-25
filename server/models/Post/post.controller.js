const posts = require('./post.service');

module.exports.create = async (data) => {
    return posts.create(data)
};

module.exports.changeLikeCount = async (data) => {
    const response = await posts.changeLikeCount(data)
    return response   
}

module.exports.changeDislikeCount = async (data) => {
    const response = await posts.changeDislikeCount(data)
    return response   
}

module.exports.getPosts = async (data) => {
    const response = await posts.getPosts(data);
    return response
}

module.exports.getPostById = async (id) => {
    const response = await posts.getPostById(id);
    return response[0];
};