/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .5,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};

// Declare date format
const formatDate = d3.timeParse("%y-%b");

// since we use our scales in multiple functions, they need global scope
let svg,
  xScale, 
  yScale,
  xAxis,
  yAxis,
  xAxisGroup,
  yAxisGroup
  ;
  
//declare tooltip variable
let tooltip;

       

/* APPLICATION STATE */
let state = {
  data: [],
    selection: "",
};

let state2 ={
  data: [],
    selection: "",
};

/* LOAD DATA */

d3.csv('../data/CovidData.csv', d => {
  
  return {
       Month: new Date (formatDate(d.Month)),
       State: d.State,
       DeathToll: +d.DeathToll
  }
})
   .then(data => {
     console.log("loaded data:", data);
     state.data = data;
     state2.data = data;
     init();
   
 });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  
  
  /* SCALES */
        
        xScale = d3.scaleTime()
                   .domain(d3.extent(state.data, d => d.Month))
                   .range([margin.left, width-margin.right])
        
        
        yScale = d3.scaleLinear()
                   .domain([0, d3.max(state.data, d=> d.DeathToll)])
                   .range([height-margin.bottom, margin.top])
                   .nice()
        
        yScale = d3.scaleLinear()
                   .domain([0, d3.max(state2.data, d=> d.DeathToll)])
                   .range([height-margin.bottom, margin.top])
                   .nice()           

        xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%b"))
                .ticks(12)
        

        yAxis = d3.axisLeft(yScale)


      const selectElement = d3.select("#dropdown")
     
      selectElement.selectAll("option")
                   .data(["Select a State", ...new Set(state.data.map(d => d.State))])
                   .join("option")
                   .attr("attr", d => d)
                   .text(d => d)

      selectElement.on("change", event =>{
         state.selection = event.target.value
         console.log("updated state = ", state)
         draw();
            
      });

      const selectElement2 = d3.select("#dropdown2")
     

      selectElement2.selectAll("option")
                   .data(["Select a State", ...new Set(state2.data.map(d => d.State))])
                   .join("option")
                   .attr("attr", d => d)
                   .text(d => d)

      selectElement2.on("change", event =>{
         state2.selection = event.target.value
         console.log("updated state = ", state2)
         draw();
         
        });
    
        svg = d3.select("#container")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                          
         
         xAxisGroup = svg.append("g")
                        .attr("class", "xAxis")
                        .style("font", "14px times")
                        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
                        .call(xAxis)   
                        
         yAxisGroup = svg.append("g")
                        .attr("class", "yAxis")
                        .style("font", "14px times")
                        .attr("transform", `translate(${margin.left}, ${0})`)
                        .call(yAxis.scale(yScale.nice()))
                        //.call(yAxis)

//ADD LABELS
           svg.append("text")
              .attr("class", "xLabel")
              .attr("y", height-10)
              .attr("x", width/2)
              .attr("fill", "black")
              .attr("font-weight", "bold")
              .text("Year 2020", 3.5)    
              
          svg.append("text")
             .attr("class", "yLabel")
             .attr("transform", "rotate(-90)")
             .attr("y", 15)
             .attr("x", 0 - (height/2))
             .attr("fill", "black")
             .attr("font-weight", "bold")
             .text("Death Toll")
            
          
         // Add a tooltip               
         tooltip = d3.select("body")
                     .append("div")
                     .attr("class", "tooltip")
                     .style("z-index", "10")
                     .style("position", "absolute")
                     .style("visibility", "hidden")
                     .text("tooltip");

    }

function draw(){

      const filteredData = state.data
            .filter(d => d.State === state.selection)
            
       
      const newFilter = d3.max(filteredData, d => d.DeathToll)

     
      const filteredData2 = state2.data
            .filter(d => d.State === state2.selection)     

      const newFilter2 = d3.max(filteredData2, d => d.DeathToll)    
      

       const maxUp = Math.max(newFilter, newFilter2)


       yScale.domain([0, maxUp])
      

      yAxisGroup.transition()
                .duration(1000)
                .call(yAxis.scale(yScale))


      const lineGen = d3.line()
            .x(d => xScale(d.Month))
            .y(d => yScale(d.DeathToll))

      const colors = d3.scaleOrdinal(d3.schemeCategory10);      


// Draw the line chart
if(state2.selection != "" & state.selection != ""){ 
       svg.selectAll(".line")
         .data([filteredData, filteredData2])
         .join("path")
         .attr("class", "line")
         .attr("d", lineGen)
         .attr("stroke", function(d,i){
           return colors(i)})
         .attr("stroke-width",  function(d){ 
           return "3";})
         .attr("fill", "none")
         .transition()
         .duration(1000)
         .attr("d", d => lineGen(d))

        
              
// Add some connection points for 1st line
      svg.selectAll(".circle-point")
        .data(filteredData) 
        .join("circle")     
        .attr("class", "circle-point")
        .attr("r", "5")
        .attr("cx", d => xScale(d.Month))
        .attr("cy", d => yScale(d.DeathToll))
        .attr("fill", "#1f77b4") 
                         
        .on("mouseover", function(event,d,i){
                 return tooltip
                .html(`<div>Death Toll: ${d.DeathToll}</div><div>State: ${d.State}</div>`) 
                .style("visibility", "visible")
                .style("opacity", .8)
                .style("background", "#be93d4")
              })

        .on("mousemove", function(event){
               return tooltip.style("top", (event.pageY-10)+"px")
                             .style("left", (event.pageX+10) + "px");})       
                
        .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");}) 


// Add connection points for 2nd line
svg.selectAll(".circle-point2")
.data(filteredData2)
.join("circle")
  .attr("class", "circle-point2")
  .attr("r", "5")
  .attr("cx", d => xScale(d.Month))
  .attr("cy", d => yScale(d.DeathToll))
  .attr("fill", "#ff7f0e")
         
.on("mouseover", function(event,d,i){
         return tooltip
        .html(`<div>Death Toll: ${d.DeathToll}</div><div>State: ${d.State}</div>`) 
        .style("visibility", "visible")
        .style("opacity", .8)
        .style("background", "#be93d4")
      })

.on("mousemove", function(event){
       return tooltip.style("top", (event.pageY-10)+"px")
                     .style("left", (event.pageX+10) + "px");})       
        
.on("mouseout", function(){
        return tooltip.style("visibility", "hidden");}) 
        
}
}


