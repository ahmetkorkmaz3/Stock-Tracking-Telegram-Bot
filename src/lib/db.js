const mongoose = require('mongoose')

const connect = async () => {
  const db = await mongoose.connect(process.env.DB_CONNECT_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  console.log('Database connected:', db.connection.name)
}

module.exports = { connect }
