// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(stateData) {
    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
    console.log(d3.max(stateData, d => d.healthcare))
    console.log(d3.max(stateData, d => d.poverty))
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, 24])
      .range([0, width]);
    console.log(`X Axis : ${ xLinearScale }`)
    var yLinearScale = d3.scaleLinear()
      .domain([4, 28])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "skyblue")
    .attr("opacity", ".9");

    var text = chartGroup.selectAll()
      .data(stateData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty-.1))
      .attr("y", d => yLinearScale(d.healthcare-.2))
      .text(function (d) { return d.abbr })
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-family","sans-serif")
      .attr("font-weight","bold")
      ;

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Health Care: ${d.healthcare} `);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
   

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (height/1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .attr("font-family","sans-serif")
      .attr("font-weight","bold");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%) ")
      .attr("font-family","sans-serif")
      .attr("font-weight","bold");

    
  });
