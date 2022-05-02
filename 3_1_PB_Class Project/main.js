/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .5,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};

// // since we use our scales in multiple functions, they need global scope
      let svg,
       xScale, 
       yScale,
       xAxis,
       yAxis,
       xAxisGroup,
       yAxisGroup
       ;
  

/* APPLICATION STATE */
let state = {
  data: [],
    selection: "",
};


/* LOAD DATA */

d3.csv('../data/CovidData.csv', d => {
  
  return {
       Month: d.Month,
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
                   .domain([new Date("2020-01-01") , new Date("2020-12-31")])
                 //.domain(d3.extent(state.data, d => d.NewMonth))
                   .range([margin.left, width-margin.right])
        
        
        yScale = d3.scaleLinear()
                   .domain([0, d3.max(state.data, d=> d.DeathToll)])
                   .range([height-margin.bottom, margin.top])


        xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.timeFormat("%b"))
                  //.ticks(10)
                  

        yAxis = d3.axisLeft(yScale)

      //  const xAxisLabel = 'Months'
      //  const yAxisLabel = 'Death Toll'

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
                        // .attr("transform", "translate(0," + height + ")")
                        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
                        .call(xAxis)   
                        
         yAxisGroup = svg.append("g")
                        .attr("transform", `translate(${margin.left}, ${0})`)
                        .call(yAxis)
    }
function draw(){

      const filteredData = state.data
            .filter(d => d.State === state.selection)


      yScale.domain([0, d3.max(filteredData, d => d.DeathToll)])

      yAxisGroup.transition()
                .duration(1000)
                .call(yAxis.scale(yScale))


      const lineGen = d3.line()
            .x(d => xScale(d.Month))
            .y(d => yScale(d.DeathToll))


      svg.selectAll(".line")
         .data([filteredData])
         .join("path")
         .attr("class", "line")
         .attr("stroke", "blue")
         .attr("fill", "none")
         .attr("d", d => lineGen(d))
             
}


