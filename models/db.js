require('./userMaster');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false}, (err) => {
    if (!err){console.log("Database is connected..!");}
    else {console.log("Error in MongoDB connestion is: "+ JSON.stringify(err, undefined, 2));}
});
