var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#mainchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Logic to handle hover event when its firedup
var hoveron = function(d) {
/*      console.log('d', d, 'event', event);*/
      var div = document.getElementById('tooltip');
      div.style.left = event.pageX + 'px';
      div.style.top = event.pageY + 'px';

      
      //Fill yellow to highlight
      d3.select(this)
        .style("fill", "white");

      //Show the tooltip
      d3.select("#tooltip")
        .style("opacity", 1);

      //Populate rank in tooltip
      d3.select("#tooltip .rank")
        .text("No." +" "+ d.rank);

      //Populate name in tooltip
      d3.select("#tooltip .name")
        .text(d.page);

      //Populate value in tooltip
      d3.select("#tooltip .value")
        .text(d.comment); 
}

var hoverout = function(d) {

  //Restore original fill
  d3.select(this)
    .style("fill", function(d) {
          d3.select(this)
              .attr('fill', function(d) { return color(d.category); })
              .attr('stroke-width', 0);
      });

  //Hide the tooltip
  d3.select("#tooltip")
    .style("opacity", 0);

}

d3.csv("data/totalLocal_v1.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.total2017 = +d.total2017;
    d.local2017 = +d.local2017;
  });


  x.domain(d3.extent(data, function(d) { return d.total2017; })).nice();
  y.domain(d3.extent(data, function(d) { return d.local2017; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Total Fans");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Local Fans")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 6.5)
      .attr("cx", function(d) { return x(d.total2017); })
      .attr("cy", function(d) { return y(d.local2017); })
      .style("fill", function(d) { return color(d.category); })

      // We add listeners to the mouseover and mouseout events
  
      .on('mouseover', function(d) {
          d3.select(this)
              .attr('stroke-width', 3)
              .attr('fill', d3.rgb(d.color).brighter())
              .attr('stroke', d.color);
      })
      .on('mouseout', function(d) {
          d3.select(this)
              .attr('fill', d.color)
              .attr('stroke-width', 0);
      })
      .on('mouseover', hoveron)
      .on('mouseout', hoverout)
      /*.call(tooltip)*/;

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

