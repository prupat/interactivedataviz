/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .45,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};

//const formatDate = d3.timeFormat("%b");
const formatDate = d3.timeParse("%b-%y");

// // since we use our scales in multiple functions, they need global scope
      let svg,
       xScale, 
       yScale,
       xAxis,
       yAxis,
       xAxisGroup,
       yAxisGroup
       ;
  

       let tooltip;

/* APPLICATION STATE */
let state = {
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


        xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%b"))
                .ticks(12)
        
                // axis.ticks(d3.timeMonth, 1)
                // .tickFormat(d3.timeFormat('%b'));

                // <head>
                // <meta name="viewport" content="width=device-width, initial-scale=1.0">

                  

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
         
        
      })
      
    
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
                        .style("font", "14px times")
                        .attr("transform", `translate(${margin.left}, ${0})`)
                        .call(yAxis.scale(yScale.nice()))


           svg.append("text")
              .attr("class", "xLabel")
              .attr("y", height-10)
              .attr("x", width/2)
              .attr("fill", "blue")
              .text("Year 2020", 3.5)    
              
          svg.append("text")
             .attr("class", "yLabel")
             .attr("transform", "rotate(-90)")
             .attr("y", 15)
             .attr("x", 0 - (height/2))
             .attr("fill", "blue")
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
            //.attr("fill", "yellow")


      yScale.domain([0, d3.max(filteredData, d => d.DeathToll)])

      yAxisGroup.transition()
                .duration(2000)
                .call(yAxis.scale(yScale))


      const lineGen = d3.line()
            .x(d => xScale(d.Month))
            .y(d => yScale(d.DeathToll))

// Draw the line chart
      svg.selectAll(".line")
         .data([filteredData])
         .join("path")
         .attr("class", "line")
         .attr("opacity", 3.5)
         .attr("stroke", "blue")
         .attr("fill", "none")
         .attr("d", d => lineGen(d))

// Add some connection points
      svg.selectAll(".circle-point")
        .data(filteredData)
        .join("circle")
        .attr("class", "circle-point")
        .attr("r", "6")
        .attr("cx", d => xScale(d.Month))
        .attr("cy", d => yScale(d.DeathToll))
        .attr("fill", "blue")
        .attr("opacity", 0.5)
          
        .on("mouseover", function(event,d,i){
                 return tooltip
                .html(`<div>Death Toll: ${d.DeathToll}</div>`) 
                .style("visibility", "visible")
                //.style("opacity", .8)
                //.style("background", tipColor)
              })

        .on("mousemove", function(event){
               return tooltip.style("top", (event.pageY-10)+"px")
                             .style("left", (event.pageX+10) + "px");})       
                
        .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");})

  // .on("mouseover", function(event,d,i){
  //   tooltip
  //   .html(`<div>activity: ${d.activity}</div><div>sightings: ${d.count}</div>`)
  //   .style("visibility", "visible")
  //   .style("opacity", .8)
  //   .style("background", tipColor)

}


