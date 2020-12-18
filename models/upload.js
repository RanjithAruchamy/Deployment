const mongoose = require('mongoose');

var uploadSchema = new mongoose.Schema({
    id: {type: String},
    imageUrl: {type: String},
    imageTitle: {type: String},
    imageDesc: {type: String},
    uploaded: {type:Date, default: Date.now}
      
})

module.exports = mongoose.model('Upload', uploadSchema);