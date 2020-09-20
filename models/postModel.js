const mongoose = require('mongoose');

const postSchema = new  mongoose.Schema({
        title: String,
        content: String,
        author: String
});

module.exports = Post = mongoose.model("post", postSchema);