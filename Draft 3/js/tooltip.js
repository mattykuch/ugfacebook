function vaccineChart1() {

    // Chart Attributes
    var width = 600,
        height = 120;

    // Radius Extent
    var radiusExtent = [0, 40];

    // Create and configure the tooltip
    var tooltip = tooltipChart()
    .title(function(d) { return d.name; })
    .content(function(d) { return d.description; });

    // Charting Function
    function chart(selection) {
        selection.each(function(data) {

            // Select the container div and create the svg selection
            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            // Append the svg element on enter
            svg.enter().append('svg');

            // Update the width and height of the SVG element
            svg
                .attr('width', width)
                .attr('height', height);

            // Create a scale for the horizontal position
            var xScale = d3.scale.ordinal()
                .domain(d3.range(data.length))
                .rangePoints([0, width], 1);

            var maxDose = d3.max(data, function(d) {
                return d.doses;
            });

            // Create the radius scale
            var rScale = d3.scale.sqrt()
                .domain([0, maxDose])
                .rangeRound(radiusExtent);

            // Create a container group for each circle
            var gItems = svg.selectAll('g.vaccine-item')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'vaccine-item')
                .attr('transform', function(d, i) {
                    return 'translate(' + [xScale(i), height / 2] + ')';
                });

            // Add a circle to the item group
            var circles = gItems.append('circle')
                .attr('r', function(d) { return rScale(d.doses * 2); })
                .attr('fill', function(d) { return d.color; });

            // Add the vaccine name
            var labelName = gItems.append('text')
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .text(function(d) { return d.name; });

            // Add the doses label
            var labelDose = gItems.append('text')
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px')
                .attr('y', 12)
                .text(function(d) { return d.doses + ' dose'; });

            // We add listeners to the mouseover and mouseout events
                circles
                    .on('mouseover', function(d) {
                        d3.select(this)
                            .attr('stroke-width', 3)
                            .attr('fill', d3.rgb(d.color).brighter())
                            .attr('stroke', d.color);
                    })
                    .on('mouseout', function(d) {
                        d3.select(this)
                            .attr('fill', d.color)
                            .attr('stroke-width', 0);
                    })
                    .call(tooltip);
        });
    }

    // Accessor Methods

    // Width
    chart.width = function(val) {
        if (!arguments.length) { return width; }
        width = val;
        return chart;
    };

    // Height
    chart.height = function(val) {
        if (!arguments.length) { return height; }
        height = val;
        return chart;
    };

    return chart;
}

    // Load and parse the json data
d3.json('data/vaccines.json', function(error, root) {

    // Displays an error message
    if (error) {
        console.error('Error getting or parsing the data.');
        throw error;
    }

    // Create and configure the chart
    var vaccines = vaccineChart1();

    // Select the container element and invoke the fruit chart
    d3.select('div#chart01')
        .data([root.data])
        .call(vaccines);
});

// Tooltip API

function tooltipChart() {
    'use strict';

    // Tooltip width and height
    var width = 200,
        height = 80;

    // Tooltip Offset
    var offset = {x: 20, y: 0};

    // Default Accessors for the Title and Content
    var title = function(d) { return d.title; };
    var content = function(d) { return d.content; };

    // Charting function
    function chart(selection) {
        selection.each(function(d) {
            // Bind the mouse events to the container element
            d3.select(this)
                .on('mouseover.tooltip', create)
                .on('mousemove.tooltip', move)
                .on('mouseout.tooltip', remove);
        });
    }

    // Initialize the tooltip
    var init = function(selection) {
        selection.each(function(data) {
            // Create and configure the tooltip container
            d3.select(this)
                .attr('class', 'tooltip-container')
                .style('width', width + 'px');

            // Tooltip Title
            d3.select(this).append('p')
                .attr('class', 'tooltip-title')
                .text(title(data));

            // Tooltip Content
            d3.select(this).append('p')
                .attr('class', 'tooltip-content')
                .text(content(data));
        });
    };

    // Create the tooltip chart
    var create = function(data) {

        // Create the tooltip container div
        var tooltipContainer = d3.select('body').append('div')
            .datum(data)
            .attr('class', 'tooltip-container')
            .call(init);

        // Move the tooltip to its initial position
        tooltipContainer
            .style('left', (d3.event.pageX + offset.x) + 'px')
            .style('top', (d3.event.pageY + offset.y) + 'px');
    };

    // Move the tooltip to follow the pointer
    var move = function() {
        // Select the tooltip and move it following the pointer
        d3.select('body').select('div.tooltip-container')
            .style('left', (d3.event.pageX + offset.x) + 'px')
            .style('top', (d3.event.pageY + offset.y) + 'px');
    };

    // Remove the tooltip
    var remove = function() {
        // Remove the tooltip div.
        d3.select('div.tooltip-container').remove();
    };

    // Accessor for the Title Function
    chart.title = function(titleAccessor) {
        if (!arguments.length) { return title; }
        title = titleAccessor;
        return chart;
    };

    // Accessor for the Content Function
    chart.content = function(contentAccessor) {
        if (!arguments.length) { return content; }
        content = contentAccessor;
        return chart;
    };


    return chart;
}