// Define the data for the chart
var data = [  { City: "New York", Borough: "Manhattan", Year: 2022, Month: "January", Studio: 1500, "1 BR": 2000, "2 BR": 2500, "3 BR": 3000 },  { City: "New York", Borough: "Manhattan", Year: 2022, Month: "February", Studio: 1600, "1 BR": 2100, "2 BR": 2600, "3 BR": 3100 },  { City: "New York", Borough: "Manhattan", Year: 2022, Month: "March", Studio: 1700, "1 BR": 2200, "2 BR": 2700, "3 BR": 3200 },  { City: "Los Angeles", Borough: "West LA", Year: 2022, Month: "January", Studio: 1000, "1 BR": 1500, "2 BR": 2000, "3 BR": 2500 },  { City: "Los Angeles", Borough: "West LA", Year: 2022, Month: "February", Studio: 1100, "1 BR": 1600, "2 BR": 2100, "3 BR": 2600 },  { City: "Los Angeles", Borough: "West LA", Year: 2022, Month: "March", Studio: 1200, "1 BR": 1700, "2 BR": 2200, "3 BR": 2700 }];

// Create the dropdowns and checkboxes
var city1Dropdown = d3.select("#city1-dropdown");
var city2Dropdown = d3.select("#city2-dropdown");
var yearDropdown = d3.select("#year-dropdown");
var studioCheckbox = d3.select("#studio-checkbox");
var oneBrCheckbox = d3.select("#1br-checkbox");
var twoBrCheckbox = d3.select("#2br-checkbox");
var threeBrCheckbox = d3.select("#3br-checkbox");

// Create the chart
var margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand()
  .range([0, width])
  .padding(0.1);

var yScale = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);

svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")");

svg.append("g")
  .attr("class", "y-axis");

// Update the chart
function updateChart() {
  // Get the selected values from the dropdowns and checkboxes
  var city1 = city1Dropdown.node().value;
  var city2 = city2Dropdown.node().value;
  var year = yearDropdown.node().value;
  var studioChecked = studioCheckbox.node().checked;
  var oneBrChecked= oneBrCheckbox.node().checked;
  var twoBrChecked = twoBrCheckbox.node().checked;
  var threeBrChecked = threeBrCheckbox.node().checked;
  
  // Filter the data based on the selected values
  var filteredData = data.filter(function(d) {
  return d.City === city1 || d.City === city2;
  }).filter(function(d) {
  return d.Year === +year;
  });
  
  // Map the data to arrays for the X and Y scales
  var xData = filteredData.map(function(d) {
  return d.Month;
  });
  
  var yData = [];
  
  if (studioChecked) {
  yData.push(filteredData.map(function(d) {
  return d.Studio;
  }));
  }
  
  if (oneBrChecked) {
  yData.push(filteredData.map(function(d) {
  return d["1 BR"];
  }));
  }
  
  if (twoBrChecked) {
  yData.push(filteredData.map(function(d) {
  return d["2 BR"];
  }));
  }
  
  if (threeBrChecked) {
  yData.push(filteredData.map(function(d) {
  return d["3 BR"];
  }));
  }
  
  // Flatten the Y data array
  yData = [].concat.apply([], yData);
  
  // Update the X and Y scales
  xScale.domain(xData);
  yScale.domain([0, d3.max(yData)]);
  
  // Update the X and Y axes
  svg.select(".x-axis")
  .call(xAxis);
  
  svg.select(".y-axis")
  .call(yAxis);
  
  // Create the line generator
  var line = d3.line()
  .x(function(d, i) { return xScale(xData[i]) + xScale.bandwidth() / 2; })
  .y(function(d) { return yScale(d); });
  
  // Add the lines to the chart
  var lines = svg.selectAll(".line")
  .data(yData.length > 0 ? yData : []);
  
  lines.enter()
  .append("path")
  .attr("class", "line")
  .merge(lines)
  .attr("d", line);
  
  lines.exit().remove();
  }
  
  // Update the chart when the dropdowns or checkboxes change
  city1Dropdown.on("change", updateChart);
  city2Dropdown.on("change", updateChart);
  yearDropdown.on("change", updateChart);
  studioCheckbox.on("change", updateChart);
  oneBrCheckbox.on("change", updateChart);
  twoBrCheckbox.on("change", updateChart);
  threeBrCheckbox.on("change", updateChart);
  
  // Initialize the chart
  updateChart();
  
  
  
  
  
