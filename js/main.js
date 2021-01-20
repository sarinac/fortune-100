///////////////////////////////////////////////////////////////////////////
///////////////////////////// Set Constants ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

const numCompanies = 100;

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Color Scale ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Create color scale
var colorInput = [
    "Tech", 
    "Health Care", 
    "Finance", 
    "Consumer Goods + Food", 
    "Transportation + Industrials",
];

var colorOutput = [
    "#A4DBF9", // light blue
    "#ed1c24", // red
    "#F9E199", // yellow
    "#91B3D7" , // blue
    "#FEB5A2", // orange
];

var colorScale = d3.scaleOrdinal()
    .domain(colorInput)
    .range(colorOutput);

///////////////////////////////////////////////////////////////////////////
////////////////////////////// Fortune Chart //////////////////////////////
///////////////////////////////////////////////////////////////////////////

d3.csv("data/fortune.csv", function(error, data){

    if (error) throw error;

    // Convert data types
    for(var i = 0; i < data.length; i++) { 
        data[i].url = "" + data[i].url; // string
        data[i].rank = +data[i].rank; // numeric
        data[i].company = "" + data[i].company; // string
        data[i].revenues = +data[i].revenues; // numeric
        data[i].revenue_pct_change = +data[i].revenue_pct_change; // numeric
        data[i].profits = +data[i].profits; // numeric
        data[i].profits_pct_change = +data[i].profits_pct_change; // numeric
        data[i].assets = +data[i].assets; // numeric
        data[i].market_val = +data[i].market_val; // numeric
        data[i].rank_change_1000 = +data[i].rank_change_1000; // numeric
        data[i].employees = +data[i].employees; // numeric
        data[i].revenues = +data[i].revenues; // numeric
        data[i].rank_change_500 = +data[i].rank_change_500; // numeric
        data[i].sector = "" + data[i].sector; // string
        data[i].industry = "" + data[i].industry; // string    
        data[i].hq = "" + data[i].hq; // string
        data[i].website = "" + data[i].website; // string
        data[i].years_on_fortune500 = +data[i].years_on_fortune500; // numeric
        data[i].costs = +data[i].costs; // numeric
        data[i].revenue_pct = +data[i].revenue_pct; // numeric
        data[i].cost_pct = +data[i].cost_pct; // numeric
    };

    // Filter companies
    data = data.filter(function(d){ return d.rank <= numCompanies; })

    // Create first chart
    firstChart(data);

    // Create second chart
    secondChart(data);

}); //d3.csv
	