  const mongoose = require('mongoose');
 const uniqueValidator = require('mongoose-unique-validator');// package pour sassurer que l'utilisateur peux utiliser que un uniq email par compte

 
 
 
 const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true }
  });
  

userSchema.plugin(uniqueValidator, );


  module.exports = mongoose.model('User', userSchema);
