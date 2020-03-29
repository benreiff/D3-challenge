// @TODO: YOUR CODE HERE!
// Set the SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

// Set SVG margins
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import CSV data
d3.csv("data.csv").then(function(censusData) {    
    
    // convert data to numbers
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

    // var xLinearScale = d3.scaleLinear()
    //     .domain([8, 26])
    //     .range([0, width]);

    // var yLinearScale = d3.scaleLinear()
    //     .domain([3, 26])
    //     .range([height, 0])

    var xLinearScale = d3.scaleLinear()
        .domain([25, d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([height, 0])

    // Create bottom and left axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append both axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circle representing data
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d=> xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "#D1EA02")
        .attr("stroke", "#000C87");

    // initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d) {
            return (`${d.state}<hr>}% Lacking Healthcare: ${d.healthcare}<hr>% in Poverty: ${d.poverty}`);
        });

    // create the tooltip
    chartGroup.call(toolTip)

    // create event listeners displaying and hiding tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
        // event handler for onmouseevent
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
        


})