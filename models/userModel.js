const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new  mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5
    },
    userName: {
        type: String,
        required: true,
    },
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

module.exports = User = mongoose.model("user", userSchema);