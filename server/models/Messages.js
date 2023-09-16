const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
uid: {
    type: String,
    required: true,
},
message: {
    type: String,
    required: true,

},
});

const MessageModel = mongoose.model("messages", MessageSchema);
module.exports = MessageModel;