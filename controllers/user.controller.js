const mongoose = require('mongoose');
const User = require('../models/userMaster')
const UserPersonal = require('../models/userPersonal');
const UserSports = require('../models/userSports');
const SportsMaster = require('../models/sportsMaster');
const Token = require('../models/token');
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const moment = require('moment');
const passport = require('passport');
const lodash = require('lodash');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('../models/userMaster');
const config = require('../Config/config.json');
const axios = require('axios');
const cron = require('cron').CronJob;
const pwdGenerator = require('generate-password');
const session = require('node-sessionstorage');
const { LocalStorage } = require('node-localstorage');
const localstorage = require('node-localstorage').LocalStorage;
//const User = mongoose.model('UserMaster');

// Create a User
module.exports.registerUserMaster = async (req, res, next) => {
    var genToken, token;
    var fName = req.body.firstName;
    fName = fName.trim();
    fName = fName.charAt(0);
    fName = fName.toUpperCase();
    var lName = req.body.lastName;
    lName= lName.trim();
    lName = lName.toUpperCase();
    lName = lName.charAt(0);
    var pwd = req.body.password;
    const salt = await bcrypt.genSalt()
    const hashPwd = await bcrypt.hash(req.body.password, salt);

    User.countDocuments({}, function (err, count) { 
        if (err){ 
            res.status(500).send(err);
        }else{ 
            // Create user in User Master
            const user = new User(
                {
                    'userId': "OXF-D-U-" + fName + lName +"-"+ count,
                    'role': req.body.role,
                    'status': "PENDING",
                    'firstName': req.body.firstName,
                    'lastName': req.body.lastName,
                    'email': req.body.email,
                    'phoneNumber': req.body.phoneNumber,
                    'password': hashPwd,
                    'mail':{
                        'isVerified': false,
                        'followUp1': null,
                        'followUp1': null,
                        'followUp1': null,
                        'deactivatedAt':null
                    },
                    'admin':{
                        'isSubmitted':null,
                        'isApproved':null,
                        'followUp1':null,
                        'followUp2':null,
                        'activatedAt':null
                    },
                    'createdBy': req.body.firstName + " " + req.body.lastName,
                    'deletedAt': null,
                    'updatedBy':null,
                    'deletedBy':null,
                    'personal':{
                        'gender':null,
                        'nationality':null,
                        'fatherName': null,
                        'fatherOccupation':null,
                        'motherName': null,
                        'motherOccupation':null,
                        'parentMobile':null,
                        'residenceNumber':null,
                        'parentEmail':null,
                        'permanentAddress': null,
                        'temporaryAddress': null,
                        'bloodGroup': null,
                        'age': null,
                        'dob': null,
                        'height': null,
                        'weight':null,
                        'profession': null,
                        'organization': null
                    },
                    'sports':{
                        'sportId': req.body.sportId,
                        'playerLevel': null,
                        'playerSkill': {
                            'batsman':false,
                            'bowler':false,
                            'leftHand':false,
                            'rightHand':false,
                            'wicketKeeper':false,
                            'allRounder':false
                        },
                        'previousTeam': null,
                        'TNCA': null,
                        'KDCA': null,
                        'hobbies': null,
                        'goal': null,
                        'strength':{
                            'general':null,
                            'cricket':null
                        },
                        'weakness':{
                            'general':null,
                            'cricket':null
                        },
                        'bowlerType':null,
                        'bowlerHand':null,
                        'battingHand':null,
                        'medical':null,
                        'roleModelReal':{
                            'name':null,
                            'reason':null
                        },
                        'roleModelCricket':{
                            'name':null,
                            'reason':null
                        }
                }
                    
                });
                
                //Password Validation
                if(pwd.length < 4){
                    res.status(422).json("Password must be 4 character long")
                }
                else{
                user.save( function(err, doc) {
                    
                    if(err){
                        if(err.name === 'MongoError' && err.code === 11000){
                                // Email validation
                        User.findOne({email:req.body.email})
                        .then(async email =>{
                            if(email.email == req.body.email && (email.status == "ACTIVE" || email.status == "PENDING"))
                            return await res.status(422).send({ success: false, message: 'This email ID is already registered with us, if you are a new user please provide a new email id else please try to Sign-IN using the password already created' });
                            else if(email.email == req.body.email && email.status == "INACTIVE")
                            return await res.status(422).send({ success: false, message: 'Email Deactivated, Contact Admin!' });
                        
                        })
                    }
                        else
                        res.status(500).send(err)
                    }
                    else{
                    res.status(200).send(doc)
                   // Create user in User Personal
                    const userPersonal = new UserPersonal(
                        {
                            '_id': user._id,
                            'userId': user.userId,
                            'firstName': req.body.firstName,
                            'lastName': req.body.lastName,
                            'email': user.email,
                            'phoneNumber': req.body.phoneNumber,
                            'gender':null,
                            'nationality':null,
                            'fatherName': null,
                            'fatherOccupation':null,
                            'motherName': null,
                            'motherOccupation':null,
                            'parentMobile':null,
                            'residenceNumber':null,
                            'parentEmail':null,
                            'permanentAddress': null,
                            'temporaryAddress': null,
                            'bloodGroup': null,
                            'age': null,
                            'dob': null,
                            'height': null,
                            'weight':null,
                            'profession': null,
                            'organization': null,
                            'deletedAt': null,
                            'createdBy':user.createdBy,
                            'updatedBy':null,
                            'deletedBy':null
                        })
                        userPersonal.save()
                        // Create user in User Sports
                        const userSports = new UserSports(
                            {
                                '_id': user._id,
                                'userId': user.userId,
                                'sportId': req.body.sportId,
                                'playerLevel': null,
                                'playerSkill': {
                                    'batsman':false,
                                    'bowler':false,
                                    'leftHand':false,
                                    'rightHand':false,
                                    'wicketKeeper':false,
                                    'allRounder':false
                                },
                                'previousTeam': null,
                                'TNCA': null,
                                'KDCA': null,
                                'hobbies': null,
                                'goal': null,
                                'strength':{
                                    'general':null,
                                    'cricket':null
                                },
                                'weakness':{
                                    'general':null,
                                    'cricket':null
                                },
                                'bowlerType':null,
                                'bowlerHand':null,
                                'battingHand':null,
                                'medical':null,
                                'roleModelReal':{
                                    'name':null,
                                    'reason':null
                                },
                                'roleModelCricket':{
                                    'name':null,
                                    'reason':null
                                },
                                'deletedAt': null,
                                'createdBy':user.createdBy,
                                'updatedBy':null,
                                'deletedBy':null
                            })
                            userSports.save( async function(){
                                //Generate token
                            genToken = await user.generateJwt()
                            //Store token
                            token = await new Token({userId:user.userId, token: genToken, email:user.email})
                            .save()
                            .then(token => sendEmail(user.email, token.token))
                            })
                        }
                            
                })}
                //Update userid in Sports Master
                SportsMaster.findOneAndUpdate({'sportId':req.body.sportId}, {$push:{ players:{userId:user.userId, _id:user._id}}}, null, function(){})           
                
        } 
         
    });
    
}

