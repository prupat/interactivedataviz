 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.5,
height = window.innerHeight * 0.5,
margin = { top: 20, bottom: 60, left: 80, right: 60 };


// Create a new array to store the region information for each state
const stateToRegion = {

  Connecticut:"Northeast", Delaware:"Northeast", "District of Columbia":"Northeast", Maine:"Northeast", Maryland:"Northeast",
  Massachusetts:"Northeast", "New Hampshire":"Northeast", "New Jersey":"Northeast", "New York":"Northeast", Pennsylvania:"Northeast",
  "Rhode Island":"Northeast", Vermont:"Northeast", Virginia:"Northeast", "West Virginia":"Northeast"
,
  Alabama:"Southeast", Arkansas:"Southeast", Florida:"Southeast", Georgia:"Southeast", Kentucky:"Southeast", Louisiana:"Southeast",
  Mississippi:"Southeast", "North Carolina":"Southeast", "South Carolina":"Southeast", Tennessee:"Southeast"
,
  Illinois:"Midwest", Indiana:"Midwest", Iowa:"Midwest", Kansas:"Midwest", Michigan:"Midwest", Minnesota:"Midwest", Missouri:"Midwest",
  Nebraska:"Midwest", "North Dakota":"Midwest", Ohio:"Midwest", "South Dakota":"Midwest", Wisconsin:"Midwest"
,
  Arizona:"Southwest", "New Mexico":"Southwest", Oklahoma:"Southwest", Texas:"Southwest",

  Alaska:"West", California:"West", Colorado:"West", Hawaii:"West", Idaho:"West", Montana:"West", Nevada:"West",
  Oregon:"West", Utah:"West", Washington:"West", Wyoming:"West"

};

// Create SVG container
const svg = d3.select("#chart-container")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);


// Populate the region dropdown
const regionSelect = d3.select("#region-select");
regionSelect
  .selectAll("option")
  .data(Object.values(stateToRegion).filter((v, i, a) => a.indexOf(v) === i)) // Get unique region values
  .enter()
  .append("option")
  .text(d => d);


// Variable to store the loaded CSV data
let occupationsData;


// Variable to store the occupation dropdown
const occupationSelect = d3.select("#occupation-select");


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
  updateChart(selectedOccupation, regionSelect.node().value);
}

// Add a formula to flag the job as "high" or "low risk" based on custom probability thresholds
const calculateRisk = (probability) => {
  const numericProbability = +probability; // Convert probability to a number
  if (numericProbability < 0.5) {
    return "Low";
  } else {
    return "High";
  }
};

// Update the table based on selected occupation and probability
function updateTable(occupation, probability) {
  const tableBody = d3.select("#table-body");
  tableBody.html(""); // Clear previous table content

  // Filter data based on selected occupation
  const filteredData = occupationsData.filter(d => d.Occupation === occupation);

  // Create rows in the table
  filteredData.forEach(d => {
    const row = tableBody.append("tr");
    row.append("td").text(d.Occupation);
    row.append("td").text(d.Probability);
    
   // Calculate risk based on custom probability thresholds
   const risk = calculateRisk(probability);
   row.append("td").text(risk);
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

// Update the table based on selected occupation and default probability
const defaultProbability = 0.5; // You can adjust this value based on your criteria
const initialOccupation = occupationsData.map(d => d.Occupation)[0];
updateTable(initialOccupation, defaultProbability);

// Initial chart update with the first available occupation and region
updateChart(initialOccupation, regionSelect.node().value);


// Event listeners for the dropdowns
occupationSelect.on("change", function() {
  updateTable(this.value);
  updateChart(this.value, regionSelect.node().value);
});

regionSelect.on("change", function() {
  updateChart(occupationSelect.node().value, this.value);
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


function updateChart(occupation, region){

// Find the occupation data
const occupationData = occupationsData.find(d => d.Occupation === occupation);


// Filter the states based on the selected region
const statesInRegion = Object.entries(stateToRegion).filter(([state, reg]) => reg === region).map(([state]) => state);


// Create a new array for the bar chart data
const barChartData = statesInRegion.map(state => {
  return{
    State: state,
    Jobs: +occupationData[state] // convert the string to a number
  };
});


// Define the scales
const xScale = d3.scaleBand()
  .domain(statesInRegion)
  .range([0, width])
  .padding(0,1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(barChartData, d => d.Jobs)])
  .range([height, 0])
  .nice();


// Draw the axes
svg.selectAll(".axis").remove(); // clear previous axes

const xAxis = d3.axisBottom(xScale);
svg.append("g")
  .attr("class", "axis x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis)
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

// X-axis title
svg.append("text")             
   .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
   .style("text-anchor", "middle")
   .text("US States");


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
   .text("Number of Jobs per State");


// Bind the bar chart data to the rects
const bars = svg.selectAll(".bar")
    .data(barChartData, d => d.State);

// select the tooltip and hide it
const tooltip = d3.select("#tooltip");

bars.enter()
    .append("rect")
    .attr("class", "bar")
    .merge(bars)
    .on("mouseover", function(d) {
       const barData = d3.select(this).datum(); 
       const jobs = barData.Jobs;
       
// Get mouse coordinates relative to the SVG container
const [mouseX, mouseY] = d3.mouse(this.parentNode);       

    // Show tooltip
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    tooltip.html(`Jobs: ${jobs}`)
    .style("left", (mouseX + margin.left) + "px") // Adjust for margins
    .style("top", (mouseY + margin.top - 28) + "px"); // Adjust for margins
})
    .on("mouseout", function(d) {

      // Hide tooltip
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
    })

    .transition()
    .duration(500)
    .attr("x", d => xScale(d.State))
    .attr("y", d => yScale(d.Jobs))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.Jobs))
    .attr("fill", "#7393B3");

  
//bars.exit().remove();    
}





