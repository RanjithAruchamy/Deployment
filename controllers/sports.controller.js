const mongoose = require('mongoose');
const User = require('../models/userMaster')
const sportsMaster = require('../models/sportsMaster');
const SportsMaster = require('../models/sportsMaster');
const moment = require('moment');
const lodash = require('lodash');

//Create a Sport
module.exports.registerSportsMaster = (req, res, next) => {
    var fName, lName, name, role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            fName = lodash.pick(user, 'firstName')
            lName = lodash.pick(user, 'lastName')
            name = fName.firstName + " " + lName.lastName;
            
            if(role.role == 'ADMIN'){
                var sname = req.body.sportName;
                sname = sname.trim();
                var fname = sname.charAt(0);
                var lname = sname.charAt(1);
                fname = fname.toUpperCase();
                lname = lname.toUpperCase();
                SportsMaster.countDocuments( {}, function (err, count) {
                //Update in Sports Master
                    const sports = new sportsMaster(
                    {
                        'sportId': "OXF-D-S-" + fname + lname +"-" +count,
                        'sportName':req.body.sportName,
                        'sportType':req.body.sportType,
                        'createdBy': name
                    });
                    sports.save((err, doc) =>{
                        if(!err) res.status(201).send(doc)
                        else res.status(500).send(err)
                    })
                })
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
    
}

// Get All Sports
module.exports.getAllSport = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                sportsMaster.find()
                .then(sports => res.status(200).send(sports))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
}

//Get a Sport
module.exports.getSport = (req, res, next) => {
    var role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            
            if(role.role == 'ADMIN'){
                sportsMaster.findOne({sportId:req.params.sportId})
                .then(sports => res.status(200).send(sports))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });

}

//Update a Sport
module.exports.updateSport = async (req, res, next) => {
    var fName, lName, name, role;
    User.findOne({userId: req.userId},
        async (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            fName = lodash.pick(user, 'firstName')
            lName = lodash.pick(user, 'lastName')
            name = fName.firstName + " " + lName.lastName;
            
            if(role.role == 'ADMIN'){
                await SportsMaster.findOneAndUpdate({sportId:req.params.sportId}, {$set:req.body}, {new:true})
                await SportsMaster.findOneAndUpdate({sportId:req.params.sportId}, {$set:{updatedBy: name}}, {new:true})
                .then(sports => res.status(200).send(sports))
                .catch(err => res.status(404).send(err))
                            }
                else{
                    res.json('Only Admin can access!')
                }
        });
    
}

//Delete a Sport
module.exports.deleteSport = (req, res, next) => {
    var fName, lName, name, role;
    User.findOne({userId: req.userId},
        (err, user) => {
            if(!user)
            return res.status(404).json({status:false, message: "User is not found"});
            else
            role = lodash.pick(user, 'role')
            fName = lodash.pick(user, 'firstName')
            lName = lodash.pick(user, 'lastName')
            name = fName.firstName + " " + lName.lastName;
            
            if(role.role == 'ADMIN'){
                SportsMaster.findOneAndUpdate({sportId:req.params.sportId}, {$set:{status:"INACTIVE",deletedBy:name, deletedAt: moment().format()}}, {new:true})
                .then(sports => res.status(200).send(sports))
                .catch(err => res.status(404).send(err))
                }
                else{
                    res.json('Only Admin can access!')
                }
        });
    
}

module.exports.test = (req, res, next) => {
                sportsMaster.find()
                .then(sports => res.status(200).send(sports))
                .catch(err => res.status(404).send(err))
}
