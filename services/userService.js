const UserModel = require('../model/User')

const findUserByChatId = async (chatId) => {
    const user = await UserModel.findOne({ chat_id: chatId }).populate('Stock')
    return user
}

module.exports = { findUserByChatId }