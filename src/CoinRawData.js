import * as React from "react";
import CoinSelectField from "./CoinSelectField";

class CoinRawData extends React.Component {
  constructor(props) {
    super(props);

    console.log();

    this.state = {
      selectedCoin: "",
    };
  }

  selectCoin = (selectedCoin) => {
    this.setState({
      selectedCoin,
    });
  };

  renderTableHeaders = (headerNames) => {
    let ths = headerNames.map((headerName) => (
      <th key={headerName}>{headerName}</th>
    ));
    return (
      <thead>
        <tr>{ths}</tr>
      </thead>
    );
  };

  renderTableBody = (selectedCoinData) => {
    return (
      <tbody>
        {selectedCoinData.map((selectedCoinDataRow) => (
          <tr key={selectedCoinDataRow.SNo}>
            {Object.keys(selectedCoinDataRow).map((key) => (
              <td key={key}>{`${selectedCoinDataRow[key]}`}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  renderCoinTable = () => {
    let { selectedCoin } = this.state;
    let { data } = this.props;

    if (!selectedCoin) {
      return null;
    }

    let selectedCoinData = data[selectedCoin];

    let headerNames = Object.keys(selectedCoinData[0]);

    return (
      <div className="table-responsive">
        <table className="table">
          {this.renderTableHeaders(headerNames)}
          {this.renderTableBody(selectedCoinData)}
        </table>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div>
          <CoinSelectField onChange={this.selectCoin} data={this.props.data} />
        </div>
        <div>{this.renderCoinTable()}</div>
      </div>
    );
  }
}

export default CoinRawData;
