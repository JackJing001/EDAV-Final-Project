var margin = { top: 30, right: 85, bottom: 40, left: 50 };
var width = 780 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

var svg = d3.select("div#plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xscale = d3.scaleLinear()
  .domain([75, 98])
  .range([0,width]);

var yscale = d3.scaleLinear()
  .domain([75, 98])
  .range([height,0]);

var radius = d3.scaleSqrt()
  .range([1,16]);

var xAxis = d3.axisBottom()
  .tickSize(-height)
  .scale(xscale);

var yAxis = d3.axisLeft()
  .tickSize(-width)
  .scale(yscale)

var color = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("https://raw.githubusercontent.com/JackJing001/fifa21data/main/FIFArating.csv").then(function(data) {
  console.log(data);
  // data pre-processing
  data.forEach(function(d) {
    d.y = +d["Potential"];
    d.x = +d["Overall"];
    d.r = +d["Freq"];
  });

  radius.domain(d3.extent(data, function(d) {
    return d.r;
  })).nice();

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis")
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(0,0)")
    .attr("class", "y axis")
    .call(yAxis);

  var group = svg.selectAll("g.bubble")
    .data(data)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"
    });

  group
    .append("circle")
    .attr("r", function(d) { return radius(d.r);  })
    .style("fill", function(d) {
      return color(d["Nationality"]);
    });
    
  group
    .append("text")
    .attr("x", function(d) { return radius(d.r); })
    .attr("alignment-baseline", "middle")
    .text(function(d) {
      return d["Overall"]+"/"+d["Potential"];  
    });

  svg.append("text")
    .attr("x", 6)
    .attr("y", -2)
    .attr("class", "label")
    .text("Potential");

  svg.append("text")
    .attr("x", width-2)
    .attr("y", height-6)
    .attr("text-anchor", "end")
    .attr("class", "label")
    .text("Oveall");

  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(2," + i * 14 + ")"; });

  legend.append("rect")
      .attr("x", width)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 16)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });

  legend.on("click", function() {
      d3.selectAll(".legend")
        .style("opacity", 0.1);
      d3.select(this)
        .style("opacity", 1);
      var nation = d3.select(this).select('text').text();
      d3.selectAll("circle")
        .style("opacity", 0)
        .filter(function(d) { return d["Nationality"] == nation; })
        .style("opacity", 1);
    });
    
  group.on("click", function() {
      d3.selectAll(".legend")
        .style("opacity", 1);
      d3.selectAll("circle")
        .style("opacity", 1);
    });
    
});


