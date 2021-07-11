import * as d3 from "d3";
import * as React from "react";

// D3 Example: https://observablehq.com/@d3/line-chart
class ClosePriceOverTime extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    let data = this.props.data["Aave"];
    let height = 500;
    let width = 1000;
    let margin = { top: 20, right: 30, bottom: 30, left: 40 };
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Close)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    let x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.Date))
      .range([margin.left, width - margin.right]);

    let yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
        );
    let xAxis = (g) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
    let line = d3
      .line()
      .defined((d) => !isNaN(d.Close))
      .x((d) => x(d.Date))
      .y((d) => y(d.Close));

    const svg = d3
      .select(this.myRef.current)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }

  render() {
    return <svg ref={this.myRef}></svg>;
  }
}

export default ClosePriceOverTime;
