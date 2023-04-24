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
let city = {
  data: [],
    selection: "",
};

let city2 ={
  data: [],
    selection: "",
};

let year ={
  data: [],
    selection: "",
};

/* LOAD DATA */

d3.csv('../data/rent_data2.csv', d => {
  
  return {
    City: d.City,
    Borough: d.Borough,
    Year: +d.Year,
    Month: new Date (formatDate(d.Month)), 
    RentPrice: +d.RentPrice
  }
})
   .then(data => {
     console.log("loaded data:", data);
     city.data = data;
     city2.data = data;
     year.data = data;
     init();
   
 });


 /* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {

/* SCALES */
        
        xScale = d3.scaleTime()
        .domain(d3.extent(city.data, d => d.Month))
        .range([margin.left, width-margin.right])

        yScale = d3.scaleLinear()
        .domain([0, d3.max(city.data, d=> d.RentPrice)])
        .range([height-margin.bottom, margin.top])
        .nice()

        yScale = d3.scaleLinear()
        .domain([0, d3.max(city2.data, d=> d.RentPrice)])
        .range([height-margin.bottom, margin.top])
        .nice()           

        yScale = d3.scaleLinear()
        .domain([0, d3.max(year.data, d=> d.RentPrice)])
        .range([height-margin.bottom, margin.top])
        .nice()           

          xAxis = d3.axisBottom(xScale)
          .tickFormat(d3.timeFormat("%b"))
          .ticks(7)


          yAxis = d3.axisLeft(yScale)

          const selectElement = d3.select("#dropdown")
     
          selectElement.selectAll("option")
                       .data(["Select a City", ...new Set(city.data.map(d => d.City))])
                       .join("option")
                       .attr("attr", d => d)
                       .text(d => d)
    
          selectElement.on("change", event =>{
             city.selection = event.target.value
             console.log("updated city = ", city)
             draw();
                
          });
    
          const selectElement2 = d3.select("#dropdown2")
     
          selectElement2.selectAll("option")
                       .data(["Select a City", ...new Set(city2.data.map(d => d.City))])
                       .join("option")
                       .attr("attr", d => d)
                       .text(d => d)
    
          selectElement2.on("change", event =>{
             city2.selection = event.target.value
             console.log("updated city = ", city2)
             draw();
                
          });
          
          const selectElement3 = d3.select("#dropdown3")

          selectElement3.selectAll("option")
                       .data(["Select a Year", ...new Set(year.data.map(d => d.Year))])
                       .join("option")
                       .attr("attr", d => d)
                       .text(d => d)
    
          selectElement3.on("change", event =>{
             year.selection = event.target.value
             console.log("updated year = ", year)
             draw();
             
            });

            svg = d3.select("#chart")
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

//ADD LABELS
            svg.append("text")
            .attr("class", "xLabel")
            .attr("y", height-10)
            .attr("x", width/2)
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .text("Month", 3.5)    

            svg.append("text")
            .attr("class", "yLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)
            .attr("x", 0 - (height/2))
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .text("Rent Price")


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

              const filteredData = city.data
                    .filter(d => d.City === city.selection && d.Year === +year.selection)
                    
              const newFilter = d3.max(filteredData, d => d.RentPrice)
      
              const filteredData2 = city2.data
                    .filter(d => d.City === city2.selection && d.Year === +year.selection)  
            
              const newFilter2 = d3.max(filteredData2, d => d.RentPrice)  
              
              const maxUp = Math.max(newFilter, newFilter2)

               yScale.domain([0, maxUp])
        
              yAxisGroup.transition()
                        .duration(1000)
                        .call(yAxis.scale(yScale))
        
        
              const lineGen = d3.line()
                    .x(d => xScale(d.Month))
                    .y(d => yScale(d.RentPrice))
        
              //const colors = d3.scaleOrdinal(d3.schemeCategory10);  
              const colors = d3.scaleOrdinal()
                                .domain([0, 1])
                                .range(["#87bc45", "#b30000"]);


// Draw the line chart
            if(city.selection !== "" && city2.selection !== "" && year.selection !== ""){ 
              svg.selectAll(".line")
                .data([filteredData, filteredData2])
                .join("path")
                .attr("class", "line")
                .attr("d", lineGen)
                .attr("stroke", function(d,i){
                  return colors(i)})
                .attr("stroke-width",  function(d){ 
                  return "2";})
                .attr("fill", "none")
                .transition()
                .duration(1000)
                .attr("d", d => lineGen(d))


  // Add some connection points for 1st line
  svg.selectAll(".circle-point")
  .data(filteredData) 
  .join("circle")     
  .attr("class", "circle-point")
  .attr("r", "3")
  .attr("cx", d => xScale(d.Month))
  .attr("cy", d => yScale(d.RentPrice))
  .attr("fill", "#1f77b4") 
                   
  .on("mouseover", function(event,d,i){
           return tooltip
          .html(`<div><b>Borough:</b> ${d.Borough}</div><div><b>Neighborhood:</b> ${d.City}</div><div><b>Rent Price:</b> $${d.RentPrice}</div>`) 
          .style("visibility", "visible")
          .style("opacity", .8)
          .style("background", "#91b07d")
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
            .attr("r", "3")
            .attr("cx", d => xScale(d.Month))
            .attr("cy", d => yScale(d.RentPrice))
            .attr("fill", "#ff7f0e")
                   
          .on("mouseover", function(event,d,i){
                   return tooltip
                  .html(`<div><b>Borough:</b> ${d.Borough}</div><div><b>Neighborhood:</b> ${d.City}</div><div><b>Rent Price:</b> $${d.RentPrice}</div>`)
                  .style("visibility", "visible")
                  .style("opacity", .8)
                  .style("background", "#d4d493")
                })
          
          .on("mousemove", function(event){
                 return tooltip.style("top", (event.pageY-10)+"px")
                               .style("left", (event.pageX+10) + "px");})       
                  
          .on("mouseout", function(){
                  return tooltip.style("visibility", "hidden");}) 
                  
          }
          }