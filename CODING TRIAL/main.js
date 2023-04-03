 /* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ;

const data =[
  {Year:2010, weather:80, Calories: 210},
  {Year:2011, weather:130, Calories: 150},
  {Year:2012, weather:40, Calories: 200},
  {Year:2013, weather:70, Calories: 180},
  {Year:2014, weather:100, Calories: 160},
  {Year:2015, weather:90, Calories: 190}
  
];
      
const width = 600,
      height = 500,
      spacing = 60,
      margin = {top: 20, right: 10, bottom: 20, left: 10};
      

const xScale = d3.scaleLinear()
                 .domain([d3.min(data, function(d){
                   return d.Year;}),
                         d3.max(data, function(d){
                    return d.Year;})])
                .range([0, width - spacing]);

const yScale = d3.scaleLinear()
                .range([height - spacing, 0]);               
                
const svg = d3.select("#container")
                 .style('background', '#c9d7d6')
                 .append("svg")
                 .attr("width", width)
                 .attr("height", height)
                 .append("g")
                 .attr("transform", "translate(" + spacing/2 + ", " + spacing/2 + ")");

svg.append("g")
    .attr("transform", "translate(0," + (height - spacing) + ")")
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format("d")));

const stack = d3.stack().keys(["weather", "Calories"]);
const colors = ["royalblue", "green"];
const stackedData = stack(data);

yScale.domain([0, d3.max(stackedData[stackedData.length-1],
                        function(d){
                          return d[1]})]);
svg.append("g")
  .call(d3.axisLeft(yScale));

const area = d3.area()
                .x(function(d){
                  return xScale(d.data.Year);})
                .y0(function(d){return yScale(d[0]);})
                .y1(function(d){return yScale(d[1]);});

const series = svg.selectAll("g.series")
                  .data(stackedData)
                  .enter().append("g")
                  .attr("class", "series");
      series.append("path")
            .style("fill", function (d,i){
                 return colors[i];})
            .attr("d", function(d){
                return area (d);});


/* LOAD DATA */
//d3.csv('[PATH_TO_YOUR_DATA]', d => {
  //return {
    // year: new Date(+d.Year, 0, 1),
    // country: d.Entity,
    // population: +d.Population
  //}
//}).then(data => {
 // console.log('data :>> ', data);

  // SCALES

  // CREATE SVG ELEMENT

  // BUILD AND CALL AXES

  // LINE GENERATOR FUNCTION

  // DRAW LINE

//});