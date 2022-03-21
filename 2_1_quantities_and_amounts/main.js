/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;

const barData = [5, 10, 20, 40, 60, 80]
const width = 900; 
const ScaleFactor = 10;
const barHeight = 50; 
const graph = d3.select("#container")
              .style('background', '#c9d7d6')
              .append("svg")
              .attr('width', width)
              .attr('height', barHeight * barData.length);


const bar = graph.selectAll("g")
                  .data(barData)
                  .enter().append("g")
                  .attr('transform', function (d, i){
                    return 'translate(0, '+ i * barHeight +')';
                  });

 bar.append("rect")
         .attr('width', function (d){
         return d * ScaleFactor;
 })                 
          .attr('height', barHeight -1)

bar.append("text")
          .attr('x' , function (d){
           return (d * ScaleFactor);
   })

          .attr('y', barHeight / 2)
          .attr('dy', '.35em')
          .text(function (d) {
            return d;
          });




   /* LOAD DATA */


    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
