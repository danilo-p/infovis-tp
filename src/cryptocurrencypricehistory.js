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

  cachedData = allDataMap;

  return allDataMap;
}

const cryptocurrencypricehistory = { getAllCoinData };

export default cryptocurrencypricehistory;
