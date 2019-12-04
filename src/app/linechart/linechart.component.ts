import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../assets/line_data.json';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {
  linedata;svg;myColor;x;y;
  countries=["USA", "CAN", "MEX", "GBR", "DEU", "FRA", "KOR", "JPN", "IND"]
  wd_arr=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  margin = { top: 50, right: 140, bottom: 50, left: 50 };
  width = 900 - this.margin.left - this.margin.right;
  height = 450 - this.margin.top - this.margin.bottom;

  ngOnInit() {
    this.linedata = (data as any).default;

    this.svg = d3.select(".linechart")
      .attr("viewBox", `0 0 900 450`)
      .append("g")
      .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")")

    // set title
    this.svg.append('text').attr("class", 'svg-title').attr("x", this.width / 2).attr("y", -20)
      .text("Which Weekday Accelerate the Trending Speed of Youtube Videos Most")

    this.myColor = d3.scaleOrdinal()
      .domain(this.countries)
      .range(d3.schemePaired);

    this.x = d3.scalePoint().domain(this.wd_arr).range([0, this.width]).padding(0.5);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.drawline(this.linedata)
  }

  new_line(data){
    d3.selectAll("svg path.svgline").remove();
    d3.selectAll("g.pointg").remove();

    var x=this.x,y=this.y,svg=this.svg,wd_arr=this.wd_arr
    var transition = this.svg.transition().duration(800);
    var delay = function(d, i) {return i * 50;};

    if (data.length>1)
      y.domain([0,6.2])
    else
        // @ts-ignore
      y.domain([d3.min(data[0].v.map(x=>x.Value))*0.9, data[0].v[0].Max*1.05]).ticks(8)
    transition.select("#y-axis").call(d3.axisLeft(y).tickSizeInner(-this.width));
    d3.selectAll("#y-axis .tick line").style("stroke","darkgrey").style("stroke-dasharray",3)
    // d3.select("#y-axis .tick line").style("stroke","black").style("stroke-dasharray",0)

    var line0 = d3.line()
        // @ts-ignore
      .x(function(d) {console.log(x(wd_arr[d.Weekday - 1]));return x(wd_arr[d.Weekday - 1]);}).y(function(d) {return y(d.Value);});

    svg.selectAll(".svgline")
      .data(data).enter()
      .append("path")
      .datum(d => d.v)
      .attr("class", (d, i) => "svgline line" + i)
      .attr("d", line0)
      .attr("stroke", (d) => this.myColor(d[0].Country))
      .style("stroke-width", 2)
      .style("fill", "none")

    // add valuepoints
    var pointg = svg.selectAll(".points")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "pointg")
      .attr("fill", d => this.myColor(d.k))

    pointg.selectAll(".circleli")
      .data(d => d.v)
      .enter()
      .append("circle")
      .attr("cx", d => x(wd_arr[d.Weekday - 1]))
      .attr("cy", d => y(d.Value))
      .attr("r", 6)
      .attr("fill-opacity", 0)
      .on("mouseover", function(d) {
        d3.select(this).attr("fill-opacity", 1);
        //add tooltip
        var tooltip = svg.append("g").classed("tips", true)
        var border = tooltip.append('rect')
          .attr("x", x(wd_arr[d.Weekday - 1]))
          .attr("y", y(d.Value))
          .attr("rx",5)
          .attr("height", 55)
          .attr("width", 174)
          .attr("class", 'class_rect');
        var comment = tooltip.append('text')
          .attr("x", x(wd_arr[d.Weekday - 1]) + 10)
          .attr("y", y(d.Value) + 23)
          .style("font-size","13px")
          .text('Country:' + d.Country);
        var comment1 = tooltip.append('text')
          .attr("x", x(wd_arr[d.Weekday - 1]) + 10)
          .attr("y", y(d.Value) + 44)
          .style("font-size","13px")
          .text('Ave Duration Time:' + '\n' + Math.floor(d.Value * 100) / 100 + ' Day');
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill-opacity", 0);
        svg.selectAll('.tips').remove();

      });
  }

  drawline(data){

    var x=this.x,y=this.y,svg=this.svg,wd_arr=this.wd_arr

    // draw all lines
    // 1. update axis first
    // Add X axis
    svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(x));

    // Add Y axis
    y.domain([0, 6.2])
    svg.append("g")
      .attr("id", "y-axis")
      .call(d3.axisLeft(y).tickSizeInner(-this.width));
    d3.selectAll("#y-axis .tick line").style("stroke","darkgrey").style("stroke-dasharray",3)
    d3.select("#y-axis .tick line").style("stroke","black").style("stroke-dasharray",0)

    // add legends
        // @ts-ignore
    var legendy = d3.scaleBand([20, this.height*0.65]).domain(this.countries).padding(0.3)
    var legends = svg.append("g")
      .attr("class", "legend")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .on("mouseover", (d, i) => svg.select(".svgline.line" + i).style("stroke-width", 5))
      .on("mouseout", (d, i) => svg.select(".svgline.line" + i).style("stroke-width", 2))

    legends.append("rect")
      .attr("x", this.width + 20)
      .attr("y", d => legendy(d.k) + 8)
      .attr("width", 30)
      .attr("height", 4)
      .attr("fill", (d) => this.myColor(d.k))

    var textg = legends.append("g")
    textg.append("text")
      .attr("x", this.width + 55)
      .attr("y", d => legendy(d.k) + 14)
      .text(d => d.k)

    // add axes labels
    svg.append("text")
      .attr("class","axis-label")
      .attr("x", this.width/2)
      .attr("y", this.height + 40)
      .text("Weekday")
    svg.append("text")
      .attr("class","axis-label")
      .attr("x", -this.height/2)
      .attr("y", -35)
      .attr("transform","rotate(-90)") //after rotate 90 deg the x,y position exchanged
      .text("Avg. Days to Become a Trend")

    // 4. draw all lines
    var line0 = d3.line()
        // @ts-ignore
      .x(function(d) {return x(wd_arr[d.Weekday - 1]);}).y(function(d) {return y(d.Value);});

    svg.selectAll(".svgline")
      .data(data)
      .enter()
      .append("path")
      .datum(d => d.v)
      .attr("class", (d, i) => "svgline line" + i)
      .attr("d", line0)
      .attr("stroke", (d) => this.myColor(d[0].Country))
      .style("stroke-width", 2)
      .style("fill", "none")

    // add valuepoints
    var pointg = svg.selectAll(".points")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "pointg")
      .attr("fill", d => this.myColor(d.k))

    pointg.selectAll(".circleli")
      .data(d => d.v)
      .enter()
      .append("circle")
      .attr("cx", d => x(wd_arr[d.Weekday - 1]))
      .attr("cy", d => y(d.Value))
      .attr("r", 6)
      .attr("fill-opacity", 0)
      .on("mouseover", function(d) {
        d3.select(this).attr("fill-opacity", 1);
        //add tooltip
        var tooltip = svg.append("g").classed("tips", true)
        var border = tooltip.append('rect')
          .attr("x", x(wd_arr[d.Weekday - 1]))
          .attr("y", y(d.Value))
          .attr("rx",5)
          .attr("height", 55)
          .attr("width", 174)
          .attr("class", 'class_rect');
        var comment = tooltip.append('text')
          .attr("x", x(wd_arr[d.Weekday - 1]) + 10)
          .attr("y", y(d.Value) + 23)
          .style("font-size","13px")
          .text('Country:' + d.Country);
        var comment1 = tooltip.append('text')
          .attr("x", x(wd_arr[d.Weekday - 1]) + 10)
          .attr("y", y(d.Value) + 44)
          .style("font-size","13px")
          .text('Ave Duration Time:' + '\n' + Math.floor(d.Value * 100) / 100 + ' Day');
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill-opacity", 0);
        svg.selectAll('.tips').remove();

      });

  }

  @HostListener("click",['$event.srcElement']) redraw(srcEle){
    if (srcEle.nodeName=="BUTTON"){
      var country = srcEle.textContent;
      if (country.length>3){
        // all countries
        this.new_line(this.linedata);
      }else{
        var data = this.linedata.filter(x=>x.k==country)
        this.new_line(data)

      }
    }
  }
}
