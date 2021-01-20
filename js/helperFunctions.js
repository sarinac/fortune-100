// Remaps each sector into 1 of the 5 defined groups
function recategorize (sector) {

	const superSector = {
		"Tech": [
					"Technology", 
					"Telecommunications", 
					"Media"],
		"Health Care": [
					"Health Care"],
		"Finance": [
					"Financials", 
					"Business Services"],
		"Consumer Goods + Food": [
					"Apparel", 
					"Retailing", 
					"Food, Beverages & Tobacco", 
					"Food & Drug Stores", 
					"Hotels, Restaurants & Leisure", 
					"Household Products", 
					"Wholesalers"],
		"Transportation + Industrials": [
					"Engineering & Construction", 
					"Energy", 
					"Aerospace & Defense", 
					"Chemicals", 
					"Transportation", 
					"Motor Vehicles & Parts", 
					"Industrials", 
					"Materials"]
	}

	for (var superList in superSector) {
		if (superSector[superList].indexOf(sector) >= 0) {
			return superList
		}
	}
};

// // Returns a tween for a transition's "d" attribute, transitioning any
// // selected arcs from their current angle to the specified new angle
// // Method taken from http://bl.ocks.org/bumbeishvili/ac9879da139e110fcb91b2b0b569468f
// function arcTween(d, i, category) {

// 	var interpolate = d3.interpolate(this._current, d);
// 	this._current = d;

// 	return function (t) {
// 		var tmp = interpolate(t)
		
// 		// Return the correct Arc
// 		if (category == "rank") {
//             return rankArc(tmp, i);
//         } else if (category == "revenue-pct") {
//             return profitRevArc(tmp, i);
//         } else if (category == "cost-pct") {
//             return profitCostArc(tmp, i);
//         } else if (category == "market-val") {
//             return marketArc(tmp, i);
//         } else if (category == "employees") {
//             return employeeArc(tmp, i);
//         } else if (category == "years") {
//             return yearArc(tmp, i);
//         } 
// 	};
// };

// Format number to currency
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 0
})

// Format number with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  