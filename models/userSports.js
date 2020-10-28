const mongoose = require("mongoose");


var userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    sportId: { type: String },
    status: { type: String, default: "ACTIVE" },
    role: { type: String, default: "USER" },
    playerLevel: { type: String  },
    playerSkill: { type: String  },
    previousTeam: { type: String  },
    TNCA: { type: String  },
    KDCA: { type: String  },
    hobbies: { type: String  },
    goal: { type: String  },
    roleModel:{type:String  },
    strength:{type:String  },
    weakness:{type:String  },
    deletedAt: { type: Date  },
    createdBy:{type:String},
    updatedBy:{type:String},
    deletedBy:{type:String }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updated_at" },
  }
);

const UserSports = mongoose.model("UserSports", userSchema);
module.exports = UserSports;