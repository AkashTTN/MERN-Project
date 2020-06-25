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

module.exports.getPostsByCategory = async (data) => {
    const response = await posts.getPostsByCategory(data);
    return response
}

module.exports.getPostsByUserId = async (data) => {
    const response = await posts.getPostsByUserId(data);
    return response
}

module.exports.getPostsByUserIdAndCategory = async (data) => {
    const response = await posts.getPostsByUserIdAndCategory(data);
    return response
}

module.exports.getPostById = async (id) => {
    const response = await posts.getPostById(id);
    return response[0];
};

module.exports.deletePostById = async (id) => {
    const response = await posts.deletePostById(id);
    return response;
};

module.exports.updatePost = async (data) => {
    const response = await posts.updatePost(data);
    return response;
};

module.exports.addCommentToPost = async (data) => {
    const response = await posts.addCommentToPost(data);
    return response;
};