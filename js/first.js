function firstChart(data) {

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Set up the SVG ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Size the main Fortune SVG
    var widthFortune = 1200,
        heightFortune = 1200;
    var svgFortune = d3.select('#fortune-chart')
    	.append("svg")
        	.attr("width", widthFortune)
        	.attr("height", heightFortune);

    // Create parameters
    var totalAngle = 220,
        rankInnerRadius = 520,
        rankLengthRadius = 50,
        profitInnerRadius = 400,
        profitLengthRadius = 100,
        employeeInnerRadius = 250,
        employeeLengthRadius = 20,
        yearInnerRadius = 150,
        yearLengthRadius = 50;

    // Convert degree to radians
    var angleIncrement = totalAngle/numCompanies * Math.PI/180; 

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Annotations //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    const series = Array.from(new Array(numCompanies),(val,index)=>index+1);
    const offset = (270 - totalAngle) * Math.PI / 180 +.01;
    const padding = 15;

    // Add numbers around circle
    annotations = svgFortune
        .append("g")
        .attr("transform", 
            "translate(" + (widthFortune / 2) + "," + heightFortune / 2 +")")
        .selectAll('text')
        .data(series)
        .enter()
        .append("text")
        .text(function(d){ return 101-d; })
        .attr("x", function(d){ return (rankInnerRadius + rankLengthRadius + padding) * Math.cos(angleIncrement*(d-1) + offset); })
        .attr("y", function(d){ return (rankInnerRadius + rankLengthRadius + padding) * Math.sin(angleIncrement*(d-1) + offset); })
        .attr("class", "annotation");

    // Add title in middle of circle
    svgFortune
        .append("text")
        .attr("x", widthFortune / 2 - 50)
        .attr("y", heightFortune / 2 - 20)
        .text("The")
        .style("font-size", 20)
        .style("font-family","Times New Roman");
    svgFortune
        .append("text")
        .attr("x", widthFortune / 2 - 50)
        .attr("y", heightFortune / 2 + 25)
        .text("Fortune 100")
        .style("font-size", 60)
        .style("font-family","Times New Roman");

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Fortune Text //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Set Distance
    const textDistance =[
        {"key": "Rank", "value": rankInnerRadius },
        {"key": "Cost % of Profit", "value": profitInnerRadius + profitLengthRadius*.75 },
        {"key": "Revenue % of Profit", "value": profitInnerRadius + profitLengthRadius*.25 },
        {"key": "Market Value", "value": employeeInnerRadius + employeeLengthRadius/2 },
        {"key": "Number of Employees", "value": employeeInnerRadius - employeeLengthRadius/4 },
        {"key": "Year", "value": yearInnerRadius + yearLengthRadius/2 },
    ];

    // Add text
    fortuneText = svgFortune
        .append("g")
        .attr("transform", 
            "translate(" + (widthFortune / 2 + 5) + "," + heightFortune / 2 +")" + 
            " rotate(" + (180-totalAngle)  + ")") 
        .selectAll('text')
        .data(textDistance)
        .enter()
        .append("text")
        .text(function(d){ return d.key; })
        .attr("x",0)
        .attr("y",function(d){ return d.value; });

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Ranking Arc ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    // Create scale
    rankScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){ return d.rank; })])
        .range([0, rankLengthRadius]);

    // Create arc
    rankArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(rankInnerRadius)
        .outerRadius(function(d){ return rankInnerRadius + rankScale(numCompanies - d.rank); });

    // Draw arcs
    rankSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", rankArc); 

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Profit Arc ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    // Create scale
    profitScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, profitLengthRadius]);

    // Create cost arc
    profitCostArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct); })
        .outerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct) + profitScale(d.cost_pct); });

    // Draw cost arc
    profitCostSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", profitCostArc)
        .attr("fill", "#f6f6f6");

    // Create revenue arc
    profitRevArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(profitInnerRadius)
        .outerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct); });

    // Draw revenue arc
    profitRevSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", profitRevArc)
        .attr("fill", "#f6f6f6");

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Employee Arc ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    // Create employee scale
    employeeScale = d3.scaleLog()
        .domain([1, d3.max(data, function(d){ return d.employees; })])
        .range([0, employeeLengthRadius]);

    // Create employee arc
    employeeArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(employeeInnerRadius)
        .outerRadius(function(d){ return employeeInnerRadius - employeeScale(d.employees); });
    
    // Draw employee arc
    employeeSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", employeeArc)
        .attr("fill", "#f6f6f6");

    // Create market value scale    
    marketScale = d3.scaleLog()
        .domain([1, d3.max(data, function(d){ return d.market_val; })])
        .range([0, employeeLengthRadius]);

    // Create market value arc                
    marketArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(employeeInnerRadius)
        .outerRadius(function(d){ return employeeInnerRadius + marketScale(Math.max(d.market_val, 1)); });

    // Draw market value arc    
    marketSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", marketArc)
        .attr("fill", "#f6f6f6");

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Years Arc ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    // Create scale
    yearScale = d3.scaleSqrt()
        .domain([0, d3.max(data, function(d){ return d.years_on_fortune500; })])
        .range([0, rankLengthRadius]);

    // Create arc
    yearArc = d3.arc()
        .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
        .endAngle(function(d,i){ return -(i) * angleIncrement; })
        .innerRadius(yearInnerRadius)
        .outerRadius(function(d){ return yearInnerRadius + yearScale(d.years_on_fortune500); });

    // Draw arcs
    yearSVG = svgFortune.append("g")
        .attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")")
        .selectAll("path")
        .data(data, function(d){ return d.rank; })
        .enter()
        .append("path")
        .attr("d", yearArc)
        .attr("fill", "#f6f6f6");

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Legend //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Size the Legend SVG
    var widthLegend = 400,
        heightLegend = 100;
    var svgLegend = d3.select('#fortune-legend')
        .append("svg")
            .attr("width", widthLegend)
            .attr("height", heightLegend);

    // Draw rectangles
    svgLegend
        .append("g")
        .selectAll("rect")
        .data(colorOutput)
        .enter()
        .append("rect")
            .attr("x", heightLegend / 5 )
            .attr("y", function(d,i){ return i * heightLegend / 5 + 5; })
            .attr("width", 30)
            .attr("height", heightLegend / 5 / 2 )
            .attr("fill", function(d){ return d; });

    // Add text
    svgLegend
        .append("g")
        .selectAll("text")
        .data(colorInput)
        .enter()
        .append("text")
            .attr("x", heightLegend / 5 + 30 + 10 )
            .attr("y", function(d,i){ return i * heightLegend / 5 + heightLegend / 5 / 2 + 5; })
            .text( function(d){ return d; })

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Radio Button ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Initialize graph 
    radioSort();

    // When a radio button is selected then trigger function
    d3.selectAll("input")
        .on("change", radioSort);

    function radioSort() {

        // Get value of selected radio button
        var selection = d3.select('input[name="fortune-select"]:checked').node().value;

        // Sort data based on selected radio button
        dataSort = data.sort(function(a,b){ 
            if (selection == "rank") {
                return a.rank - b.rank;
            } else if (selection == "cost-pct") {
                return b.cost_pct - a.cost_pct;
            } else if (selection == "revenue-pct") {
                return b.revenue_pct - a.revenue_pct;
            } else if (selection == "market-val") {
                return b.market_val - a.market_val;
            } else if (selection == "employees") {
                return b.employees - a.employees;
            } else if (selection == "years") {
                return b.years_on_fortune500 - a.years_on_fortune500;
            } 
        });

        // Reconfigure arc
        rankArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(rankInnerRadius)
            .outerRadius(function(d){ return rankInnerRadius + rankScale(numCompanies - d.rank); });
        // Reconfigure cost arc
        profitCostArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct); })
            .outerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct) + profitScale(d.cost_pct); });
        // Reconfigure revenue arc
        profitRevArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(profitInnerRadius)
            .outerRadius(function(d){ return profitInnerRadius + profitScale(d.revenue_pct); });
        // Reconfigure arc
        yearArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(yearInnerRadius)
            .outerRadius(function(d){ return yearInnerRadius + yearScale(d.years_on_fortune500); });
        // Reconfigure market value arc                
        marketArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(employeeInnerRadius)
            .outerRadius(function(d){ return employeeInnerRadius + marketScale(Math.max(d.market_val, 1)); });
        // Reconfigure employee arc
        employeeArc = d3.arc()
            .startAngle(function(d,i){ return -(i+1) * angleIncrement; })
            .endAngle(function(d,i){ return -(i) * angleIncrement; })
            .innerRadius(employeeInnerRadius)
            .outerRadius(function(d){ return employeeInnerRadius - employeeScale(d.employees); });


        // Move the arcs
        rankSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(rankSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", rankArc)
            .attr("fill", function(d){ return selection == "rank" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });
        profitRevSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(profitRevSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", profitRevArc)
            .attr("fill", function(d){ return selection == "revenue-pct" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });
        profitCostSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(profitCostSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", profitCostArc)
            .attr("fill", function(d){ return selection == "cost-pct" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });
        marketSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(marketSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", marketArc)
            .attr("fill", function(d){ return selection == "market-val" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });
        employeeSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(employeeSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", employeeArc)
            .attr("fill", function(d){ return selection == "employees" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });
        yearSVG
            .data(dataSort, function(d){ return d.rank; })
            .merge(yearSVG) 
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("d", yearArc)
            .attr("fill", function(d){ return selection == "years" ? colorScale(recategorize(d.sector)) : "#f6f6f6"; });

    }; // radioSort()

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////// Highlight + Tooltip ///////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    svgFortune
        .selectAll("g")
        .selectAll("path")
        .on("mouseover", function(d) {

            // Change opacity for unselected companies
            var company = d.company
            svgFortune
                .selectAll("g")
                .selectAll("path")
                .filter(function(d){ return d.company != company; })
                .style("opacity", "40%");

            // Get this bar's x/y values, then augment for the tooltip
            coordinates = d3.select(this).attr("d").slice(1).split(",")
            var xPosition = parseFloat(coordinates[0]);
            var yPosition = parseFloat(coordinates[1]);
            
            // Update the tooltip position and value
            var tooltip = d3.select("#tooltip")
                .style("left", widthFortune / 2 + xPosition + "px") 
                .style("top", heightFortune / 2 + yPosition + "px")                     
            
            // Add text in tooltip
            tooltip
                .select("#tooltip-name")
                .text(d.company)
                .attr("a", d.url);
            tooltip
                .select("#tooltip-rank")
                .text("Rank " + d.rank);
            tooltip
                .select("#tooltip-revenues")
                .text("Revenues " + formatter.format(d.revenues) + "M");
            tooltip
                .select("#tooltip-market")
                .text("Market Value " + formatter.format(d.market_val) + "M");
            tooltip
                .select("#tooltip-employees")
                .text(numberWithCommas(d.employees) + " Employees");
            tooltip
                .select("#tooltip-years")
                .text(d.years_on_fortune500 + " Years on Fortune 500");
       
            // Color the tooltip
            var sector = d.sector
            tooltip
                .select("#tooltip-underline")
                .style("background-color", function(d){ return colorScale(recategorize(sector)); })

            // Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        });

    svgFortune
        .selectAll("g")
        .selectAll("path")
        .on("mouseout", function(d) {

            // Restore opacity
            svgFortune
                .selectAll("g")
                .selectAll("path")
                .style("opacity", "100%");

            //Hide the tooltip
            d3.select("#tooltip")
                .classed("hidden", true);
        });

};
