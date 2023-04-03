 // Set the dimensions of the chart
const margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// declare and append the tooltip
const tooltip = d3.select("#chart")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Append the SVG object to the body of the page
const svg = d3.select("#chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


// Parse the date / time
const parseTime = d3.timeParse("%d-%b");


// Set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);


// Define the line
const valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });


// Load the data
d3.csv('../data/rent_data2.csv', function(error, data) {
  if (error) throw error;


  // Format the data
  data.forEach(function(d) {
    d.date = parseTime(d.Year + "-" + d.Month);
    d.close = +d.RentPrice;
  });


  // Filter the data by city and year
  function filterData(city, year) {
    return data.filter(function(d) {
      return d.City === city && d.Year === year;
    });
  }

  // Set the default city and year
  const defaultCity = "All Downtown";
  const defaultYear = "2010";


  // Filter the data by default city and year
  const filteredData = filterData(defaultCity, defaultYear);


  // Scale the range of the data
  x.domain(d3.extent(filteredData, function(d) { return d.date; }));
  y.domain([0, d3.max(filteredData, function(d) { return d.close; })]);


  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Add the valueline path
  svg.append("path")
      .data([filteredData])
      .attr("class", "line")
      .attr("d", valueline);


  // Add the dots
  svg.selectAll("dot")
      .data(filteredData)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.close); })
      .on("mouseover", function(d) {
        tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        tooltip.html(d.Borough + "<br/>" + "$" + d.close + "<br/>" + d.Year)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
    })
