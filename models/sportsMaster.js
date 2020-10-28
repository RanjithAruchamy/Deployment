const mongoose = require("mongoose");

var sportsSchema = new mongoose.Schema(
  {
    sportId: { type: String, unique: true },
    status: { type: String, default: "ACTIVE" },
    sportName:{type: String },
    sportType:{type:String},
    players: [{
      userId:{type: String}
    }],
    forms:[{
      formId:{type:String}
    }],
    deletedAt: { type: Date, default:null },
    createdBy:{type:String},
    updatedBy:{type:String, default:null},
    deletedBy:{type:String, default: null}
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at" },
  }
);

const sportsMaster = mongoose.model("SportsMaster", sportsSchema);
module.exports = sportsMaster;