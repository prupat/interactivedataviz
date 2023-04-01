// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
 let svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

// Read the data
d3.csv('../data/rent_data.csv', function(data) {

  // Filter data by borough
  const boroughs = d3.map(data, function(d){return(d.Borough)}).keys()

  // Create a color scale for each borough
  const color = d3.scaleOrdinal()
    .domain(boroughs)
    .range(d3.schemeSet2);

  // Create a nested data structure by borough and year
  const nestedData = d3.nest()
    .key(function(d) { return d.Borough; })
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.RentPrice; }); })
    .entries(data);

  // Set the x and y scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.Year; }))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.RentPrice; })])
    .range([height, 0]);

  // Add the x axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the y axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Add a line for each borough
  svg.selectAll(".line")
    .data(nestedData)
    .enter()
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d.key) })
      .attr("stroke-width", 2)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.key); })
          .y(function(d) { return y(d.value); })
          (d.values)
      })

  // Add a legend
  const legend = svg.selectAll(".legend")
    .data(boroughs)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d); });

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
});


