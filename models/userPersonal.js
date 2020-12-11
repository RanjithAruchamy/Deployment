const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
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
    deletedAt: { type: Date  },
    createdBy:{type:String},
    updatedBy:{type:String },
    deletedBy:{type:String }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at" },
  }
);

const UserPersonal = mongoose.model("UserPersonal", userSchema);
module.exports = UserPersonal;