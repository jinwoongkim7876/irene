class Linegraph {
    margin = {
      top: 60, right: 60, bottom: 20, left: 100
    }
  
    constructor(svg, width = 1000, height = 200) {
      this.svg = svg;
      this.width = width;
      this.height = height;
    }
  
    initialize() {
      this.svg = d3.select(this.svg);
      this.container = this.svg.append("g");
      this.xAxis = this.svg.append("g");
      this.yAxis = this.svg.append("g");
      this.legend = this.svg.append("g");
  
      this.xScale = d3.scaleBand();
      this.yScale = d3.scaleLinear();
  
      this.svg
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
  
      this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
  
    }
  
    update(data, xVar, yVar) {
        const result = [];   
        data.forEach(d => {
          let sum = 0;
          
          xVar.forEach((x) => {
            let temp = d.find(obj => obj.region === x)
            sum += temp[yVar];
          });
          result.push(sum);
        });
        console.log(result);
        const categories = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];

        console.log(categories)
        this.xScale.domain(categories).range([0, this.width]).padding(1);
        this.yScale.domain([d3.min(result), d3.max(result)]).range([this.height, 0]);

        const line = d3.line()
            .x((d, i) => this.xScale(categories[i]))
            .y(d => this.yScale(d))
            .curve(d3.curveMonotoneX);

        this.container.selectAll(".line")
            .data([result])
            .join("path")
            .transition()
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

            const dots = this.container.selectAll(".dot")
            .data(result)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d, i) => this.xScale(categories[i]))
            .attr("cy", d => this.yScale(d))
            .attr("r", 5)
            .style("fill", "white")
            .style("stroke", "steelblue");
        
        const labels = this.container.selectAll(".label")
            .data(result)
            .join("text")
            .attr("class", "label")
            .attr("x", (d, i) => this.xScale(categories[i]))
            .attr("y", d => this.yScale(d) - 10)
            .text(d => d.toFixed(0))
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .style("fill", "purple");            
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
        
        this.svg.select(".title").remove();
        this.addTitle(`Line Graph of ${yVar} over ${xVar.join(", ")}`);
    }
    addTitle(titleText) {
      this.svg
        .append("text")
        .attr("class", "title")
        .attr("x", this.width / 2 + this.margin.left)
        .attr("y", this.margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text(titleText);
    }
    
  }
