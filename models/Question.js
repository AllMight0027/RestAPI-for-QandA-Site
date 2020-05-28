const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref : "MyUser"
    },
    questiontext:{
        type: String,
        required: true
    },
    questionCode:{
        type: String
    },
    awnsers:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref : "MyUser"
            },
            solution: {
                text:{
                    type: String,
                    required: true
                },
                upvotes:[
                    {
                        user:{
                            type: Schema.Types.ObjectId,
                            ref : "MyUser"
                        }
                    }
                ]
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }

})

module.exports = Question = mongoose.model("MyQuestion", questionSchema)