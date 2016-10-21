console.log('7.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv('../data/world_bank_1995_gdp_co2.csv',parse, function(err, rows){
    console.table(rows);

    //Mine for max and min
    var minX = d3.min(rows,function(d){return d.gdpPerCap}),
        maxX = d3.max(rows,function(d){return d.gdpPerCap});
    var extentY = d3.extent(rows,function(d){return d.co2PerCap});
    var extentPop = d3.extent(rows,function(d){return d.pop});

    //Scales
    var ScaleX = d3.scaleLinear()
        .domain([minX, maxX])
        .range([0,w]);

    var ScaleY = d3.scaleLinear()
        .domain(extentY)
        .range([h,0]);

    //Axis
    //First you create an axis 'generator function'
    var axisY = d3.axisLeft()
        .scale(ScaleY); //An axis always needs to know which scale it's representing

    //Next, pass in a selection
    var axisSelection = plot.append("g").attr("class", "axis axis-y");

    axisSelection.call(axisY)
    //you can also call the selection using axisY(axisSelection)

    //Represent
    /* rows.forEach(function(country){

        var x = ScaleX(country.gdpPerCap), //What I'm saying here is "on the Scale of X draw each element starting in the X coordinate of the country's gdpPerCap"
            y = ScaleY(country.co2PerCap);

        var node = plot.append("g")
            .attr("class", "country")
            .attr("transform", "translate("+x+","+y+")");

        node.append("circle")
            .attr("r", 10);

        node.append("text")
            .text(country.code);

    })*/

    var countries = plot.selectAll("circle") //you create the selection as a variable so you can do things with it later, as click on each element an do something
        .data(rows)
        .enter() //creates empty placeholders for missing DOM elements so that the number of placeholders is exactly the same as datapoints.
        .append("circle")
        .attr("cx", function(d){
            return ScaleX(d.gdpPerCap);
        })
        .attr("cy", function(d){
            return ScaleY(d.co2PerCap);
        })
        .attr("r", 10);

        countries.on("click", function(d, i){
            alert(d.name);
        });

        d3.select(this).style("fill", "red");
});

console.log(countries)

function parse(d){
    if(d['GDP per capita, PPP (constant 2011 international $)']=='..' || d['CO2 emissions (metric tons per capita)']=='..'){
        return;
    }

    return {
        name:d['Country Name'],
        code:d['Country Code'],
        gdpPerCap:+d['GDP per capita, PPP (constant 2011 international $)'],
        co2PerCap:+d['CO2 emissions (metric tons per capita)'],
        pop:+d['Population, total']
    }
}