// @TODO: YOUR CODE HERE!
// Set the SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

// Set SVG margins
var margin = {
    top: 20,
    right: 100,
    bottom: 80,
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
d3.csv("data.csv").then(function (censusData) {

    // convert data to numbers
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty) + 2])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare) + 2])
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
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "#D1EA02")
        .attr("stroke", "#000C87");

    var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

    circleLabels
        .attr("x", function (d) {
            return xLinearScale(d.poverty);
        })
        .attr("y", function (d) {
            return yLinearScale(d.healthcare);
        })
        .text(function (d) {
            return d.abbr;
        })
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")

    
    // Step 1: Append a div to the body to create tooltips, assign it a class
    // =======================================================
    // var toolTip = d3.select("body").append("div")
    //     .attr("class", "tooltip");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d. }<br>Poverty: ${d.poverty}<br>Health Care: ${d.healthcare}`)
        });

    chartGroup.call(toolTip);







    // Step 2: Add an onmouseover event to display a tooltip
    // ========================================================
    circlesGroup.on("mouseover", function (d, i) {
        toolTip.style("display", "block");
        toolTip.html(`${d.state}<hr>% Lacking Healthcare: ${d.healthcare}<hr>% in Poverty: ${d.poverty}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    })
        // Step 3: Add an onmouseout event to make the tooltip invisible
        .on("mouseout", function () {
            toolTip.style("display", "none");
        });
    
    
    // // initialize tooltip
    // var toolTip = d3.tip()
    //     .attr("id", "tooltip")
    //     .offset([0, 0])
    //     .html(function (d) {
    //         return (`${d.state}<hr>% Lacking Healthcare: ${d.healthcare}<hr>% in Poverty: ${d.poverty}`);
    //     });

    // // create the tooltip
    // chartGroup.call(toolTip);

    // // create event listeners displaying and hiding tooltip
    // circlesGroup.on("click", function (data) {
    //     toolTip.show(data, this);
    // })
    //     // event handler for onmouseevent
    //     .on("mouseout", function (data, index) {
    //         toolTip.hide(data);
    //     });

});