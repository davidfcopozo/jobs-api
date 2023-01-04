const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
});

//The mongoose pre hook will run before we save the user in the database
//Use the function keyword instead of an arrow function to have access to "this"
UserSchema.pre("save", async function () {
  //genSalt() method generates random bites to hash the password, the parameter number is the amount of rounds of hashes
  const salt = await bcrypt.genSalt(10);
  //This is literally hashing the password, it takes the password and the salt which generates a random string for the hash algorithm to make it unpredictable
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  //user_id is the id we get when creating a new user
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatched = await bcrypt.compare(candidatePassword, this.password);
  return isMatched;
};

module.exports = mongoose.model("User", UserSchema);
