 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.5,
height = window.innerHeight * 0.9,
margin = { top: 20, bottom: 60, left: 80, right: 60 };



// Create SVG container
const svg = d3.select("#chart-container")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);


// Variable to store the loaded CSV data
let occupationsData;


// Variable to store the occupation dropdown
const occupationSelect = d3.select("#occupation-select");

// declare tooltip variable
let tooltip;


// Update occupation dropdown based on job type checkboxes
function updateOccupationDropdown() {
  const whiteCollarChecked = document.getElementById("white-collar").checked;
  const blueCollarChecked = document.getElementById("blue-collar").checked;

  let filteredOccupations;

  if (whiteCollarChecked && blueCollarChecked) {
    filteredOccupations = occupationsData
      .filter(d => d.JobType === "White Collar" || d.JobType === "Blue Collar")
      .map(d => d.Occupation);
  } else if (whiteCollarChecked || blueCollarChecked) {
    filteredOccupations = occupationsData
      .filter(d => d.JobType === (whiteCollarChecked ? "White Collar" : "Blue Collar"))
      .map(d => d.Occupation);
  } else {
    filteredOccupations = [];
  }

  const options = occupationSelect
    .selectAll("option")
    .data(filteredOccupations, d => d);

  options.enter()
    .append("option")
    .merge(options)
    .text(d => d);

  options.exit().remove();

  
  // Update the table after updating the dropdown options
  const selectedOccupation = occupationSelect.node().value;
  updateTable(selectedOccupation);
  updateChart(selectedOccupation);
}

// Add a formula to flag the job as "high" or "low risk" based on custom probability thresholds
const calculateRisk = (probability) => {
  const numericProbability = +probability; // Convert probability to a number
   return numericProbability >= 0.7 ? "High" : "Low";
};

// Update the table based on selected occupation and probability
function updateTable(occupation) {
  const tableBody = d3.select("#table-body");
  tableBody.html(""); // Clear previous table content

  // Filter data based on selected occupation
  const filteredData = occupationsData.filter(d => d.Occupation === occupation);

  // Create rows in the table
  filteredData.forEach(d => {
    const row = tableBody.append("tr");
    
   // Calculate risk based on custom probability thresholds
   const risk = calculateRisk(d.Probability);


   // Apply color to the entire row based on risk level
    if (risk === "High") {
      row.style("color", "#B8390E"); // Red color for high risk
    } else {
      row.style("color", "green"); // Green color for low risk
    }
    
    // Add data to table cells
    row.append("td").text(d.Occupation).style("font-weight", "bold"); 
    row.append("td").text(d.Probability).style("font-weight", "bold");
    row.append("td").text(risk).style("font-weight", "bold");
  });
}

// Load data from CSV file
d3.csv("../data/Prob_AutoJob.csv").then(rawData => {
  
// Store the loaded data
occupationsData = rawData;

// Populate the occupation dropdown
occupationSelect
    .selectAll("option")
    .data(rawData.map(d => d.Occupation))
    .enter()
    .append("option")
    .text(d => d);

// Initial population of the occupation dropdown
updateOccupationDropdown();

// Update the table based on selected occupation
const initialOccupation = occupationsData.map(d => d.Occupation)[0];
updateTable(initialOccupation);

// Initial chart update with the first available occupation and region
updateChart(initialOccupation);


// Event listeners for the dropdowns
occupationSelect.on("change", function() {
  updateTable(this.value);
  updateChart(this.value);
});


// Event listeners for the checkboxes
d3.select("#white-collar").on("change", function() {
  updateOccupationDropdown();
});

d3.select("#blue-collar").on("change", function() {
  updateOccupationDropdown();
});

}).catch(error => {
  console.error("Error loading the CSV data: ", error);
});


function updateChart(occupation){

// Find the occupation data
const occupationData = occupationsData.find(d => d.Occupation === occupation);


// Create a new array for the bar chart data
const barChartData = Object.entries(occupationData)
 .filter(([key, value]) => key !== "Occupation")
.map(([state, jobs]) => ({
  State: state,
  Jobs: +jobs // convert the string to a number
}));


// Define the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(barChartData, (d) => d.Jobs)])
  .range([0, width])
  .nice();

const yScale = d3.scaleBand()
  .domain(barChartData.map((d) => d.State))
  .range([height, 0])
  .padding(0,5);


// Draw the axes
svg.selectAll(".axis").remove(); // clear previous axes

const xAxis = d3.axisBottom(xScale);
svg.append("g")
  .attr("class", "axis x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis)
  .selectAll("text")
  .attr("transform", "rotate(-25)")
  .style("text-anchor", "end");
  

// X-axis title
svg.append("text")             
   .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
   .style("text-anchor", "middle")
   .text("Number of Jobs")
   .attr("fill", "#0047AB");


const yAxis = d3.axisLeft(yScale);
svg.append("g")
   .attr("class", "axis y-axis")
   .call(yAxis);


// Y-axis title  
svg.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (height / 2))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("US States")
   .attr("fill", "#0047AB");

 // Add a tooltip               
 tooltip = d3.select("body")
 .append("div")
 .attr("class", "tooltip")
 .style("z-index", "10")
 .style("position", "absolute")
 .style("visibility", "hidden")
 .text("tooltip");



// Bind the bar chart data to the rects
const bars = svg.selectAll(".bar")
    .data(barChartData, d => d.State);


bars.enter()
  .append("rect")
  .attr("class", "bar")
  .merge(bars)
  .on("mouseover", function(event,d,i){
    return tooltip
   .html(`<div><b># of Jobs:</b> ${d.Jobs}</div>`) 
   .style("visibility", "visible")
   .style("opacity", .8)
   .style("background", "#91b07d")
 })

.on("mousemove", function(event){
  return tooltip.style("top", (event.pageY-10)+"px")
                .style("left", (event.pageX+10) + "px");})       
   
.on("mouseout", function(){
   return tooltip.style("visibility", "hidden");}) 

  .transition()
  .duration(500)
  .attr("x", 0)
  .attr("y", d => yScale(d.State))
  .attr("width", d => xScale(d.Jobs))
  .attr("height", yScale.bandwidth())
  .attr("fill", "#0047AB");

bars.exit().remove();    
}





