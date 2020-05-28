const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// const getCurrentTime = () => {
//   const now = new Date();
//   return now.getHours() + ":" + now.getMinutes();
// };

const MessageSchema = new Schema({

  room: {
    type: String,
    required: true
  },
  message: 
    {
        type: String,
        required: true
      },

  time: { 
    type: Date, 
    default: Date.now() 
},
   sender:{
    type: String,
    required: true
   },
   senderName:{
    type: String,
    required: true
   }
});

module.exports = Message = mongoose.model("Messages", MessageSchema);