//Get all users
module.exports.getAllUser = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                User.find()
                .then(users => res.status(200).send(users))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
        
}

// Get a user
module.exports.getUser = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            if(role.role == 'ADMIN'){
                if(req.query.userId == undefined){
                    User.findOne({userId:req.userId})
                    .then(users => res.status(200).send(users))
                    .catch(err => res.status(404).send(err))
                }
                else{
                    User.findOne({userId:req.query.userId})
                    .then(users => res.status(200).send(users))
                    .catch(err => res.status(404).send(err))
                }
            }
            else{
                User.findOne({userId:req.userId})
                .then(users => res.status(200).send(users))
                .catch(err => res.status(404).send(err))
            }
        });
}

//Update a User
module.exports.updateUserMaster = async (req, res, next) => {
    // To fetch logged in user details
    var fName, lName, name, role, user;
    
    User.findOne({userId: req.userId},
      async  (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else{
            role = lodash.pick(user, 'role')
            fName = lodash.pick(user, 'firstName')
            lName = lodash.pick(user, 'lastName')
            name = fName.firstName + " " + lName.lastName;
            
            }
            if(role.role == 'ADMIN'){
                if(req.query.userId == undefined)
                {
                    var user = {userId: req.userId}
                    update(user)
                }
                else{
                    var user = {userId: req.query.userId}
                    update(user)
                }
            }
            else{
                var user = {userId: req.userId}
                update(user)
            }
    async function update(userId){    
    //Updating to User Master    
    await User.findOneAndUpdate(userId, {$set:req.body}, {new:true})
    await User.findOneAndUpdate(userId, {$set:{updatedBy: name}}, {new:true})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(404).send(err))
    //Updating to User Personal
    await UserPersonal.findOneAndUpdate(userId, {$set:req.body.personal}, {new:true})
    await UserPersonal.findOneAndUpdate(userId, {$set:{updatedBy: name}}, {new:true})
    //Updating to User Sports
    await UserSports.findOneAndUpdate(userId,{$set:req.body.sports}, {new:true})
    await UserSports.findOneAndUpdate(userId, {$set:{updatedBy: name}}, {new:true})}
    user = {userId: req.userId}
    sendMailAdmin(user)
 });
    async function sendMailAdmin(user){
        User.findOne(user)
        .then(async user => {
            if(user.admin.isApproved == true)   return null;
            else{
            if(user.admin.isSubmitted == true){
                var transporter = nodemailer.createTransport({
                    service:'gmail',
                     auth:{
                         user: config.development.mail.user, 
                         pass: config.development.mail.pwd} 
                        })
                var messageAdmin = {
                    from: config.development.mail.user,
                    to:config.development.mail.user,
                    subject:"For Approval",
                    text:"Hello, \n\n"+"Please verify your account by clicking the  below link: \n"+config.development.domaiURL+"\/api\/confirmation\/?token=.\n"
                }
                var messageUserApproval = {
                    from: config.development.mail.user,
                    to:user.email,
                    subject:"Sent For Approval",
                    text:"Hello, \n\n"+"Please verify your account by clicking the  below link: \n"+config.development.domaiURL+"\/api\/confirmation\/?token=.\n"
                }
                var messageUserApproved = {
                    from: config.development.mail.user,
                    to:user.email,
                    subject:"Approved",
                    text:"Hello, \n\n"+"Please verify your account by clicking the  below link: \n"+config.development.domaiURL+"\/api\/confirmation\/?token=.\n"
                }
                var date = new Date();
                triggerMail(messageAdmin);
                var obj = {admin:{followUp1:date}}
                await User.findOneAndUpdate({userId:user.userId}, {$set:obj})
                triggerMail(messageUserApproval)
                var task = new cron('*/2 * * * *',async ()=>{
                    if(user.admin.isApproved == true) return null
                    else{
                        if(user.admin.followUp1 == null){
                            triggerMail(messageAdmin);
                            var obj = {admin:{followUp1:date}}
                            await User.findOneAndUpdate({userId:user.userId}, {$set:obj})
                        }
                        else if(user.admin.followUp2 == null){
                            triggerMail(messageAdmin);
                            var obj = {admin:{followUp2:date}}
                            await User.findOneAndUpdate({userId:user.userId}, {$set:obj})
                        }
                        else{
                            var obj = {status:"ACTIVE",admin:{activatedAt:date}}
                            await User.findOneAndUpdate({userId:user.userId}, {$set:obj})
                            triggerMail(messageUserApproved)
                        }
                    }
                })
                task.start();
                function triggerMail(message){ transporter.sendMail(message, function(err, doc) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log('Mail sent'+ doc.response)
                    }
                });}

            }else   return null;
            }
        })
    }
}

