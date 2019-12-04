import { __decorate } from "tslib";
import { Component, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as data0 from '../../assets/world.json';
import * as data1 from '../../assets/world_top.json';
import * as data2 from '../../assets/donut.json';
import * as data3 from '../../assets/country_top5.json';
let MapdonutComponent = class MapdonutComponent {
    constructor() {
        this.topodata = data0.default;
        this.mapdata = data1.default;
        this.donutdata = data2.default;
        this.ctydata = data3.default;
        this.piecolor = ["#d7301f", "#6baed6", "#fd8d3c", "#c39bd3", "#f7dc6f", "#fee8c8"];
        this.topcat = ["Entertainment", "People & Blogs", "Music", "News & Politics", "Comedy", "Others"];
        this.colorf = d3.scaleOrdinal()
            .domain(this.topcat)
            .range(this.piecolor);
    }
    ngOnInit() {
        this.init();
    }
    init() {
        this.countries = this.donutdata.map(x => x.key);
        this.drawWorld("c1");
        d3.select(".mytitle").append("div").append("p").text("Distribution of Global Top 5 Categories in 9 Countries");
        d3.select(".mytitle").append("div").attr("class", "col-12").append(() => this.mylegend(this.colorf));
        this.donutdata.forEach(d => this.drawPie(d, d.key));
    }
    drawWorld(catid) {
        var format = d => `${d}%`;
        var world = this.topodata;
        var data = this.mapdata;
        var country_top5 = this.ctydata;
        // filter the data by category
        data = new Map(data.filter(d => d.cat == catid).map((d) => [d.id, d.value]));
        data.title = "Category popularity temperature in %";
        var color = d3.scaleQuantize()
            .domain([3, 45])
            .range(d3.schemeReds[8].slice(3, 8));
        var margin = { top: 10, left: 0, right: 0, bottom: 0 }, width = 800 - margin.left - margin.right, height = 600 - margin.top - margin.bottom;
        var svg = d3.select("#cho")
            .attr("viewBox", `0 0 800 600`)
            .append('g')
            .attr("fill", "")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var projection = d3.geoMercator()
            .translate([width / 2, height / 2 + 70])
            .scale(100);
        var path = d3.geoPath().projection(projection);
        svg.append("g")
            .attr("transform", "translate(500,20)")
            .append(() => this.legend({ color, title: data.title, width: 210 }));
        svg.append("g")
            .attr("fill", "lightgrey")
            .selectAll(".path")
            .data(topojson.feature(world, world.objects.countries1).features.map(d => (d.value = data.get(d.id), d)))
            .join("path")
            .attr("fill", d => color(data.get(d.id)))
            .attr("stroke", "white")
            .attr("d", path)
            .on("click", (d, i) => {
            if (this.countries.indexOf(d.id) > -1) {
                d3.selectAll(".mytitle div").remove();
                d3.selectAll(".donut div").remove();
                this.drawPieBig(d.id);
            }
        })
            .append("title")
            .text(d => { if (d.value)
            return `${d.properties.name} ${data.get(d.id)}`;
        else
            return ''; });
        svg.append("path")
            .datum(topojson.mesh(world, world.objects.countries1, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);
        svg.append("g")
            .attr("class", "svg-title")
            .append('text')
            .attr("x", width / 2)
            .attr("y", 10)
            .text("Youtube Category temperature in 9 countries");
    }
    drawPie(data, country) {
        var width = 200, height = 200, radius = Math.min(width, height) / 2;
        var color = d3.scaleOrdinal()
            .domain(this.topcat)
            .range(this.piecolor);
        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 35);
        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.total; });
        var div = d3.select(".donut").append("div");
        div.attr("class", "col-sm-4 pl-0 pr-0");
        var svg = div
            .append("svg")
            .attr("class", "donutpie " + country)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        var path_pop = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 35);
        svg.append("circle")
            .attr("class", "inside_circle")
            .attr("r", 62)
            .style("fill", "lightgrey");
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("class", "svg-title ctyname " + country)
            .attr('y', 7)
            .text(country);
        var g = svg.selectAll(".arc")
            .data(pie(data.value))
            .enter()
            .append("g")
            .attr("class", "arc");
        var a = g.append("path")
            .style("fill", function (d) { return color(d.data.name); });
        a.transition().delay(function (d, i) { return i * 100; }).duration(100)
            .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) { d.endAngle = i(t); return path(d); };
        });
        a.on("mouseover", function (d, i) {
            d3.select('.ctyname.' + country).style("display", "none");
            d3.select(this)
                .attr("d", path_pop)
                .transition()
                .duration(50)
                .attr('opacity', ".85");
            var grp = g.append("g").attr("class", "inside-text");
            grp.append("text")
                .attr('dy', "-27")
                .text(country)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", "-7")
                .text(d.data.name)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", 16)
                .attr("fill", "#ad4f4e")
                .text("Tot: " + d.data.total)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", 33)
                .attr("fill", "#ad4f4e")
                .text("Percent: " + d.data.percent + "%")
                .transition()
                .duration(60);
        })
            .on("mouseout", function (d, i) {
            d3.select(this)
                .transition()
                .duration(800)
                .ease(d3.easeBounce)
                .attr("d", path)
                .attr('opacity', "1");
            d3.selectAll(".ctyname").style("display", "initial");
            d3.selectAll(".inside-text").remove();
        });
    }
    drawPieBig(country) {
        var data = this.ctydata[country];
        var colorleg = d3.schemeReds[8].slice(2, 8).reverse();
        var color = d3.scaleOrdinal().range(colorleg);
        var cty_dict = { "USA": "United States", "FRA": "France", "IND": "India", "CAN": "Canada", "DEU": "Germany", "GBR": "Great Britain", "JPN": "Japan", "KOR": "South Korea", "MEX": "Mexico" };
        d3.select(".mytitle").append("div").append("p").text("Distribution of " + cty_dict[country] + "\'s Top 5 Categories");
        var legend_svg = d3.select(".donut").append("div").attr("class", "col-md-3")
            .append("svg")
            .attr("viewBox", [0, 0, 160, 260]);
        legend_svg.selectAll(".circleleg")
            .data(colorleg)
            .enter()
            .append("circle")
            .attr("cx", 10)
            .attr("cy", function (d, i) { return 40 + i * 30; })
            .attr("r", 10)
            .attr("fill", d => d);
        legend_svg.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", 30)
            .attr("y", function (d, i) { return 45 + i * 30; })
            .text(d => d.name);
        legend_svg.append("text")
            .attr("x", 18)
            .attr("y", 14)
            .attr("font-weight", "bold")
            .text("Categories");
        var width = 360, height = 360, radius = Math.min(width, height) / 2;
        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 55);
        var pie = d3.pie()
            .sort(null)
            .value(function (d) { return d.total; });
        var svg = d3.select(".donut").append("div").attr("class", "col-md-8")
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .append("g")
            .attr("transform", "translate(" + (-width / 2) + "," + (-height / 2) + ")");
        svg.transition()
            .delay(100)
            .duration(500)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        svg.append("circle").transition().delay(200).duration(300)
            .attr("class", "inside_circle")
            .attr("r", 120)
            .style("fill", "lightgrey");
        svg.append("text").transition().delay(200).duration(300)
            .attr("class", "svg-title ctyname")
            .style('font-size', '3rem')
            .attr('y', 15)
            .text(country);
        var path_pop = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 55);
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
        var a = g.append("path")
            .style("fill", function (d) { return color(d.data.name); });
        a.transition().delay(function (d, i) { return 500 + i * 100; }).duration(100)
            .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) { d.endAngle = i(t); return path(d); };
        });
        a.on("mouseover", function (d, i) {
            d3.select(".ctyname").style("display", "none");
            d3.select(this)
                .attr("d", path_pop)
                .transition()
                .duration(50)
                .attr('opacity', ".85");
            var grp = g.append("g").attr("class", "inside-text");
            grp.append("text")
                .attr('dy', "-27")
                .text(country)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", "-7")
                .text(d.data.name)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", 16)
                .attr("fill", "#ad4f4e")
                .text("Tot: " + d.data.total)
                .transition()
                .duration(50);
            grp.append("text")
                .attr("dy", 33)
                .attr("fill", "#ad4f4e")
                .text("Percent: " + d.data.percent + "%")
                .transition()
                .duration(60);
        })
            .on("mouseout", function (d, i) {
            d3.select(this)
                .transition()
                .duration(800)
                .ease(d3.easeBounce)
                .attr("d", path)
                .attr('opacity', "1");
            d3.select(".ctyname").style("display", "initial");
            d3.selectAll(".inside-text").remove();
        });
    }
    redraw(srcEle) {
        if (srcEle.nodeName == "BUTTON") {
            var cid = srcEle.id;
            if (cid == "re") {
                d3.selectAll(".mytitle div").remove();
                d3.selectAll(".donut div").remove();
                this.init();
            }
            else {
                this.drawWorld(cid);
            }
        }
    }
    mylegend(color) {
        const len = color.domain().map(x => x.length);
        var ssum = 0;
        for (var i = 0; i < len.length - 1; i++) {
            var iv = len[i];
            len[i] += ssum;
            ssum += iv;
        }
        len.splice(0, 0, 0);
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, 700, 20]);
        svg.append("text")
            .attr("y", 15)
            .attr("font-weight", "bold")
            .text("Categories");
        var g = svg.append("g").selectAll("leg");
        g.data(color.range()).enter().append("circle")
            .attr("cx", function (d, i) { return 97 + i * 35 + len[i] * 7; })
            .attr("cy", 10)
            .attr("r", 6)
            .attr("fill", d => { return d; });
        g.data(color.domain()).enter().append("text")
            .attr("x", function (d, i) { return 105 + i * 35 + len[i] * 7; })
            .attr("y", 15)
            .text(d => d);
        return svg.node();
    }
    legend({ color, title, tickSize = 6, width = 320, height = 44 + tickSize, marginTop = 18, marginRight = 0, marginBottom = 16 + tickSize, marginLeft = 0, ticks = width / 64, tickFormat, tickValues } = {}) {
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            // .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible")
            .style("display", "block");
        let x;
        // Continuous
        if (color.interpolator) {
            x = Object.assign(color.copy()
                .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), { range() { return [marginLeft, width - marginRight]; } });
            svg.append("image")
                .attr("x", marginLeft)
                .attr("y", marginTop)
                .attr("width", width - marginLeft - marginRight)
                .attr("height", height - marginTop - marginBottom)
                .attr("preserveAspectRatio", "none")
                .attr("xlink:href", ramp(color.interpolator()).toDataURL());
            // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
            if (!x.ticks) {
                if (tickValues === undefined) {
                    const n = Math.round(ticks + 1);
                    tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
                }
                if (typeof tickFormat !== "function") {
                    tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
                }
            }
        }
        // Discrete
        else if (color.invertExtent) {
            const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
                : color.quantiles ? color.quantiles() // scaleQuantile
                    : color.domain(); // scaleThreshold
            const thresholdFormat = tickFormat === undefined ? d => d
                : typeof tickFormat === "string" ? d3.format(tickFormat)
                    : tickFormat;
            x = d3.scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);
            svg.append("g")
                .selectAll("rect")
                .data(color.range())
                .join("rect")
                .attr("x", (d, i) => x(i - 1))
                .attr("y", marginTop)
                .attr("width", (d, i) => x(i) - x(i - 1))
                .attr("height", height - marginTop - marginBottom)
                .attr("fill", d => d);
            tickValues = d3.range(thresholds.length);
            tickFormat = i => thresholdFormat(thresholds[i], i);
        }
        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
            .call(g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));
        return svg.node();
    }
};
__decorate([
    HostListener("click", ['$event.srcElement'])
], MapdonutComponent.prototype, "redraw", null);
MapdonutComponent = __decorate([
    Component({
        selector: 'app-mapdonut',
        templateUrl: './mapdonut.component.html',
        styleUrls: ['./mapdonut.component.css']
    })
], MapdonutComponent);
export { MapdonutComponent };
//# sourceMappingURL=mapdonut.component.js.map