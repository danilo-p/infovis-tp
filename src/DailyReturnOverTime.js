import * as d3 from "d3";
import * as React from "react";
import CoinSelectField from "./CoinSelectField";
import "./DailyReturnOverTime.css";

class DailyReturnOverTime extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      selectedCoin: "",
    };
  }

  componentDidUpdate() {
    let { selectedCoin } = this.state;
    if (!selectedCoin) {
      return;
    }

    let height = 500;
    let width = 1000;
    let margin = { top: 20, right: 30, bottom: 30, left: 40 };

    let coinData = this.props.data[selectedCoin];
    let data = [];
    for (let i = 0; i < coinData.length; i++) {
      let date = coinData[i].Date;
      let dailyReturn = (coinData[i].Close - coinData[i].Open) / coinData[i].Close;
      data.push({
        "date": date,
        "value": parseFloat(dailyReturn)
      });
    };
    console.log(data);

    let y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    let x = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    let yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "%"))
        .call(g => g.select(".domain").remove())
        .call(g =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y)
        );

    let xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

    let line = d3
      .line()
      .curve(d3.curveStep)
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value));

    let callout = (g, value) => {
      if (!value) return g.style("display", "none");

      g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");

      const path = g.selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

      const text = g.selectAll("text")
        .data([null])
        .join("text")
        .call(text => text
          .selectAll("tspan")
          .data((value + "").split(/\n/))
          .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => `${i * 1.1}em`)
          .style("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));

      const { x, y, width: w, height: h } = text.node().getBBox();
      console.log(x, y, w, h);
      text.attr("transform", `translate(${-w / 2},${15 - y})`);
      path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    }

    function formatValue(value) {
      return value.toLocaleString("en", {
        style: "percent"
      });
    }

    function formatDate(date) {
      return date.toLocaleString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      });
    }

    const bisector = d3.bisector(d => d.date).left;

    const bisect = mx => {
      const date = x.invert(mx);
      const index = bisector(data, date, 1);
      const a = data[index - 1];
      const b = data[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };

    const svg = d3.select(this.myRef.current)
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible");

    svg.selectAll("*").remove();

    svg.attr("viewBox", [0, 0, width, height]);

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);

    const tooltip = svg.append("g");

    svg.on("touchmove mousemove", function (event) {
      const { date, value } = bisect(d3.pointer(event, this)[0]);

      tooltip
        .attr("transform", `translate(${x(date)},${y(value)})`)
        .call(callout, `${formatValue(value)}
        ${formatDate(date)}`);
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout, null));

  }

  selectCoin = (selectedCoin) => {
    this.setState({
      selectedCoin,
    });
  };

  renderInsights = () => {
    return (
      <div className="daily-return-insights">
        <p>Observando a visualização de retornos diários ao longo do tempo, podemos concluir que a volatidade dos retornos de um criptoativo tende a ser concentrada em determinados períodos. Momentos alta de retorno normalmente são seguidos de momento de baixa, e vice versa.</p>
        <p>Este fato pode ser relevante para a tomada de decisão de um investidor ou especulador, com relação ao melhor momento para aportar em determinado criptoativo.</p>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div>
          <CoinSelectField onChange={this.selectCoin} data={this.props.data} />
          <svg ref={this.myRef}></svg>
        </div>
        {this.renderInsights()}
      </div>
    );
  }
}

export default DailyReturnOverTime;
