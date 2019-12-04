import { Component, OnInit, Input } from '@angular/core';
import * as D3 from 'd3';
import * as d from '../../assets/topcate.json' ;


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {
  @Input() title:string;
  @Input() xlabel:string;
  @Input() ylabel:string;

  constructor() { }

  ngOnInit() {
    const data = (d as any).default;

    const svgWidth = 700, svgHeight=600
    const margin = { top: 70, right: 0, bottom: 0, left: 130 }; //step1: set margin
    const width = svgWidth - margin.left - margin.right, //step2: set width and height
      height = svgHeight - margin.top - margin.bottom;
    const maxv = D3.max(data, function(d){return d[1];});

    const svg = D3.select(".barchart")
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // axes scales
    var x = D3.scaleLinear()
      .domain([0, maxv*1.08]).range([0,width])
    var xAxis = D3.axisTop(x).tickSizeOuter(0).ticks(7)

    var y = D3.scaleBand()
      .domain(data.map(d => {return d[0];}))
      .range([0,height])
      .padding(0.2)
    var yAxis = D3.axisLeft(y).tickSizeOuter(0)

    // append x axis
    svg.append("g").call(xAxis);
    // append y axis
    svg.append("g").call(yAxis);

    // add axes labels
    svg.append("text")
      .attr("class","axis-label")
      .attr("x", width)
      .attr("y", -27)
      .style("text-anchor","end")
      .text(this.xlabel)
    svg.append("text")
      .attr("class","axis-label")
      .attr("x", -height/2)
      .attr("y", -115)
      .attr("transform","rotate(-90)") //after rotate 90 deg the x,y position exchanged
      .text(this.ylabel)

    // add title
    svg.append("text")
      .attr("class","svg-title")
      .attr("x",width/2)
      .attr("y",-49)
      .text(this.title)

    // add bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 1.4)
      .attr("y", d => {return y(d[0]);})
      .attr("width", d => {return x(d[1]);})
      .attr("height", y.bandwidth())
      .attr("fill","#b99094")
      .on("mouseover", function(){D3.select(this).attr("fill","brown")})
      .on("mouseout", function(){D3.select(this).attr("fill","#b99094")})

    // add count text
    svg.selectAll(".count-text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => x(d[1]))
      .attr("y", d => y(d[0])+y.bandwidth()/2)
      .attr("class","count-text")
      .style("text-anchor","start")
      .attr("dx",".2rem")
      .attr("dy",".2rem")
      .text(d=> d[1])
  }

}
