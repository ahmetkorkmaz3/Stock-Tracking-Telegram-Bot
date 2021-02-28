const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  chat_id: {
    type: Number,
    required: true,
    unique: true,
  },
  stock_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
    },
  ],
})

module.exports = mongoose.model('User', UserSchema)
