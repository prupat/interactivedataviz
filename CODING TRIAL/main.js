 /* CONSTANTS AND GLOBALS */
      const width = window.innerWidth * .5,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};
      
//  // Declare date format
// const formatDate = d3.timeParse("%y-%b");


// //declare tooltip variable
// let tooltip;

// /* APPLICATION STATE */
// let city = {
//   data: [],
//     selection: "",
// };

// let city2 ={
//   data: [],
//     selection: "",
// };


// let year ={
//   data: [],
//     selection: "",
// };

// /* LOAD DATA */

// d3.csv('../data/rent_data2.csv', d => {
  
//   return {
//        Month: new Date (formatDate(d.Month)),
//        State: d.State,
//        DeathToll: +d.DeathToll
//   }
// })
//    .then(data => {
//      console.log("loaded data:", data);
//      state.data = data;
//      state2.data = data;
//      init();
   
//  });


 // Append the SVG object to the body of the page
      const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      // Load data from CSV file
      d3.csv('../data/rent_data2.csv',(d) => {
          return {
            City: d.City,
            Borough: d.Borough,
            Year: +d.Year,
            Month: new Date (formatDate(d.Month)), 
            RentPrice: +d.RentPrice
          };
        
        }, (error, data) => {
          if (error)
            throw error;

          // Create options for dropdown lists
          const yearOptions = Array.from(new Set(data.map((d) => d.Year))).sort();
          const cityOptions = Array.from(new Set(data.map((d) => d.City))).sort();

          // Add options to dropdown lists
          d3.select("#year")
            .selectAll("option")
            .data(yearOptions)
            .enter()
            .append("option")
            .text((d) => d);

          d3.select("#city")
            .selectAll("option")
            .data(cityOptions)
            .enter()
            .append("option")
            .text((d) => d);

          d3.select("#city2")
            .selectAll("option")
            .data(cityOptions)
            .enter()
            .append("option")
            .text((d) => d);

          // Set default values for dropdown lists
          let selectedYear = yearOptions[0];
          let selectedCity = cityOptions[0];
          let selectedCity2 = cityOptions[1];

          // Update chart when dropdown list values change
          d3.select("#year").on("change", updateChart);
          d3.select("#city").on("change", updateChart);
          d3.select("#city2").on("change", updateChart);

          // Set up the initial chart
          updateChart();

          function updateChart() {
            // Get selected values from dropdown lists
            selectedYear = d3.select("#year").property("value");
            selectedCity = d3.select("#city").property("value");
            selectedCity2 = d3.select("#city2").property("value");

            // Filter data based on selected values
            const filteredData = data.filter(
              (d) => d.Year == selectedYear && (d.City == selectedCity || d.City == selectedCity2)
            );

            // Group data by month and city
            const groupedData = d3.rollup(
              filteredData,
              (v) => d3.mean(v, (d) => d.RentPrice),
              (d) => d.Month,
              (d) => d.City
            );

            // Set up scales
            const xScale = d3
              .scaleBand()
              .domain(groupedData.keys())
              .range([50, 750])
              .paddingInner(0.1);

            const yScale = d3
              .scaleLinear()
              .domain([1000, 12000])
              .range([450, 50]);

            // Set up line generator
            const lineGenerator = d3
              .line()
              .x((d) => xScale(d[0]))
              .y((d) => yScale(d[1]));


            // Create a group element inside the SVG and move it to the right and down
            const g = svg.append("g")
              .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // Draw the x-axis
            g.append("g")
              .attr("transform", `translate(0, ${height})`)
              .call(d3.axisBottom(xScale));

            // Draw the y-axis
            g.append("g")
              .call(d3.axisLeft(yScale));

            // Draw the line chart
            g.append("path")
              .datum(groupedData)
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 2)
              .attr("d", lineGenerator);
          }
        }
      );