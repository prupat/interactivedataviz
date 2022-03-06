/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;
var bar =[20,30, 50, 60, 70];
var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5;

var yScale = d3.scaleLinear()
    .domain([0, d3.max(bar)])
    .range([0,height]);


  d3.select('#container').append('svg')
     .attr('width', width)
     .attr('height', height)
     .style('background', '#c9d7d6')
    .selectAll('rect'). data(bar)
    .enter().append('rect')
      .style('fill', '#00441b')
      .attr('width', barWidth)
      .attr('height', function(d){
        return yScale(d);
      })
      .attr('x', function(d,i) {
        return i*(barWidth + barOffset)
      })
      .attr('y', function(d) {
        return height - yScale(d);
      });










/* LOAD DATA */


    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
