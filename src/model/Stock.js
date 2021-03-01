const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  notification_times: [
    {
      _id: false,
      hour: {
        type: Number,
        required: true,
      },
      minutes: {
        type: Number,
        required: true,
      },
    },
  ],
})

module.exports = mongoose.model('Stock', StockSchema)
