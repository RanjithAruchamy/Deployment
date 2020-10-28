const mongoose = require('mongoose');
const User = require('../models/userMaster')
const FormsMaster = require('../models/formMaster');
const SportsMaster = require('../models/sportsMaster');
const moment = require('moment');
const lodash = require('lodash');

//Create a Form
module.exports.registerForm = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                var Fname = req.body.formName;
                Fname = Fname.trim();
                var fname = Fname.charAt(0);
                var lname = Fname.charAt(1);
                fname = fname.toUpperCase();
                lname = lname.toUpperCase();
                FormsMaster.countDocuments( {}, function (err, count) {
                // Update in Forms Master
                    const forms = new FormsMaster(
                    {
                        'formId': "OXF-D-F-" + fname + lname +"-" +count,
                        'sportId': req.body.sportId,
                        'formName': req.body.formName
                    });
                    forms.save((err, doc) =>{
                        if(!err) res.status(201).send(doc)
                        else res.status(500).send(err)
                    })
                    // Update in Sports Master
                    SportsMaster.findOneAndUpdate({'sportId':req.body.sportId}, {$push:{ forms:{formId:forms.formId, _id:forms._id}}}, null, function(){})
                })
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}

//Get All Forms
module.exports.getAllForm = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                FormsMaster.find()
                .then(forms => res.status(200).send(forms))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}

//Get a Form
module.exports.getForm = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                FormsMaster.findOne({formId:req.params.formId})
                .then(forms => res.status(200).send(forms))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}

//Update a Form
module.exports.updateForm = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                FormsMaster.findOneAndUpdate({formId:req.params.formId}, {$set:req.body}, {new:true})
                .then(forms => res.status(200).send(forms))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}

//Delete a Form
module.exports.deleteForm = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                FormsMaster.findOneAndUpdate({formId:req.params.formId}, {$set:{status:"INACTIVE"}, deletedAt: moment().format()}, {new:true})
                .then(forms => res.status(200).send(forms))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}