import * as d3 from "d3";
import * as React from "react";
import "./HorizonChart.css";

var count = 0;

function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, window.location) + "";
}

Id.prototype.toString = function() {
  return "url(" + this.href + ")";
};

// D3 Example: https://observablehq.com/@d3/horizon-chart
class HorizonChart extends React.Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    let endDate = new Date();
    let allCoins = Object.keys(props.data);
    this.state = {
      allCoins,
      selectedCoins: allCoins,
      overlap: 5,
      startDate,
      endDate,
      selectedMetric: 'Marketcap'
    };
  }

  transformData = (data) => {
    let metric = this.state.selectedMetric;
    let allCoins = Object.keys(data);
    let transformedData = {
      dates: [],
      series: allCoins.sort()
        .map((coin) => this.state.selectedCoins.includes(coin)
          ? ({ name: coin, values: [] })
          : null)
        .filter((coin) => !!coin)
    };
    let startDate = this.state ? this.state.startDate : null;
    let endDate = this.state ? this.state.endDate : null;

    let allDatesSet = new Set();
    let coinMetrics = {};
    transformedData.series.forEach(({ name }) => {
      coinMetrics[name] = coinMetrics[name] || {};
      data[name].forEach((line) => {
        let { Date } = line;
        if ((!startDate && !endDate) || (startDate <= Date && Date <= endDate)) {
          let ISOString = Date.toISOString();
          coinMetrics[name][ISOString] = Number.parseInt(line[metric]);
          allDatesSet.add(ISOString);
        }
      });
    });

    transformedData.dates = Array.from(allDatesSet.values()).sort();
    for (let i = 0; i < transformedData.series.length; i++) {
      let { name } = transformedData.series[i];
      transformedData.dates.forEach((ISOString) => {
        transformedData.series[i].values.push(coinMetrics[name][ISOString] || 0);
      });
    }

    transformedData.dates = transformedData.dates.map((ISOString) => new Date(ISOString));

    return transformedData;
  }

  renderChart = () => {
    let data = this.transformData(this.props.data);

    let margin = ({top: 30, right: 10, bottom: 0, left: 10});

    let step = 23;

    let height = data.series.length * (step + 1) + margin.top + margin.bottom;
    let width = 1000;
    let scheme = 'schemeBlues';
    let overlap = Number.parseInt(this.state.overlap);

    let color = i => d3[scheme][Math.max(3, overlap)][i + Math.max(0, 3 - overlap)];

    let x = d3.scaleUtc()
      .domain(d3.extent(data.dates))
      .range([0, width]);

    let y = d3.scaleLinear()
      .domain([0, d3.max(data.series, d => d3.max(d.values))])
      .range([0, -overlap * step]);

    let xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
      .call(g => g.selectAll(".tick").filter(d => x(d) < margin.left || x(d) >= width - margin.right).remove())
      .call(g => g.select(".domain").remove())

    let area = d3.area()
      .curve(d3.curveBasis)
      .defined(d => !isNaN(d))
      .x((d, i) => x(data.dates[i]))
      .y0(0)
      .y1(d => y(d))

    const svg = d3.select(this.svgRef.current);

    svg.selectAll("*").remove();

    svg
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

    const g = svg.append("g")
      .selectAll("g")
      .data(data.series.map((d, i) => Object.assign({
        clipId: uid('clip'),
        pathId: uid('path'),
      }, d)))
      .join("g")
        .attr("transform", (d, i) => `translate(0,${i * (step + 1) + margin.top})`);

    g.append("clipPath")
        .attr("id", d => d.clipId.id)
      .append("rect")
        .attr("width", width)
        .attr("height", step);

    g.append("defs").append("path")
        .attr("id", d => d.pathId.id)
        .attr("d", d => area(d.values));

    g.append("g")
        .attr("clip-path", d => d.clipId)
      .selectAll("use")
      .data(d => new Array(overlap).fill(d))
      .join("use")
        .attr("fill", (d, i) => color(i))
        .attr("transform", (d, i) => `translate(0,${(i + 1) * step})`)
        .attr("xlink:href", d => d.pathId.href);

    g.append("text")
        .attr("x", 4)
        .attr("y", step / 2)
        .attr("dy", "0.35em")
        .text(d => d.name);

    svg.append("g")
        .call(xAxis);
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  handleOverlapChange = (event) => {
    this.setState({ overlap: Number.parseInt(event.target.value) });
  }

  handleStartDateChange = (event) => {
    this.setState({
      startDate: new Date(event.target.value)
    });
  }

  handleEndDateChange = (event) => {
    this.setState({
      endDate: new Date(event.target.value)
    });
  }

  handleSelectedMetricChange = (event) => {
    this.setState({
      selectedMetric: event.target.value
    });
  }

  handleCoinSelectionChange = (coin) => {
    let { selectedCoins } = this.state;

    if (selectedCoins.includes(coin)) {
      selectedCoins  = selectedCoins.filter((selectedCoin) => selectedCoin !== coin);
    } else {
      selectedCoins.push(coin);
    }

    this.setState({ selectedCoins });
  }

  handleSelectAllCoins = () => {
    if (this.state.selectedCoins.length === this.state.allCoins.length) {
      this.setState({
        selectedCoins: []
      })
    } else {
      this.setState({
        selectedCoins: this.state.allCoins
      })
    }
  }

  renderCoinSelector = () => {
    return (
      <span>
        <label className='coin-field'>
          <input
            type="checkbox"
            checked={this.state.selectedCoins.length === this.state.allCoins.length}
            onChange={this.handleSelectAllCoins}
          /> Selecionar todas
        </label>
        {
          this.state.allCoins.sort().map((coin) => (
            <label key={coin} className='coin-field'>
              <input
                type="checkbox"
                checked={this.state.selectedCoins.includes(coin)}
                onChange={() => this.handleCoinSelectionChange(coin)}
              /> {coin}
            </label>
          ))
        }
      </span>
    );
  }

  render() {
    return (
      <div>
        <div>
          Métrica:
          <select
            onChange={this.handleSelectedMetricChange}
            value={this.state.selectedMetric}
            className="horizon-chart-input form-control"
          >
            <option value="Marketcap">Marketcap</option>
            <option value="Close">Close</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Open">Open</option>
            <option value="Volume">Volume</option>
          </select>

          <span className="horizon-chart-input-separator">•</span>

          Data de Início:
          <input
            type="date" 
            value={this.state.startDate.toISOString().split("T")[0]} 
            onChange={this.handleStartDateChange}
            className="horizon-chart-input form-control"
          />

          <span className="horizon-chart-input-separator">•</span>

          Data de Fim:
          <input
            type="date" 
            value={this.state.endDate.toISOString().split("T")[0]} 
            onChange={this.handleEndDateChange}
            className="horizon-chart-input form-control"
          />

          <span className="horizon-chart-input-separator">•</span>

          Bandas: {this.state.overlap}
          <input
            type="range" 
            min="1"
            max="9" 
            value={this.state.overlap} 
            onChange={this.handleOverlapChange}
            step="1"
            className="horizon-chart-input"
          />
        </div>
        <div className='coin-selector-bar'>
          {this.renderCoinSelector()}
        </div>
        <svg ref={this.svgRef}></svg>
      </div>
    );
  }
}

export default HorizonChart;
