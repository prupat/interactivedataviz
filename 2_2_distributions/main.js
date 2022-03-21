/* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ,
//   radius = ;

const data =[
  {"temperature":14.2, "sales": 208},
  {"temperature":16.4, "sales": 310},
  {"temperature":15.2, "sales": 322},
  {"temperature":21.1, "sales": 510},
  {"temperature":18.7, "sales": 403},
  {"temperature":24.8, "sales": 275},
  {"temperature":17.5, "sales": 358},
  {"temperature":19.8, "sales": 137},
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
                   return d.temperature;}) -1, 
                   d3.max(data, function (d) {
                     return d.temperature;}) + 1
                  ])
                  .range([0, width - spacing]);

const yScale = d3. scaleLinear()
                 . domain([0, d3.max(data, function(d){
                   return d.sales;})
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
                return xScale(d.temperature);
              })
              .attr("cy", function(d){
                return yScale(d.sales);
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
