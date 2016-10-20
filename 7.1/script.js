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

    //Mine for max and min
    var minX = d3.min(rows,function(d){return d.gdpPerCap}),
        maxX = d3.max(rows,function(d){return d.gdpPerCap});
    var extentY = d3.extent(rows,function(d){return d.co2PerCap});
    var extentPop = d3.extent(rows,function(d){return d.pop});

    //Scales

    //Axis

    //Represent

});

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