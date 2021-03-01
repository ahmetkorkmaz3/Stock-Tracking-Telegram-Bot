const StockModel = require('../model/Stock')
const UserModel = require('../model/User')

const createStock = async ({ name, notification_times, chat_id }) => {
  const stock = await StockModel.create({
    name: name,
    notification_times: notification_times,
  })

  await UserModel.findOneAndUpdate({ chat_id: chat_id }).update({
    $push: {
      stock_list: stock,
    },
  })

  return stock
}

module.exports = { createStock }
