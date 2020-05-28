const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref : "MyUser"
    },
    username:{
        type : String,
        required : true,
        max: 50
    },
    portfolio:{
        type : String
    },
    repository:{
        type : String
    },
    website:{
        type : String
    },
    country:{
        type : String,
        required : true
    },
    programmingLanguages:{
        type : [String],
        required : true
    },
    workrole:[
        {
            role:{
                type: String,
                required: true
            },
            company:{
                type : String
            },
            country:{
                type : String
            },
            from:{
                type: Date
            },
            to:{
                type: Date
            },
            current:{
                type: Boolean,
                default: false
            },
            details:{
                type: String
            }
        }
    ],
    social: {
        youtube:{
            type: String
        },
        instagram:{
            type: String
        },
        linkedin:{
            type: String
        }
    }
       
    
})

module.exports = Profile = mongoose.model("MyProfile", profileSchema)