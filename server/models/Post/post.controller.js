const posts = require('./post.service');

module.exports.create = async (data) => {
    return posts.create(data)
};

module.exports.changeLike = async (data) => {
    const response = await posts.changeLike(data)
    return response   
}

module.exports.changeDislike = async (data) => {
    const response = await posts.changeDislike(data)
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