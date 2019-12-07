import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as d from '../../assets/bubble.json' ;

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent implements OnInit {
  data0 = (d as any).default;
  isCk;isCk1;

  constructor() { }

  ngOnInit() {
    this.isCk=true;
    this.isCk1=true;
    // console.log(this.data.filter(d=> this.topcat.map(c=>c==d.k).indexOf(true)>-1))
    this.drawBubble(this.data0.filter(d=> d.k!="Music" && d.k!="Entertainment"))
  }

  drawBubble(data){
    var fac = 4000000;
    if (data.map(x=>x.k=="Music").indexOf(true)<0) {
      fac = 800000
      if (data.map(x=>x.k=="Entertainment").indexOf(true)<0)
        fac = 400000
    }
    var margin={ top: 50, right: 158, bottom: 90, left: 70 };
    var width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    var cates = data.map(x=>x.k)
    var colorlist = [d3.schemePaired[1]].concat(d3.schemePaired.slice(2,12)).concat(d3.schemeDark2.slice(0,6))
    var myColor = d3.scaleOrdinal()
      .domain(cates)
      .range(colorlist);

    d3.select("g.wholeg").remove()
    var svg = d3.select(".bubblechart")
      .attr("viewBox", `0 0 1000 500`)
      .append("g")
      .classed("wholeg",true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var mavl = d3.max(data.flatMap(x=> d3.max(x.v.map(y=> y.likes))))
    var mivl = d3.min(data.flatMap(x=> d3.min(x.v.map(y=> y.likes))))
    var mavd = d3.max(data.flatMap(x=> d3.max(x.v.map(y=> y.dislikes))))
    var mivd = d3.min(data.flatMap(x=> d3.min(x.v.map(y=> y.dislikes))))

  // axes scales
  var x = d3.scaleLinear()
    .domain([+mivl-12000,+mavl])
    .range([0,width])
  var xAxis = d3.axisBottom(x).tickSizeOuter(0)

  var y = d3.scaleLinear()
    .domain([+mivd-10000,+mavd])
    .range([height,0])
  var yAxis = d3.axisLeft(y).tickSizeOuter(0)

  // append x axis
  svg.append("g")
    .attr("transform","translate(0 "+height+")")
    .call(xAxis);
  // append y axis
  svg.append("g")
    .call(yAxis);
    svg.selectAll(".tick text").style("font-size","10px")

  // add axes labels
  svg.append("text")
    .attr("class","axis-label")
    .attr("x", -height/2)
    .attr("y", -55)
    .attr("transform","rotate(-90)") //after rotate 90 deg the x,y position exchanged
    .text("Dislikes")
  svg.append("text")
    .attr("class","axis-label")
    .attr("x", width/2)
    .attr("y", height+35)
    .text("Likes")

  // add title
  svg.append("text")
    .attr("class","svg-title")
    .attr("x",width/2)
    .attr("y",-20)
    .text("Video Views According to Their Likes and Dislikes")

  // add legends
  var legendy = d3.scalePoint().domain(cates).range([20, height*0.8]).padding(0.3)
  var legends = svg.append("g")
    .attr("class", ".legend")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .on("mouseover", (d, i) => {svg.selectAll(".cirg").attr("opacity", 0.1);svg.select(".cirg.cl" + i).attr("opacity", 1)})
    .on("mouseout", (d, i) => svg.selectAll(".cirg").attr("opacity", 0.65))

        // @ts-ignore
    legends.append("circle")
      .attr("cx", width + 40)
      .attr("cy", d => legendy((d as any).k) + 13)
      .attr("r", 6)
        // @ts-ignore
      .attr("fill", (d) => myColor(d.k))

    legends.append("text")
      .attr("x", width + 55)
      .attr("y", d => legendy((d as any).k) + 18)
      .style("font-size","11px")
      .text(d => (d as any).k)

  // add bubble
        // @ts-ignore
  var cg = svg.selectAll(".cirg")
    .data(data)
    .enter().append("g")
        // @ts-ignore
    .attr("class", (d,i)=>{return "cirg cl"+i})
        // @ts-ignore
    .attr("fill", d => myColor(d.k))
    .attr("opacity", 0.65)
    .attr("stroke", "#ddd")

  cg.selectAll(".circlebu")
    .data(d => d.v)
    .enter()
    .append("circle")
    .attr("cx", d => {return x(d.likes)})
    .attr("cy", d => { return y(d.dislikes)})
    .attr("r", d => { return d.views/fac})
    .on("mouseover",function(d){
      var cate = d3.select(this).node().parentNode.classList[1]

      //add tooltip
      var tooltip = svg.append("g").classed("tips", true)
      var border = tooltip.append('rect')
        .attr("x", x(d.likes))
        .attr("y", y(d.dislikes))
        .attr("rx",5)
        .attr("height", 74)
        .attr("width", 130)
        .attr("class", 'class_rect');
      var comment = tooltip.append('text')
        .attr("x", x(d.likes) + 10)
        .attr("y", y(d.dislikes) + 18)
        .style("font-size","12px")
        .text('Category:' +cate);
      var comment1 = tooltip.append('text')
        .attr("x", x(d.likes) + 10)
        .attr("y", y(d.dislikes) + 33)
        .style("font-size","12px")
        .text('Views:' + d.views);
      var comment2 = tooltip.append('text')
        .attr("x", x(d.likes) + 10)
        .attr("y", y(d.dislikes) + 49)
        .style("font-size","12px")
        .text("Likes:"+d.likes);
      var comment3 = tooltip.append('text')
        .attr("x", x(d.likes) + 10)
        .attr("y", y(d.dislikes) + 65)
        .style("font-size","12px")
        .text("Dislikes:"+d.dislikes);
    })
    .on("mouseout", function(d) {svg.selectAll('.tips').remove();});
  }

  @HostListener("click",['$event.srcElement']) uncheck(srcEle){
    if (srcEle.nodeName=="INPUT" && srcEle.classList[1]=="myck"){
      var id = srcEle.id;
      var cks = document.querySelectorAll(".myck")
      var ckd0 = (cks[0] as any).checked;
      var ckd1 = (cks[1] as any).checked;
      if (ckd0 && ckd1){
        this.drawBubble(this.data0.filter(d=> d.k!="Music" && d.k!="Entertainment"))
      }else if (ckd0){
        this.drawBubble(this.data0.filter(d=> d.k!="Music"))
      }else if (ckd1){
        this.drawBubble(this.data0.filter(d=> d.k!="Entertainment"))
      }else{
        this.drawBubble(this.data0)
      }

    }}

}
