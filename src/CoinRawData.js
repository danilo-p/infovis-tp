import * as React from "react";
import CoinSelectField from "./CoinSelectField";
import "./CoinRawData.css";

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

  alignmentClassName = (key) => {
    let alignment = {
      SNo: "text-right",
      Date: "text-right",
      High: "text-right",
      Low: "text-right",
      Open: "text-right",
      Close: "text-right",
      Volume: "text-right",
      Marketcap: "text-right",
    };

    return alignment[key] || "";
  };

  renderTableHeaders = (headerNames) => {
    let ths = headerNames.map((headerName) => (
      <th key={headerName} className={this.alignmentClassName(headerName)}>
        {headerName}
      </th>
    ));
    return (
      <thead>
        <tr>{ths}</tr>
      </thead>
    );
  };

  formatDate = (date) => {
    return date.toLocaleDateString();
  };

  formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  formatNumber = (num) => {
    return Number.parseInt(num);
  };

  formatValue = (key, value) => {
    let formatters = {
      Date: this.formatDate,
      High: this.formatPrice,
      Low: this.formatPrice,
      Open: this.formatPrice,
      Close: this.formatPrice,
      Volume: this.formatNumber,
      Marketcap: this.formatNumber,
    };
    return formatters[key] ? formatters[key](value) : `${value}`;
  };

  renderTableBody = (selectedCoinData) => {
    return (
      <tbody>
        {selectedCoinData.map((selectedCoinDataRow) => (
          <tr key={selectedCoinDataRow.SNo}>
            {Object.keys(selectedCoinDataRow).map((key) => (
              <td key={key} className={this.alignmentClassName(key)}>
                {this.formatValue(key, selectedCoinDataRow[key])}
              </td>
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
