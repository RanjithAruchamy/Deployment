const mongoose = require("mongoose");
const { schema } = require("./userMaster");

var formSchema = new mongoose.Schema(
  {
    formId: { type: String, unique: true },
    sportId: { type: String },
    status: { type: String, default: "ACTIVE" },
    formName:{type:String},
    deletedAt: { type: Date, default: null },
    createdBy:{type:String},
    updatedBy:{type:String, default: null},
    deletedBy:{type:String, default: null}
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at" },
  }
);

const formMaster = mongoose.model("formMaster", formSchema);
module.exports = formMaster;