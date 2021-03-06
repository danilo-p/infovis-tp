import * as React from "react";
import cryptocurrencypricehistory from "./cryptocurrencypricehistory";
import CoinRawData from "./CoinRawData";
import ClosePriceOverTime from "./ClosePriceOverTime";
import HorizonChart from "./HorizonChart";
import BarChart from "./BarChart";
import GroupedBarChart from "./GroupedBarChart";
import DailyReturnOverTime from "./DailyReturnOverTime";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: null,
    };
  }

  async componentDidMount() {
    try {
      let data = await cryptocurrencypricehistory.getAllCoinData();
      this.setState({
        isLoaded: true,
        data,
      });
    } catch (error) {
      this.setState({
        isLoaded: true,
        error,
      });
    }
  }

  render() {
    const { error, isLoaded, data } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="container">
          <header className="page-header">
            <h1>Visualização de Dados - Trabalho Prático</h1>
          </header>
          <div id="horizon-chart" className="visualization-section">
            <h2>Horizonte das Criptomoedas</h2>
            <HorizonChart data={data} />
          </div>
          <div className="visualization-section">
            <h2>Capitalização do mercado de 2020</h2>
            <BarChart data={data} />
          </div>
          <div className="visualization-section">
            <h2>Preço final do Marketcap (agrupado ao ano)</h2>
            <GroupedBarChart data={data} />
          </div>
          <div className="visualization-section">
            <h2>Preço de fechamento ao longo do tempo</h2>
            <ClosePriceOverTime data={data} />
          </div>
          <div className="visualization-section">
            <h2>Retorno diário ao logo do tempo</h2>
            <DailyReturnOverTime data={data} />
          </div>
          <div className="visualization-section">
            <h2>Todos os dados</h2>
            <CoinRawData data={data} />
          </div>
        </div>
      );
    }
  }
}

export default App;
