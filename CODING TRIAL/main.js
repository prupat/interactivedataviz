 // Set the dimensions of the chart
      const width = window.innerWidth * .5,
      height = window.innerHeight * .5,
      margin = {top: 20, bottom: 60, left: 80, right: 60};

      // Load data from CSV file
      d3.csv('../data/rent_data2.csv',(d) => {
          return {
            city: d.City,
            borough: d.Borough,
            year: +d.Year,
            month: d.Month.substring(2),
            rentPrice: +d.RentPrice,
          };
        
        }, (error, data) => {
          if (error)
            throw error;

          // Create options for dropdown lists
          const yearOptions = Array.from(new Set(data.map((d) => d.year))).sort();
          const cityOptions = Array.from(new Set(data.map((d) => d.city))).sort();

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
              (d) => d.year == selectedYear && (d.city == selectedCity || d.city == selectedCity2)
            );

            // Group data by month and city
            const groupedData = d3.rollup(
              filteredData,
              (v) => d3.mean(v, (d) => d.rentPrice),
              (d) => d.month,
              (d) => d.city
            );

            // Set up scales
            const xScale = d3
              .scaleBand()
              .domain(groupedData.keys())
              .range([50, 750])
              .paddingInner(0.1);

            const yScale = d3
              .scaleLinear()
              .domain([1000, 11000])
              .range([450, 50]);

            // Set up line generator
            const lineGenerator = d3
              .line()
              .x((d) => xScale(d[0]))
              .y((d) => yScale(d[1]));


            // Select the SVG element on the page and set its size
            const svg = d3.select("#chart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

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