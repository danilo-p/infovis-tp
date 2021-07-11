import Axios from "axios";
import Papa from "papaparse";

const coins = [
  "Aave",
  "CryptocomCoin",
  "Monero",
  "Tron",
  "BinanceCoin",
  "Dogecoin",
  "NEM",
  "USDCoin",
  "Bitcoin",
  "EOS",
  "Polkadot",
  "Uniswap",
  "Cardano",
  "Ethereum",
  "Solana",
  "WrappedBitcoin",
  "ChainLink",
  "Iota",
  "Stellar",
  "XRP",
  "Cosmos",
  "Litecoin",
  "Tether",
];

async function getCoinData(coin) {
  let response = await Axios({
    url: `cryptocurrencypricehistory/coin_${coin}.csv`,
    method: "GET",
  });

  return { coin, data: response.data };
}

function parseData(allData) {
  Object.keys(allData).forEach((coin) => {
    allData[coin] = allData[coin]
      .map((row) => {
        if (!row.SNo) {
          return null;
        }

        try {
          return {
            SNo: Number.parseInt(row.SNo),
            Name: row.Name,
            Symbol: row.Symbol,
            Date: new Date(row.Date),
            High: Number.parseFloat(row.High),
            Low: Number.parseFloat(row.Low),
            Open: Number.parseFloat(row.Open),
            Close: Number.parseFloat(row.Close),
            Volume: Number.parseFloat(row.Volume),
            Marketcap: Number.parseFloat(row.Marketcap),
          };
        } catch (error) {
          return null;
        }
      })
      .filter((row) => row);
  });
}

let cachedData = null;

async function getAllCoinData() {
  if (cachedData) {
    return cachedData;
  }

  let promises = coins.map(getCoinData);

  let allData = await Promise.all(promises);

  let allDataMap = {};
  allData.forEach(({ coin, data }) => {
    allDataMap[coin] = Papa.parse(data, {
      header: true,
    }).data;
  });

  parseData(allDataMap);

  cachedData = allDataMap;

  return allDataMap;
}

const cryptocurrencypricehistory = { getAllCoinData };

export default cryptocurrencypricehistory;
