import * as d3 from "d3";
import * as React from "react";

// D3 Example: https://observablehq.com/@d3/line-chart
class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {

    let height = 500
    let width = 1450
    let color = "steelblue"
    let margin = ({ top: 30, right: 0, bottom: 30, left: 100 })


    let allData = this.props.data;

    let names = Object.keys(allData);
    let data = [];
    for (let i = 0; i < names.length; i++) {
      let name = names[i]; //nome moeda atual
      let value = allData[name][allData[name].length - 1].Marketcap; //retirando valor mais recente da moeda allData[name].length - 1 refere-se a ultima entrada
      data.push({
        "name": name,
        "value": value
      })
    }

    const svg = d3.select(this.myRef.current)
      .attr("viewBox", [0, 0, width, height]);


    let x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])

    let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))

    let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ MarketCap"))

    svg.append("g")
      .attr("fill", color)
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());


    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

  }

  render() {
    return (
      <div>
        <svg ref={this.myRef}></svg>
      </div>
    );
  }
}

export default BarChart;
