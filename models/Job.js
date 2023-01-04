const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide the company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide the position name"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["inverview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
