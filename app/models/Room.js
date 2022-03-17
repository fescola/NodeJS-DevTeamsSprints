const string = require("@hapi/joi/lib/types/string");
const mongoose = require("mongoose");
const User = require("./User");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  users: {
    type: Object
  },
  messages:{
      type: Object,
      default: undefined,
      msg:{
        type:String
      },
      user:{
        nom:String,
      },
      date: {
        type: Date,
        default: Date.now,
      }
  }
});

module.exports = mongoose.model("Room", roomSchema);