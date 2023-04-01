// set the dimensions and margins of the graph
const width = window.innerWidth * .5,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};

let svg,
    xScale, 
    yScale 
    ;      

// append the svg object to the body of the page
 svg = d3.select("#chart")
    .append("svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  let borough = {
            data: [],
              selection: "",
          };
          
  let city ={
            data: [],
              selection: "",
          };

// Read the data
d3.csv('../data/rent_data.csv', function(data) {

  // Filter data by borough
  const filteredData = borough.data
            .filter(d => d.Borough === borough.selection)
            
       
      const newFilter = d3.max(filteredData, d => d.RentPrice)

     
      const filteredData2 = city.data
            .filter(d => d.City === city.selection)     

      const newFilter2 = d3.max(filteredData2, d => d.RentPrice)   
  
  //const boroughs = Array.from(d3.group(data, d => d.Borough).keys());


  // Create a color scale for each borough
  const color = d3.scaleOrdinal()
    .domain(borough.data.map(d => d.Borough))
    .range(d3.schemeSet2);

  // Create a nested data structure by City, borough and year
  const nestedData = d3.groupBy()
    .key(function(d) { return d.City; })
    .key(function(d) { return d.Borough; })
    .key(function(d) { return d.Year; })
    .rollup(function(v) { return d3.mean(v, function(d) { return d.RentPrice; }); })
    .entries(data);

  // Set the x and y scales
  xScale = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.Year; }))
    .range([0, width]);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.RentPrice; })])
    .range([height, 0]);

  // Add the x axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  // Add the y axis
  svg.append("g")
      .call(d3.axisLeft(yScale));

  // Add a line for each borough
  svg.selectAll(".line")
     .data(nestedData)
     .enter()
     .append("path")
     .attr("fill", "none")
     .attr("stroke", function(d){ return color(d.key) })
     .attr("stroke-width", 2)
     .attr("d", function(d){
        return d3.line()
          .x(function(d) { return xScale(d.key); })
          .y(function(d) { return yScale(d.value); })
          (d.values)
      })

  // Add a legend
  const legend = svg.selectAll(".legend")
    .data(borough.data.map(d => d.Borough))
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d); });

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
});


