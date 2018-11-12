const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;

const User = require("./user")

const tasksSchema = mongoose.Schema({
  title:{type: String, required:true},
  description:{type:String, required:false},
  userId:{type:Schema.Types.ObjectId,ref: User}
});

module.exports = mongoose.model("Tasks", tasksSchema);
