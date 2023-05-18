class Barchart {
    margin = {
        top: 60, right: 10, bottom: 40, left: 60
    }

    constructor(svg, width = 500, height = 150) {
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

    update(data, xVar, zVar) {
            const filteredData = (data[zVar].filter(d => xVar.includes(d.region)));//.map(function(e){return +e})
            const results = filteredData.reduce((acc, curr) => {
                for (const key in curr) {
                if (key !== 'region') {
                    acc[key] = (acc[key] || 0) + curr[key];
                }
                }
                return acc;
            }, {});

            const keys = Object.keys(results);
            const values = Object.values(results);
            
            this.xScale.domain(keys).range([0, this.width]).padding(0.3);
            this.yScale.domain([0, Math.max(...values)]).range([this.height, 0]);

            this.container.selectAll("rect")
            .data(values)
            .join("rect")        
            .transition()
            .attr("x", (d,i) => this.xScale(keys[i]))
            .attr("y", d => this.yScale(d))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(d))
            .attr("fill", "lightblue")     

            this.container.selectAll("text")
            .data(values)
            .join("text")          
            .attr("id", (d, i) => `text-${i}`)
            .text(d => d)
            .attr("x", (d, i) => this.xScale(keys[i]) + this.xScale.bandwidth() / 2)
            .attr("y", d => this.yScale(d) - 5)
            .style("text-anchor", "middle")
            .attr("font-size", "11px")
            .attr("fill", "black");

            this.xAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
                .transition()
                .call(d3.axisBottom(this.xScale));

            this.yAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
                .transition()
                .call(d3.axisLeft(this.yScale));
           
            this.xAxis.selectAll("text")
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "end")
                .attr("dx", "-0.5em")
                .attr("dy", "-0.5em")
                   
            this.svg.select(".title").remove();
            this.addTitle(`Age range of ${+zVar + 2012} over ${xVar.join(", ")}`);
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