import { Component, OnInit, HostListener } from '@angular/core';
import * as D3 from 'd3';
import * as d from '../../assets/besttime.json' ;


@Component({
  selector: 'app-lolli',
  templateUrl: './lolli.component.html',
  styleUrls: ['./lolli.component.css']
})
export class LolliComponent implements OnInit {
  data = (d as any).default;
  wd_dict = {"w1": 'Sunday', "w2": 'Monday', "w3": 'Tuesday', "w4": 'Wednesday', "w5": 'Thursday', "w6": 'Friday', "w7": 'Saturday'};
  svg;xAxis;yAxis;x;y;dataset;modeevl;modesrt;

  svgWidth = 900; svgHeight=450
  margin = { top: 50, right: 25, bottom: 60, left: 90 };
  width = this.svgWidth - this.margin.left - this.margin.right;
  height = this.svgHeight - this.margin.top - this.margin.bottom;

  ngOnInit() {
    this.svg = D3.select(".lollichart")
      .attr("viewBox", `0 0 ${this.svgWidth} ${this.svgHeight}`)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = D3.scalePoint().range([0, this.width]);
    this.y = D3.scaleLinear().range([this.height, 0]);

    this.setEvlMode(".evl-wd");
    this.setSrtMode(".ord-t");
    this.dataset = this.data.weekday

    this.drawLoll()
  }

  @HostListener("click",['$event.srcElement']) redraw(srcEle){
    if (srcEle.nodeName=="BUTTON"){
      var cid = srcEle.classList[0]
      var pre = cid.slice(0,3),
        suf = cid.slice(4,6)
      if (pre=="evl"){
        if (suf=="wd"){
          this.setEvlMode(".evl-wd")
          this.dataset = this.data.weekday
        }else{
          this.setEvlMode(".evl-hr")
          this.dataset = this.data.publish_hour
        }

        if (this.modesrt==".ord-t")
          this.dataset.sort((a,b) => D3.ascending(a.key,b.key))
        else
          this.dataset.sort((a,b) => D3.descending(a.value,b.value))

        if(suf=="wd"){
          var dataset = [];
          this.dataset.forEach(x=> dataset.push({...x}));
          dataset.forEach(d=> d.key=this.wd_dict[d.key]);
          this.dataset = dataset;
        }
      }else if(pre=="ord"){
        if (this.modeevl==".evl-wd")
          this.dataset = this.data.weekday
        else
          this.dataset = this.data.publish_hour

        if (suf=="t"){
          this.setSrtMode(".ord-t")
          this.dataset.sort((a,b) => D3.ascending(a.key,b.key))
        }
        else{
          this.setSrtMode(".ord-v")
          this.dataset.sort((a,b) => D3.descending(a.value,b.value))
        }

        if(this.modeevl==".evl-wd"){
          var dataset = [];
          this.dataset.forEach(x=> dataset.push({...x}));
          dataset.forEach(d=> d.key=this.wd_dict[d.key]);
          this.dataset = dataset;
        }

      }else if(pre=="res"){
        this.setEvlMode(".evl-wd")
        this.dataset = this.data.weekday

        this.setSrtMode(".ord-t")
        this.dataset.sort((a,b) => D3.ascending(a.key,b.key))

        var dataset = [];
        this.dataset.forEach(x=> dataset.push({...x}));
        dataset.forEach(d=> d.key=this.wd_dict[d.key]);
        this.dataset = dataset;
      }
      this.doTransition();
    }
  }

  setEvlMode(id) {
    D3.selectAll(".evl button").classed("active", false);
    D3.select(id).classed("active", true);
    this.modeevl = id;
  }

  setSrtMode(id) {
    D3.selectAll(".order button").classed("active", false);
    D3.select(id).classed("active", true);
    this.modesrt = id;
  }

  setTitle() {
    var evl = D3.select(".evl .active").text(),
      srt = D3.select(".order .active").text()

    this.svg.select("text.axis-label").text(evl);

    var subtit=D3.select('.svg-title').selectAll(".subtit").data([{k:-1,v:evl},{k:1,v:srt}],d=> {return (d as any).v})
    var hv_wid = document.querySelector(".svg-title text").getClientRects()[0]['width']/2
    subtit.enter().append("text")
      .attr("class", "subtit")
      .attr("x", d => this.width / 2 + d.k*181)
      .attr("y", -30)
      .style("opacity", 0)
      .attr("text-anchor", d => {if (d.k==-1) return "end"; else return "start"})
      .transition()
      .delay(200)
      .duration(500)
      .style("opacity", 1)
      .text(d => {if (d.k==-1) return "Best "+d.v; else return d.v})

    subtit.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
}

