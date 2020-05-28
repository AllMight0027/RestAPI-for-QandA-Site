const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserScehma= new Schema({
    name:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    },
    username:{
        required: true,
        type: String
    },
    profilepic:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model("MyUser", UserScehma);