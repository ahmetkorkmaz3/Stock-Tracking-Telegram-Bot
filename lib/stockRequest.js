const axios = require("axios");

const STOCK_API_URL = process.env.STOCK_API_URL;

module.exports = {
  getStockPrice: (stockName) => {
    axios
      .get(STOCK_API_URL + "/hisseyuzeysel/" + stockName)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        console.log("somethings");
      });
  },
};
