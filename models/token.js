const mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    userId:{ type: String, required:true},
    token:{type:String, required:true},
    email:{type:String, required:true},
    createdAt:{type: Date, default: Date.now, expires:43200}
})
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;