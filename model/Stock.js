const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  notification_times: [
    {
      hour: {
        type: Number,
        min: 0,
        max: 23,
      },
      minutes: {
        Type: Number,
        min: 0
      },
    },
  ],
})

module.exports = mongoose.model('Stock', StockSchema)
