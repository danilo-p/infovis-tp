import * as React from "react";
import "./CoinSelectField.css";

class CoinSelectField extends React.Component {
  constructor(props) {
    super(props);

    let selectedCoin = Object.keys(props.data)[0];
    this.state = {
      selectedCoin,
    };
  }

  componentDidMount() {
    this.props.onChange(this.state.selectedCoin);
  }

  getCoinNames = () => {
    return Object.keys(this.props.data);
  };

  getCoinOptions = () => {
    return this.getCoinNames().map((coin) => (
      <option key={coin} value={coin}>
        {coin}
      </option>
    ));
  };

  selectCoin = (event) => {
    let selectedCoin = event.target.value;
    this.setState({
      selectedCoin,
    });

    this.props.onChange(selectedCoin);
  };

  render() {
    return (
      <select
        className="form-control coin-select-field"
        onChange={this.selectCoin}
        value={this.state.selectedCoin}
      >
        {this.getCoinOptions()}
      </select>
    );
  }
}

export default CoinSelectField;
