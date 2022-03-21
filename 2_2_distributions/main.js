/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;

const data =[
  {"weather":74, "Calories": 208},
  {"weather":59, "Calories": 310},
  {"weather":61, "Calories": 322},
  {"weather":50, "Calories": 510},
  {"weather":35, "Calories": 403},
  {"weather":82, "Calories": 275},
  {"weather":47, "Calories": 358},
  {"weather":96, "Calories": 137},
];

const width = 600,
      height = 500,
      spacing = 120;

const svg = d3.select('#container')
              .style('background', '#c9d7d6')
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + spacing/2 + "," + spacing/2 +")");

const xScale = d3.scaleLinear() 
                 .domain([d3.min(data, function(d){
                   return d.weather;}) -1, 
                   d3.max(data, function (d) {
                     return d.weather;}) + 1
                  ])
                  .range([0, width - spacing]);

const yScale = d3. scaleLinear()
                 . domain([0, d3.max(data, function(d){
                   return d.Calories;})
                  ])
                  .range([height-spacing, 0]);

const xAxis = d3.axisBottom(xScale);                  
const yAxis = d3.axisLeft(yScale);

svg.append("g")
  .attr("transform", "translate(0 " + (height - spacing)+ ")")
  .call(xAxis);

  svg.append("g").call(yAxis);

  const dots = svg.append("g")
                  .selectAll("dot").data(data);

  dots.enter().append("circle")
              .attr("cx", function(d){
                return xScale(d.weather);
              })
              .attr("cy", function(d){
                return yScale(d.Calories);
              })
              .attr("r",15)
              .style("fill", "royalblue");



/* LOAD DATA */
//d3.json("[PATH_TO_YOUR_DATA]", d3.autoType)
  //.then(data => {
   // console.log(data)

    /* SCALES */
    
    /* HTML ELEMENTS */
    
  //});
