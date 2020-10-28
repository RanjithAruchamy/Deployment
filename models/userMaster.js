const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    status: { type: String, default: "ACTIVE" },
    role: { type: String, default: "USER" },
    isVerified:{type:Boolean},
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
      fatherName:{type:String},
      motherName:{type:String },
      permanentAddress:{type:String },
      temporaryAddress:{type:String },
      bloodGroup:{type:String },
      age:{type:Number },
      dob:{type:Date },
      height:{type:String },
      profession:{type:String },
      organization:{type:String }
    },
    sports:{
      sportId:{type:String},
      playerLevel: { type: String  },
      playerSkill: { type: String  },
      previousTeam: { type: String  },
      TNCA: { type: String  },
      KDCA: { type: String  },
      hobbies: { type: String  },
      goal: { type: String  },
      roleModel:{type:String  },
      strength:{type:String  },
      weakness:{type:String  }
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