  doTransition() {
    // set title
    this.setTitle();

    var transition = this.svg.transition().duration(1000);
    var delay = function(d, i) {return i * 30;};
    var delay1 = function(d, i) {return i * 50;};
    var dataset:Array<object> = this.dataset;
    // console.log(dataset)
    var x=this.x,y=this.y,xAxis=this.xAxis,yAxis=this.yAxis;

    x.domain(dataset.map(d => { return (d as any).key }));
    y.domain([0, D3.max(dataset.map(d=>(d as any).value)) * 1.05]);

    transition.select("#xAxis").call(xAxis);
    transition.select("#yAxis").call(yAxis);

    var lollipopg = D3.select('.lollipop')
    var lollipopc = lollipopg.selectAll("circle").data(dataset,d=> {return (d as any).key})
    var lollipopl = lollipopg.selectAll("line").data(dataset,d=> {return (d as any).key})
    var cnt_text = this.svg.selectAll(".count-text").data(dataset,d=> {return d.key})

    // UPDATE.
    lollipopc.transition()
      .duration(800)
      .delay(delay1)
      .attr("cx", d => x((d as any).key)+0.5)
      .attr("cy", d => y((d as any).value))
    lollipopl.transition()
      .duration(800)
      .delay(delay1)
      .attr("x1", d => x((d as any).key)+0.5)
      .attr("x2", d => x((d as any).key))
      .attr("y1", this.height)
      .attr("y2", d => y((d as any).value));
    cnt_text.transition()
      .duration(800)
      .delay(delay1)
      .attr("x", d => this.x(d.key))
      .attr("y", d => this.y(d.value)-13)
      .text(d=> d.value)

    // ENTER.
    lollipopc.enter().append("circle")
      .attr("cx", d => x((d as any).key)+0.5)
      .attr("cy", d => y((d as any).value))
      .attr("r", 0)
      .transition()
      .duration(900)
      .delay(delay1)
      .attr("r", 6)
    lollipopl.enter().append("line")
      .attr("x1", d => x((d as any).key)+0.5)
      .attr("x2", d => x((d as any).key))
      .attr("y1", this.height)
      .attr("y2",this.height)
      .transition()
      .duration(800)
      .delay(delay)
      .attr("y2", d => y((d as any).value))
    cnt_text.enter().append("text")
      .attr("class","count-text")
      .attr("x", d => this.x(d.key))
      .attr("y", d => this.y(d.value)-13)
      .transition()
      .duration(900)
      .delay(delay1)
      .text(d=> d.value)


    // EXIT.
    // console.log(bars.exit())
    lollipopc.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
    lollipopl.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
    cnt_text.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
  }

  drawLoll(){
    var dataset = [];
    this.dataset.forEach(x=> dataset.push({...x}));
    dataset.forEach(d=> d.key=this.wd_dict[d.key]);
    this.x.domain(dataset.map(d => { return d.key })).padding(0.48);
    this.xAxis = D3.axisBottom(this.x).tickSizeOuter(0)

    this.y.domain([0, D3.max(dataset, d => { return d.value }) * 1.05]);
    this.yAxis = D3.axisLeft(this.y).tickSizeOuter(0)

    // add axes
    this.svg.append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0 " + this.height + ")")
      .call(this.xAxis);
    this.svg.append("g")
      .attr("id", "yAxis")
      .call(this.yAxis);

    // set title
    var evl = D3.select(".evl .active").text(),
      srt = D3.select(".order .active").text()
    var title = this.svg.append("g")
      .attr("class", "svg-title")
    title.append("text")
      .attr("x", this.width / 2)
      .attr("y", -30)
      .text("to Publish a Youtube Video in Order of")
    title.selectAll(".subtit")
      .data([{k:-1,v:evl},{k:1,v:srt}]).enter()
      .append("text")
      .attr("class", "subtit")
      .attr("x", d => this.width / 2 + d.k*181)
      .attr("y", -30)
      .attr("text-anchor", d => {if (d.k==-1) return "end"; else return "start"})
      .text(d => {if (d.k==-1) return "Best "+d.v; else return d.v})

    // add axes labels
    this.svg.append("text")
      .attr("class", "axis-label")
      .attr("x", this.width / 2)
      .attr("y", this.height + 40)
      .text(evl);
    this.svg.append("text")
      .attr("class", "axis-label")
      .attr("x", -this.height / 2)
      .attr("y", -70)
      .attr("transform", "rotate(-90)") //after rotate 90 deg the x,y position exchanged
      .text("Number of Youtube Trending Videos");

    var lollipop = this.svg.append("g")
      .attr("class","lollipop")
      .style("fill","#b99094")
      .style("stroke","#b99094")
      .style("stroke-width","2px")
      .selectAll(".lollipop")
      .data(dataset)
      .enter();
    lollipop.append("circle")
      .attr("cx", d => this.x(d.key)+0.5)
      .attr("cy", d => this.y(d.value))
      .attr("r",6);
    lollipop.append("line")
      .attr("x1", d => this.x(d.key)+0.5)
      .attr("x2", d => this.x(d.key))
      .attr("y1", this.height)
      .attr("y2", d => this.y(d.value));
    // console.log(D3.selectAll('.lollipop').data())

    // add count text
    this.svg.selectAll(".count-text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("x", d => this.x(d.key))
      .attr("y", d => this.y(d.value)-13)
      .attr("class","count-text")
      .text(d=> d.value)
  }

}
