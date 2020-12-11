const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    sportId: { type: String },
    playerLevel: { type: String },
    playerSkill: {
      batsman: { type: Boolean },
      bowler: { type: Boolean },
      leftHand: { type: Boolean },
      rightHand: { type: Boolean },
      wicketKeeper: { type: Boolean },
      allRounder: { type: Boolean },
    },
    previousTeam: { type: String },
    TNCA: { type: String },
    KDCA: { type: String },
    hobbies: { type: String },
    goal: { type: String },
    strength: {
      general: { type: String },
      cricket: { type: String },
    },
    weakness: {
      general: { type: String },
      cricket: { type: String },
    },
    bowlerType: { type: String },
    bowlerHand: { type: String },
    battingHand: { type: String },
    medical: { type: String },
    roleModelReal: {
      name: { type: String },
      reason: { type: String },
    },
    roleModelCricket: {
      name: { type: String },
      reason: { type: String },
    },
    deletedAt: { type: Date },
    createdBy: { type: String },
    updatedBy: { type: String },
    deletedBy: { type: String },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at" },
  }
);

const UserSports = mongoose.model("UserSports", userSchema);
module.exports = UserSports;
