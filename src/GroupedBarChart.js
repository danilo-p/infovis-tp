import * as d3 from "d3";
import * as React from "react";

// D3 Example: https://observablehq.com/@d3/line-chart
class GroupedBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  getGrowthRate(data) {
    let coinsGrowthRate = {}
    let coinNames = Object.keys(data)
    let firstValue = 0, lastValue = 0
    let year
    let growthRate = 0

    for (let i = 0; i < coinNames.lenght; i++) { //para cada moeda
      let currentCoinName = coinNames[i] //pega o nome atual da moeda

      if (!coinsGrowthRate[currentCoinName]) { //verifica se a saída coinsGrowthRate possui aquela moeda, se não possuir ela é criada
        coinsGrowthRate[currentCoinName] = {}
      }

      year = data[currentCoinName][0].Date.getYear() //pega o primeiro ano existente da moeda
      firstValue = data[currentCoinName][0].Marketcap // pega o primeiro marketcap da moeda

      for (let j = 0; j < data[currentCoinName].lenght; j++) { //calcula a taxa por ano da moeda atual
        if (data[currentCoinName][j].Date.getYear() !== year) { //verifica mudança de ano para calcular a taxa
          lastValue = data[currentCoinName][j - 1].Marketcap //ultimo valor do ano corrente
          growthRate = ((lastValue - firstValue) / firstValue) * 100  //taxa de crescimento em porcentagem
          coinsGrowthRate[currentCoinName].push({
            "year": year - 1,
            "growthRate": growthRate
          })
          firstValue = data[currentCoinName][j].Marketcap
          year = data[currentCoinName][j].Date.getYear()
        }
      }
    }

    return coinsGrowthRate;
  }

  componentDidMount() {
    let data = this.props.data;
    let height = 500;
    let width = 1000;
    let margin = { top: 20, right: 30, bottom: 30, left: 40 };
    let values = this.getGrowthRate(data);
    console.log(values)

    // let y = d3
    //   .scaleLinear()
    //   .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
    //   .rangeRound([height - margin.bottom, margin.top])

    // let grouped_x = d3
    //   .scaleBand()
    //   .domain(data.map(d => d[groupKey]))
    //   .rangeRound([margin.left, width - margin.right])
    //   .paddingInner(0.1)

    // let x = d3
    //   .scaleBand()
    //   .domain(keys)
    //   .rangeRound([0, grouped_x.bandwidth()])
    //   .padding(0.05)

    // let xAxis = (g) => g
    //   .attr("transform", `translate(0,${height - margin.bottom})`)
    //   .call(d3.axisBottom(grouped_x).tickSizeOuter(0))
    //   .call(g => g.select(".domain").remove())

    // let yAxis = (g) => g
    //   .attr("transform", `translate(${margin.left},0)`)
    //   .call(d3.axisLeft(y).ticks(null, "s"))
    //   .call(g => g.select(".domain").remove())
    //   .call(g => g.select(".tick:last-of-type text").clone()
    //     .attr("x", 3)
    //     .attr("text-anchor", "start")
    //     .attr("font-weight", "bold")
    //     .text(data.y))

    // let color = d3.scaleOrdinal()
    //   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])


    // const svg = d3.select(this.myRef.current);

    // svg
    //   .append("g")
    //   .selectAll("g")
    //   .data(data)
    //   .join("g")
    //   .attr("transform", d => `translate(${grouped_x(d[groupKey])},0)`)
    //   .selectAll("rect")
    //   .data(d => keys.map(key => ({ key, value: d[key] })))
    //   .join("rect")
    //   .attr("x", d => x(d.key))
    //   .attr("y", d => y(d.value))
    //   .attr("width", x.bandwidth())
    //   .attr("height", d => y(0) - y(d.value))
    //   .attr("fill", d => color(d.key));

    // svg
    //   .append("g")
    //   .call(xAxis);

    // svg
    //   .append("g")
    //   .call(yAxis);

    // svg
    //   .append("g")
    //   .call(legend);



    // let legend = (svg) => {
    //   const g = svg
    //     .attr("transform", `translate(${width},0)`)
    //     .attr("text-anchor", "end")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .selectAll("g")
    //     .data(color.domain().slice().reverse())
    //     .join("g")
    //     .attr("transform", (d, i) => `translate(0,${i * 20})`);

    //   g.append("rect")
    //     .attr("x", -19)
    //     .attr("width", 19)
    //     .attr("height", 19)
    //     .attr("fill", color);

    //   g.append("text")
    //     .attr("x", -24)
    //     .attr("y", 9.5)
    //     .attr("dy", "0.35em")
    //     .text(d => d);
    // }
  }

  render() {
    return (
      <div>
        <svg ref={this.myRef}></svg>
      </div>
    );
  }
}

export default GroupedBarChart;