//Inactive a User
module.exports.deleteUserMaster = async (req, res, next) => {
    var fName, lName, name, role;
    User.findOne({userId: req.userId},
        async  (err, user) => {
              if(!user)
              return res.status(404).json({status:false, message: "User is not found"});
              else{
              role = lodash.pick(user, 'role')
              fName = lodash.pick(user, 'firstName')
              lName = lodash.pick(user, 'lastName')
              name = fName.firstName + " " + lName.lastName;
              }
              if(role.role == 'ADMIN'){
                if(req.query.userId == undefined){
                    User.findOneAndUpdate({userId:req.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    .then(users => res.status(200).send(users))
                    .catch(err => res.status(404).send(err))
                    await UserPersonal.findOneAndUpdate({userId:req.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    await UserSports.findOneAndUpdate({userId:req.userId},{$set:{status:"INACTIVE", deletedBy: name, deletedAt:moment().format()}}, {new:true})
                }
                else{
                    User.findOneAndUpdate({userId:req.query.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    .then(users => res.status(200).send(users))
                    .catch(err => res.status(404).send(err))
                    await UserPersonal.findOneAndUpdate({userId:req.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    await UserSports.findOneAndUpdate({userId:req.userId},{$set:{status:"INACTIVE", deletedBy: name, deletedAt:moment().format()}}, {new:true})

                }
            }
            else{
                     User.findOneAndUpdate({userId:req.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    .then(users => res.status(200).send(users))
                    .catch(err => res.status(404).send(err))
                    await UserPersonal.findOneAndUpdate({userId:req.userId}, {$set:{status:"INACTIVE", deletedBy: name, deletedAt: moment().format()}}, {new:true})
                    await UserSports.findOneAndUpdate({userId:req.userId},{$set:{status:"INACTIVE", deletedBy: name, deletedAt:moment().format()}}, {new:true})

            }
              
                    });
}

//Delete a User permanently
module.exports.deleteUser = async (req, res, next) => {
    console.log("entered delete api")
    var role;
    User.findOne({userId: req.userId},
        async  (err, user) => {
              if(!user)
              return res.status(404).json({status:false, message: "User is not found"});
              else{
              role = lodash.pick(user, 'role')
              console.log("user found"+user.userId+req.params.userId)
              
              if(role.role == 'ADMIN'){              
                    await User.findOneAndDelete({userId:req.params.userId})
                    await UserPersonal.findOneAndDelete({userId:req.params.userId})
                    await UserSports.findOneAndDelete({userId:req.params.userId})
                    .then(res.json("User Deleted"))
            }
            else{
                res.status(402).json("Only admin can access")
            }
        }
                    });
}
//Verify email using token
module.exports.confirmToken = async (req, res, next) => {
    Token.findOne({token:req.query.token})
    .then(token => {
        if(token.token === req.query.token){
            var followUp ;
            User.findOne({userId:token.userId})
            .then(user => {
                followUp = user.mail.followUp            
            User.findOneAndUpdate({userId:token.userId}, {$set:{mail:{isVerified:true, followUp: followUp}}}, {new:true})
            .then(user => {
                if(user.mail.isVerified == true){
                    res.redirect(config.development.loginURL);
                    Task.stop();
                }
            })
        })
        }
})
    
    
}

//Authentication
module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        
        if(err)
        return res.status(400).json(err);
        else if(user){
            var token = {"token": user.generateJwt()};
            return res.status(200).json(token);
            
        }
        
        else
        return res.status(404).json(info)
    })(req, res)
}

//Logged in user
module.exports.userProfile = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                if(req.query.userId == undefined){
                    User.findOne({userId: req.userId},
                        (err, user) => {
                            if(!user)
                            return res.status(404).json({status:false, message: "User is not found"});
                            else
                            return res.status(200).json({status:true, user: lodash.pick(user, ['userId', 'firstName', 'lastName', 'email'])});
                        });
                }
                else{
                    User.findOne({userId: req.query.userId},
                        (err, user) => {
                            if(!user)
                            return res.status(404).json({status:false, message: "User is not found"});
                            else
                            return res.status(200).json({status:true, user: lodash.pick(user, ['userId', 'firstName', 'lastName', 'email'])});
                        });
                }
                }
                else{
                    User.findOne({userId: req.userId},
                        (err, user) => {
                            if(!user)
                            return res.status(404).json({status:false, message: "User is not found"});
                            else
                            return res.status(200).json({status:true, user: lodash.pick(user, ['userId', 'firstName', 'lastName', 'email'])});
                        });
                }
        });
}
var Task;

//Send verification email
async function sendEmail (email, token){
    var transporter = nodemailer.createTransport({
        service:'gmail',
         auth:{
             user: config.development.mail.user, 
             pass: config.development.mail.pwd} 
            })
    var message = {
        from: config.development.mail.user,
        to:email,
        subject:"Account Verification",
        text:"Hello, \n\n"+"Please verify your account by clicking the  below link: \n"+config.development.domaiURL+"\/api\/confirmation\/?token="+token + ".\n"
    }
    triggerMail();
    var dateTime = new Date()
    let obj ={mail:{followUp1:dateTime, isVerified:false}};
    await User.findOneAndUpdate({email:message.to}, {$set:obj}, {new:true})
    /* var hour = dateTime.getHours();
    var min = dateTime.getMinutes(); */
    Task = new cron('*/2 * * * *', () => {
        let dateTime = new Date()
        console.log(dateTime)
        User.findOne({email:message.to})
        .then(async user => {
            if(user.mail.isVerified == false){
                if(user.mail.followUp1 != null){
                    await User.findOneAndUpdate({email:message.to}, {$set:{mail:{followUp1:user.mail.followUp1,followUp2:dateTime, isVerified:false}}},{new:true})
                    .then(user=>{
                        
                        console.log("Follow Up "+user.mail.followUp +" " + dateTime +" "+user.email);
                        triggerMail();
                    })
                }
                else if(user.mail.followUp2 != null){
                    await User.findOneAndUpdate({email:message.to}, {$set:{mail:{followUp1:user.mail.followUp1,followUp2:user.mail.followUp2, followUp3:dateTime, isVerified:false}}},{new:true})
                    .then(user=>{
                        
                        console.log("Follow Up "+user.mail.followUp +" " + dateTime+" "+user.email);
                        triggerMail();
                    })
                }
                else if(user.mail.followUp3 != null){
                    await User.findOneAndUpdate({email:message.to}, {$set:{status:"INACTIVE",mail:{followUp1:user.mail.followUp1,followUp2:user.mail.followUp2, followUp3:user.mail.followUp3,deactivatedAt:dateTime, isVerified:false}}}, {new:true})
                    .then(user=>{
                        
                        console.log("Follow Up "+user.mail.followUp +" " + dateTime+" "+user.email);
                        triggerMail();
                    })
                }

            }
        })
      });
      Task.start();
      function triggerMail(){ transporter.sendMail(message, function(err, doc) {
        if (err){
            console.log(err)
        }
        else{
            console.log('Mail sent'+ doc.response)
        }
    });}
    
}

//captcha verification
module.exports.captchaVerify = (req, res, next) => {
    var token = req.body.token;
    var secret = config.development["captcha-secret"];
    const url = " https://www.google.com/recaptcha/api/siteverify?secret="+secret+"&response="+token;
    axios.post(url).then(response=>{
        if(response.data.success)
        res.status(200).json({response:"Captcha verification successful"})

        res.status(401).send(response.data.success)
    })
}

//Forgot Password
module.exports.forgotPwd = async (req, res, next) => {
    const user = new User();
    var token;
    var genToken = await user.generateJwt();
    var pwd = await pwdGenerator.generate({
        length:10,
        numbers: true
    });
    const salt = await bcrypt.genSalt()
    const hashPwd = await bcrypt.hash(pwd, salt);
    await User.findOneAndUpdate({email:req.body.email}, {$set:{password:hashPwd}})
    await User.findOne({email:req.body.email},
        (err, user) => {      
            if(!user)   res.status(404).send({message:"User not found"})  
            else if(err)    res.status(500).send({message:"Internal server error"})
            else{
                token = new Token({userId:user.userId, token: genToken, email:user.email})
                .save()
                triggerMail();
            }

    })
    function triggerMail(){
    var transporter = nodemailer.createTransport({
        service:'gmail',
         auth:{
             user: config.development.mail.user, 
             pass: config.development.mail.pwd} 
            })
    var message = {
        from: config.development.mail.user,
        to:req.body.email,
        subject:"Forgot Password",
        text:"Hello, \n\n"+"Here is your new password: "+pwd+"\nPlease reset your password by clicking the below link: \n"+config.development.domaiURL+"\/api\/resetPassword.\n"
    }
    transporter.sendMail(message, function(err, doc) {
        if (err){
            console.log(err)
        }
        else{
            console.log('Mail sent'+ doc.response)
            res.status(200).send({message:'Email sent'})
        }
    });}
}


//Verify Reset password
module.exports.resetPwd = (req, res, next) => {
    
    Token.findOne({token:req.query.token},
        (err, token) => {
            if (err)    res.status(500).send(err)
            else if(!token) res.status(404).send({message:"Link expired or no user found."})
            else{
                User.findOne({userId: token.userId}, 
                    (err, user) => {
                        if(err)
                        res.status(500).send(err);
                        else if(!user)
                            res.status(404).send({message:"Email is not Registered"})
                        else{
                            res.redirect(config.development.resetURL)
                            localstorage = new LocalStorage('./scratch');
                            localstorage.setItem('email', user.email)
                        }
                    })
            }
        })
}
//Reset Password
module.exports.changePassword = async (req, res, next) => {
    const salt = await bcrypt.genSalt()
    const hashPwd = await bcrypt.hash(req.body.newPassword, salt);
    passport.authenticate('local', async (err, user, info) => {
        if(err)
        return res.status(400).json(err);
        else if(user){
           await User.findOneAndUpdate({email:req.body.email},{$set:{password:hashPwd}})
            return res.status(200).json(req.body.newPassword);
        }
        
        else
        return res.status(404).json(info)
    })(req, res)
}
