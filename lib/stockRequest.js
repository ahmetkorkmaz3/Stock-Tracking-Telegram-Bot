const axios = require("axios");

const STOCK_API_URL = process.env.STOCK_API_URL;

module.exports = {
  getStockPrice: (stockName) => {
    return new Promise((resolve, reject) => {
      axios
        .get(STOCK_API_URL + "/hisseyuzeysel/" + stockName)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject({
            error: `Somethings wrongs. ${stockName} not found`
          })
        });
    });
  },
};
