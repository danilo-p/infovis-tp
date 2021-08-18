import * as d3 from "d3";
import * as React from "react";

// D3 Example: https://observablehq.com/@d3/line-chart
class GroupedBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  getGrowthRate(data, coinNames) {
    let coinsGrowthRate = {}
    let firstValue = 0, lastValue = 0
    let year
    let growthRate = 0

    for (let i = 0; i < coinNames.length; i++) { //para cada moeda
      let currentCoinName = coinNames[i] //pega o nome atual da moeda

      if (!(currentCoinName in coinsGrowthRate)) { //verifica se a saída coinsGrowthRate possui aquela moeda, se não possuir ela é criada
        coinsGrowthRate[currentCoinName] = {}
      }

      year = parseInt(data[currentCoinName][0].Date.toISOString().split("-")[0]) //pega o primeiro ano existente da moeda
      firstValue = data[currentCoinName][0].Marketcap // pega o primeiro marketcap da moeda

      let yearIndex = 0
      for (let j = 0; j < data[currentCoinName].length; j++) { //calcula a taxa por ano da moeda atual
        if (parseInt(data[currentCoinName][j].Date.toISOString().split("-")[0]) !== year) { //verifica mudança de ano para calcular a taxa

          lastValue = data[currentCoinName][j - 1].Marketcap //ultimo valor do ano corrente
          year = parseInt(data[currentCoinName][j - 1].Date.toISOString().split("-")[0])
          growthRate = (((lastValue - firstValue) / firstValue) * 100)

          coinsGrowthRate[currentCoinName][yearIndex] = {
            "year": year,
            "growthRate": Number.isFinite(growthRate) ? growthRate : 0
          }

          firstValue = data[currentCoinName][j].Marketcap
          year = parseInt(data[currentCoinName][j].Date.toISOString().split("-")[0])
          yearIndex++
        }
      }
    }

    return coinsGrowthRate
  }

  createArrayYears(growthRateByCoin, coinNames) {
    let yearsArray = []

    for (let i = 0; i < coinNames.length; i++) { //para cada moeda

      let currentCoinName = coinNames[i] //pega o nome atual da moeda

      for (let j = 0; j < Object.keys(growthRateByCoin[currentCoinName]).length; j++) {//preenche o array com todos os anos encontrados

        if (!yearsArray.includes(growthRateByCoin[currentCoinName][j].year)) {
          yearsArray.push(growthRateByCoin[currentCoinName][j].year)
        }
      }
    }

    return yearsArray.sort() //retorna o array ordenado
  }

  createParamsToGraph(growthRateByCoin, coinNames, yearsArray) {
    let data = []

    for (let i = 0; i < yearsArray.length; i++) {

      for (let j = 0; j < coinNames.length; j++) {

        let currentCoinName = coinNames[j]

        for (let k = 0; k < Object.keys(growthRateByCoin[currentCoinName]).length; k++) {
          if (growthRateByCoin[currentCoinName][k].year > yearsArray[i]) {
            break
          }
          if (growthRateByCoin[currentCoinName][k].year === yearsArray[i]) {

            data.push({
              "name": currentCoinName,
              "year": growthRateByCoin[currentCoinName][k].year,
              "growthRate": growthRateByCoin[currentCoinName][k].growthRate
            })
          }
        }
      }
    }
    return data
  }

  processData(dataForGraph, coinNames, yearsArray) {
    let data = []

    for (let i = 0; i < yearsArray.length; i++) {
      let coinsPlusGrowthRate = {}
      let currentYear = yearsArray[i];
      coinsPlusGrowthRate["year"] = currentYear

      for (let j = 0; j < dataForGraph.length; j++) {
        if (dataForGraph[j].year > currentYear) {
          break
        }
        if (dataForGraph[j].year === currentYear) {
          coinsPlusGrowthRate[dataForGraph[j].name] = dataForGraph[j].growthRate
        }
      }

      data.push(coinsPlusGrowthRate)
    }

    coinNames.unshift("year")
    data["columns"] = coinNames
    data["y"] = "Growth Rate"

    return data
  }

  componentDidMount() {
    let allData = this.props.data;
    let height = 500;
    let width = 1000;
    let margin = { top: 20, right: 100, bottom: 30, left: 40 };
    let coinNames = Object.keys(allData) //contem a lista com nome das moedas
    let growthRateByCoin = this.getGrowthRate(allData, coinNames); //contem um objeto com o ano e a taxa de crescimento anual, por moeda
    let yearsArray = this.createArrayYears(growthRateByCoin, coinNames) //contem um array com todos os anos existentes na base de dados
    let dataForGraph = this.createParamsToGraph(growthRateByCoin, coinNames, yearsArray)
    let data = this.processData(dataForGraph, coinNames, yearsArray)

    const svg = d3.select(this.myRef.current);
    svg.attr("viewBox", [0, 0, width, height]);

    const groupKey = data.columns[0]
    const keys = data.columns.slice(1)

    let y = d3
      .scaleSymlog()
      .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))])
      .nice()
      .rangeRound([height - margin.bottom, margin.top])

    let x0 = d3
      .scaleBand()
      .domain(data.map(d => d[groupKey]))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.1)

    let x1 = d3
      .scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0)

    let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .call(g => g.select(".domain").remove())

    let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5, "s"))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -margin.left)
        .attr("y", -12)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("font-size", 15)
        .text(data.y))

    let color = d3.scaleOrdinal()
      .range([
        "#201923",
        "#fcff5d",
        "#7dfc00",
        "#0ec434",
        "#228c68",
        "#8ad8e8",
        "#235b54",
        "#29bdab",
        "#3998f5",
        "#37294f",
        "#277da7",
        "#3750db",
        "#f22020",
        "#991919",
        "#ffcba5",
        "#e68f66",
        "#c56133",
        "#96341c",
        "#632819",
        "#ffc413",
        "#f47a22",
        "#2f2aa0",
        "#b732cc",
        "#772b9d",
        "#f07cab",
        "#d30b94",
        "#edeff3",
        "#c3a5b4",
        "#946aa2",
        "#5d4c86"
      ])


    let legend = (svg) => {
      const g = svg
        .attr("transform", `translate(${width},0)`)
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      g.append("rect")
        .attr("x", -19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

      g.append("text")
        .attr("x", -24)
        .attr("y", 9.5)
        .attr("dy", "0.35em")
        .text(d => d);
    }

    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({ key, value: d[key] > 0 ? d[key] : 0 })))
      .join("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(d.key));

    svg
      .append("g")
      .call(xAxis);

    svg
      .append("g")
      .call(yAxis);

    svg
      .append("g")
      .call(legend);
  }

  renderInsights = () => {
    return (
      <div className="insights">
        <p>Essa visualização mostra o valor do Marketcap ao final de cada ano, para cada moeda. Assim, conseguimos comparar, numa visão anual, o desenvolvimento, a evolução e a variação das moedas com relação ao Marketcap (valor relativo de uma criptomoeda em relação às outras).</p>
        <p></p>
      </div>
    );
  };



  render() {
    return (
      <div>
        <div>
          <svg ref={this.myRef}></svg>
        </div>
        {this.renderInsights()}
      </div>

    );
  }
}

export default GroupedBarChart;
