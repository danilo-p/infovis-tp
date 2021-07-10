import * as React from "react";
import cryptocurrencypricehistory from "./cryptocurrencypricehistory";
import RawData from "./RawData";

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
          <header>
            <h1>Visualização de Dados - Trabalho Prático</h1>
          </header>
          <div className="visualization-section">
            <RawData data={data} />
          </div>
        </div>
      );
    }
  }
}

export default App;
