const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rtsIndex = require('./routes/index.routes');
const passport = require('passport');
require('./Config/config');
require('./models/db');
require('./Config/passport');
const app = express();

//middleware 
app.use(bodyParser.json());
//app.use(cors);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(passport.initialize())
app.use('/api', rtsIndex);

//start server
app.listen(process.env.PORT, () => console.log(`Server started at : ${process.env.PORT}`));
