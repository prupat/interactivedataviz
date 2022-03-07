/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;
var bar =[20,50, 10, 60, 30];
var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5;

var yScale = d3.scaleLinear()
    .domain([0, d3.max(bar)])
    .range([0,height]);

var xScale = d3.scaleBand()
  .domain(bar)
  .paddingInner(.3)
  .paddingOuter(.1)
  .range([0, width])

  d3.select('#container').append('svg')
     .attr('width', width)
     .attr('height', height)
     .style('background', '#c9d7d6')
    .selectAll('rect'). data(bar)
    .enter().append('rect')
      .style('fill', '#00441b')
      .attr('width', function(d){
        return xScale.bandwidth();
      })
      .attr('height', function(d){
        return yScale(d);
      })
      .attr('x', function(d) {
        return xScale(d);
      })
      .attr('y', function(d) {
        return height - yScale(d);
      });










/* LOAD DATA */


    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
