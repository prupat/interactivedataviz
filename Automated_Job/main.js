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

// Load data from CSV file
d3.csv("../data/Prob_AutoJob.csv").then(rawData => {
  
// Store the loaded data
occupationsData = rawData;

// Populate the occupation dropdown
const occupationSelect = d3.select("#occupation-select");
occupationSelect
    .selectAll("option")
    .data(rawData.map(d => d.Occupation))
    .enter()
    .append("option")
    .text(d => d);

// Initial chart update with the first available occupation and region
updateChart(rawData[0].Occupation, regionSelect.node().value);

// Event listeners for the dropdowns
occupationSelect.on("change", function() {
  updateChart(this.value, regionSelect.node().value);
});

}).catch(error => {
  console.error("Error loading the CSV data: ", error);
});

function updateChart(occupation, region){

// Find the occupation data
const occupationData = occupationData.find(d => d.Occupation === occupation);

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

const yAxis = d3.axisLeft(yScale);
svg.append("g")
   .attr("class", "axis y-axis")
   .call(yAxis);




}





