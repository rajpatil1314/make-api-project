const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  
  role: { type: String ,
    default : "user"
   },
  location: { type: String },
  password: { type: String, required: true },
});

const usermodel = mongoose.model("user" , userSchema);

module.exports = usermodel