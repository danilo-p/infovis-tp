import * as React from "react";

class RawData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCoin: "",
      page: 0,
    };

    this.getCoinNames = this.getCoinNames.bind(this);
    this.getCoinOptions = this.getCoinOptions.bind(this);
    this.selectCoin = this.selectCoin.bind(this);
    this.renderCoinSelectField = this.renderCoinSelectField.bind(this);
    this.renderCoinTable = this.renderCoinTable.bind(this);
    this.renderTableHeaders = this.renderTableHeaders.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
  }

  getCoinNames() {
    return Object.keys(this.props.data);
  }

  getCoinOptions() {
    return this.getCoinNames().map((coin) => (
      <option key={coin} value={coin}>
        {coin}
      </option>
    ));
  }

  selectCoin(event) {
    this.setState({
      selectedCoin: event.target.value,
      page: 0,
    });
  }

  renderCoinSelectField() {
    return (
      <select onChange={this.selectCoin} value={this.state.selectedCoin}>
        <option value="">Selecione uma moeda</option>
        {this.getCoinOptions()}
      </select>
    );
  }

  renderTableHeaders(headerNames) {
    let ths = headerNames.map((headerName) => (
      <th key={headerName}>{headerName}</th>
    ));
    return (
      <thead>
        <tr>{ths}</tr>
      </thead>
    );
  }

  renderTableBody(selectedCoinData) {
    return (
      <tbody>
        {selectedCoinData.map((selectedCoinDataRow) => (
          <tr key={selectedCoinDataRow.SNo}>
            {Object.keys(selectedCoinDataRow).map((key) => (
              <td key={key}>{selectedCoinDataRow[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  renderCoinTable() {
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
  }

  render() {
    return (
      <div>
        <div>{this.renderCoinSelectField()}</div>
        <div>{this.renderCoinTable()}</div>
      </div>
    );
  }
}

export default RawData;
