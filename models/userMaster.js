const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    status: { type: String },
    role: { type: String, default: "USER" },
    mail:{
      isVerified:{type:Boolean},
      followUp1:{type:Date},
      followUp2:{type:Date},
      followUp3:{type:Date},
      deactivatedAt:{type:Date}
    },
    admin:{
      isSubmitted:{type:Boolean},
      isApproved:{type:Boolean},
      followUp1:{type:Date},
      followUp2:{type:Date},
      activatedAt:{type:Date}
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    deletedAt: { type: Date},
    createdBy:{type:String}, 
    updatedBy:{type:String},
    deletedBy:{type:String},
    saltSecret: String,
    personal:{
      gender:{type:String},
      nationality:{type:String},
      fatherName:{type:String},
      fatherOccupation:{type:String},
      motherName:{type:String },
      motherOccupation:{type:String},
      parentMobile:{type: Number},
      residenceNumber:{type:Number},
      parentEmail:{type:String},
      permanentAddress:{type:String },
      temporaryAddress:{type:String },
      bloodGroup:{type:String },
      age:{type:Number },
      dob:{type:Date },
      height:{type:String },
      weight:{type:String},
      profession:{type:String },
      organization:{type:String },
      files:{
        idProof:{
          url: {type: String},
          uploaded: {type:Date}
        },
        addressProof:{
          url: {type: String},
          uploaded: {type:Date}
        },
        birthCertificate:{
          url: {type: String},
          uploaded: {type:Date}
        },
        profileImage:{
          url: {type: String},
          uploaded: {type:Date}
        }
      }
    },
    sports:{
      sportId:{type:String},
      playerLevel: { type: String  },
      playerSkill: { 
        batsman:{type:Boolean},
        bowler:{type: Boolean},
        leftHand:{type: Boolean},
        rightHand:{type: Boolean},
        wicketKeeper:{type: Boolean},
        allRounder:{type: Boolean}
        },
      previousTeam: { type: String  },
      TNCA: { type: String  },
      KDCA: { type: String  },
      hobbies: { type: String  },
      goal: { type: String  },
      strength:{
        general:{type:String},
        cricket:{type:String}
       },
      weakness:{
        general:{type:String},
        cricket:{type:String}
       },
       bowlerType: {type:String},
       bowlerHand: {type:String},
       battingHand: {type:String},
       medical: {type:String},
       roleModelReal:{
         name: {type:String},
         reason: {type:String},
       },
       roleModelCricket: {
         name: {type:String},
         reason: {type:String}
       }
    },
},
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at"},
  }
);

userSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJwt = function() {
  return jwt.sign({userId: this.userId}, 
    process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXP
    });
}

const UserMaster = mongoose.model("UserMaster", userSchema);
module.exports = UserMaster;