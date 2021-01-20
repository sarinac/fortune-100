function secondChart(data) {

	///////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Set up the SVG //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Size the main Fortune SVG
    var widthFortune = 1450,
        heightFortune = 1450;

    var svg = d3.select('#fortune-chart-2')
    	.append("svg")
        	.attr("width", widthFortune)
        	.attr("height", heightFortune)
	        .append("g")
	        	.attr("transform", "translate(" + widthFortune / 2 + "," + heightFortune / 2 +")");

    // Create parameters
    var offset = 20,
    	startAngle = offset,
    	endAngle = 360 - offset,
    	startAngleRadians = (Math.PI / 180) * startAngle, 
    	endAngleRadians = (Math.PI / 180) * endAngle,
    	revInnerRadius = 100,
    	revOuterRadius = 300,
    	rankRadius = revOuterRadius + 20,
    	nameRadius = rankRadius + 20,
    	marketRadius = nameRadius + 280;

    // Angle Positioning (Radians)
    var radianScale = d3.scaleLinear()
    	.domain([0, numCompanies])
    	.range([startAngleRadians, endAngleRadians]);

	// Angle Positioning (Degrees)
    var degreeScale = d3.scaleLinear()
    	.domain([0, numCompanies])
    	.range([startAngle, endAngle]);

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Legend /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    legend = svg
    	.append("g");

    // Draw Arc
    function drawArc(radius) {

    	let arc = d3.arc()
    		.startAngle(-Math.PI/180 * 0.75 * offset)
	        .endAngle(Math.PI/180 * 0.75 * offset)
	        .innerRadius(radius)
	        .outerRadius(radius+2);

	    legend
	    	.append("path")
	    	.attr("d", arc)
	    	.attr("fill", "#717171");
    };

    drawArc(revOuterRadius - 30);
    drawArc(rankRadius);
    drawArc(nameRadius + 30);
    drawArc(marketRadius);

    // Add Text
    function addText(text, radius){

    	legend 
    		.append("text")
	    	.text(text)
	    	.attr("x", 0)
	    	.attr("y", radius)
	    	.style("text-anchor", "middle")
	    	.attr("alignment-baseline", "middle")
	    	.style("font-weight", "bold")
	    	.style("stroke", "#ffffff")
	    	.style("stroke-width", 15);

	    legend 
    		.append("text")
	    	.text(text)
	    	.attr("x", 0)
	    	.attr("y", radius)
	    	.style("text-anchor", "middle")
	    	.attr("alignment-baseline", "middle")
	    	.style("font-weight", "bold");

    };

    addText("Revenue ($M)", -revOuterRadius + 30);
	addText("Rank", -rankRadius);
	addText("Company", -nameRadius - 30);
	addText("Market Value ($M)", -marketRadius);

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Background ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

	backgroundArc = d3.arc()
    	.startAngle(d => radianScale(d-10))
        .endAngle(d => radianScale(d))
        .innerRadius(0)
        .outerRadius(marketRadius);

    background = svg 
    	.append("g");

    background
    	.append("g")
	    	.selectAll("path")
	    	.data([10, 30, 50, 70, 90])
	    	.enter()
	    	.append("path")
	    		.attr("fill", "#f2f2f2")
	    		.attr("d", backgroundArc)
	    		.style("stroke-width", 0);
	
	background
		.append("g")
	    	.selectAll("path")
	    	.data([20, 40, 60, 80, 100])
	    	.enter()
	    	.append("path")
	    		.attr("fill", "#fafafa")
	    		.attr("d", backgroundArc)
	    		.style("stroke-width", 0);

	// Create white center
	defs = svg.append("defs");

	filter = defs.append("filter")
	    .attr("id", "drop-shadow")
	    .attr("width", "500%")
	    .attr("height", "500%")
	    .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", 30);

	background 
		.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", revInnerRadius)
		.style("fill", "#fff")
		.style("filter", "url(#drop-shadow)");

	// Add title in middle of circle
	title = svg 
		.append("g");

    title
        .append("text")
	        .attr("x", - 150)
	        .attr("y", 0)
	        .text("The")
	        .style("font-size", 20)
	        .style("font-family","Times New Roman");
    title
        .append("text")
	        .attr("x", - 150)
	        .attr("y", 45)
	        .text("Fortune 100")
	        .style("font-size", 60)
	        .style("font-family","Times New Roman");

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Revenue Arc ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Scale
    revScale = d3.scaleLinear()
    	.domain([0, d3.max(data, d => d.revenues)])
    	.range([(revOuterRadius - revInnerRadius)*0.25, revOuterRadius - revInnerRadius]);

    // Create arc
    revArc = d3.arc()
        .startAngle(d => radianScale(d.rank-1))
        .endAngle(d => radianScale(d.rank))
        .innerRadius(d => revOuterRadius - revScale(d.revenues))
        .outerRadius(revOuterRadius);

    // Use circular barplot to create revenue arc
    svg
    	.append("g")
	    	.selectAll("path")
	    	.data(data)
	    	.enter()
	    	.append("path")
	    		.attr("fill", d => colorScale(recategorize(d.sector)))
	    		.attr("d", revArc);

	// Add text
    svg
    	.append("g")
	    	.selectAll("text")
	    	.data(data)
	      	.enter()
	      	.append("g")
		        .attr("text-anchor", d => d.rank < numCompanies / 2 ? "end" : "start")
		        // .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + (revOuterRadius - revScale(d.revenues) - 10) + ",0)")
		        .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + (revOuterRadius - 10) + ",0)")
		      	.append("text")
			      	.text(d => formatter.format(Math.round(d.revenues)) + "M")
			        .attr("transform", d => d.rank >= numCompanies / 2 ? "rotate(180)" : "rotate(0)") // Flip text
			        .attr("alignment-baseline", "middle")
			        .style("font-size", 8)
			        .style("fill", "#fff")
			        .attr("font-weight", "bold");

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Rankings ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Draw circles
    svg
    	.append("g")
    		.selectAll("circle")
	    	.data(data)
	      	.enter()
	      	.append("circle")
		      	.attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + rankRadius + ",0)")
	      		.attr("cx", 0)
	      		.attr("cy", 0)
	      		.attr("r", 6)
				.attr("fill", d => colorScale(recategorize(d.sector)));

	// Add text
    svg
    	.append("g")
	    	.selectAll("text")
	    	.data(data)
	      	.enter()
	      	.append("g")
		        .attr("text-anchor", "middle")
		        // .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + (revOuterRadius - revScale(d.revenues) - 10) + ",0)")
		        .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + rankRadius + ",0)")
		      	.append("text")
			      	.text(d => d.rank)
			        .attr("transform", d => d.rank >= numCompanies / 2 ? "rotate(180)" : "rotate(0)") // Flip text
			        .attr("alignment-baseline", "middle")
			        .style("font-size", 6)
			        .style("fill", "#fff");

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////////////// Market Value //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Scale radius
    marketScale = d3.scaleSqrt()
    	.domain([0, d3.max(data, d => d.market_val)])
    	.range([20, 100]);

    // Draw circles
    svg
    	.append("g")
    		.selectAll("circle")
	    	.data(data)
	      	.enter()
	      	.append("circle")
		      	.attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + marketRadius + ",0)")
	      		.attr("cx", 0)
	      		.attr("cy", 0)
	      		.attr("r", d => marketScale(d.market_val))
				.attr("fill", d => colorScale(recategorize(d.sector)))
				.style("opacity", .6);

	// Add text
	svg
    	.append("g")
	    	.selectAll("text")
	    	.data(data)
	      	.enter()
	      	.append("g")
		        .attr("text-anchor", "middle")
		        .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + marketRadius + ",0)")
		      	.append("text")
			      	.text(d => formatter.format(Math.round(d.market_val)) + "M")
			        .attr("transform", d => d.rank > numCompanies / 2 ? "rotate(180)" : "rotate(0)") // Flip text
			        .attr("alignment-baseline", "middle")
			        .style("font-size", 10)
			        .attr("font-weight", "bold");

	///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Names //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    svg
    	.append("g")
	    	.selectAll("text")
	    	.data(data)
	      	.enter()
	      	.append("g")
		        .attr("text-anchor", d => d.rank > numCompanies / 2 ? "end" : "start")
		        .attr("transform", d => "rotate(" + (degreeScale(d.rank - .5) - 90) + ")"+"translate(" + nameRadius + ",0)")
		      	.append("text")
			      	.text(d => d.company)
			        .attr("transform", d => d.rank > numCompanies / 2 ? "rotate(180)" : "rotate(0)") // Flip text
			        .attr("alignment-baseline", "middle");

};