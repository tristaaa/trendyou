import { Component, OnInit, HostListener } from '@angular/core';
import * as WordCloud from "WordCloud";
import * as data from '../../assets/fulltop60.json';

var factor = 4000;
var top10 = 10000;
const tooltip = document.createElement("div");
tooltip.setAttribute("class","tooltip-wc")
const cnt = document.createElement("p")
const cnt1 = document.createElement("p")
tooltip.appendChild(cnt)
tooltip.appendChild(cnt1)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  bartit = "Popularity of each Category Worldwide"
  barxl = "Number of Trending Vidoes"
  baryl = "Category"

  words = (data as any).default;
  options = {
    "list":this.words.full,
    "gridSize":16,
    "weightFactor":function (size) {
      return Math.pow(size, 0.6) * 680 / factor;
    },
    "fontFamliy": "san-serif",
    "minSize":"13",
    "color": function (word,weight) {
      return (weight>top10) ? "#ca5d5c" : "#c09292";
    },
    "shape":'triangle-forward',
    "hover": function (item,dimension) {
      if(dimension){
        cnt.innerHTML = "<b>Tag</b>: "+item[0];
        cnt1.innerHTML = "<b>Number of occurance</b>: "+item[1];
        tooltip.hidden=false;
        var wid = tooltip.clientWidth-10;
        if (dimension.x+dimension.w>500){
          if (tooltip.clientWidth>0)
            tooltip.setAttribute("style","transform:translate("+(dimension.x-wid)+"px, "+(dimension.y-50)+"px)")
        }
        else
          tooltip.setAttribute("style","transform:translate("+(dimension.x+dimension.w-7)+"px, "+(dimension.y+dimension.h-10)+"px)")
      }
    },
    "rotateRatio": 0.5,
    "rotationSteps": 2,
    "backgroundColor": "transparent"
   };
   wc_canvas;

  constructor() { }

  ngOnInit() {
    this.wc_canvas = document.querySelector("#wordcloud");
    // worldwide word cloud
    top10 = this.words.full[10][1]
    WordCloud(this.wc_canvas,this.options);
    tooltip.hidden=true;
    this.wc_canvas.appendChild(tooltip);
  }

  @HostListener("click",['$event.srcElement']) changeNav(srcEle){
    if (srcEle.nodeName=="rect"){
      const cate_id = srcEle.__data__[2];
      this.options.list = this.words[cate_id];
      factor = 4400*Math.pow(this.words[cate_id][29][1]/4058,0.6);
      top10 = this.words[cate_id][10][1]
      WordCloud(this.wc_canvas,this.options);
      this.wc_canvas.appendChild(tooltip);
    }
    else if (srcEle.nodeName=="BUTTON"){
      this.options.list = this.words.full;
      factor = 4000;
      top10 = this.words.full[10][1]
      WordCloud(this.wc_canvas,this.options);
      this.wc_canvas.appendChild(tooltip);
    }
  }

  @HostListener("mouseout",['$event']) removeTooltip($event){
    if ($event.srcElement.nodeName=="SPAN"){
      tooltip.hidden=true;
    }
  }
}
