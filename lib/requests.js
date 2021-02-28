const axios = require('axios');
const https = require('https');

const STOCK_API_URL = process.env.STOCK_API_URL;
const DOVIZ_API_URL = process.env.DOVIZ_API_URL;

module.exports = {
  getStockPrice: (stockName) => {
    return new Promise((resolve, reject) => {
      axios
        .get(STOCK_API_URL + '/hisseyuzeysel/' + stockName)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject({
            error: `Somethings wrongs. ${stockName} not found`,
          });
        });
    });
  },
  getDovizPrice: () => {
    return new Promise((resolve, reject) => {
      axios
        .get(DOVIZ_API_URL, {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject({
            error: 'Error API not working',
          });
        });
    });
  },
};
