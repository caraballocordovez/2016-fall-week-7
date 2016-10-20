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
    var scaleX = d3.scalePow()
        .exponent(.5)
        .domain([minX, maxX])
        .range([0,w]);
    var scaleY = d3.scalePow()
        .exponent(.5)
        .domain(extentY)
        .range([h,0]);
    var scaleSize = d3.scaleSqrt()
        .domain(extentPop)
        .range([2,20]);

    //Represent: nodes
    var nodes = plot.selectAll('.country')
        .data(rows)
        .enter()
        .append('g')
        .attr('class','country')
        .attr('transform',function(d){
            return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.co2PerCap)+')';
        })
        .on('click',function(d){
           d3.select(this).classed('highlight',true);
        });

    nodes.append('circle')
        .attr('r',function(d){
            return scaleSize(d.pop);
        });
    nodes.append('text')
        .text(function(d){return d.code});

    //Represent: axis
    var axisX = d3.axisBottom()
        .scale(scaleX)
        .tickSize(-h);
    var axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-w);
    plot.append('g').attr('class','axis axis-x')
        .attr('transform','translate(0,'+h+')')
        .call(axisX);
    plot.append('g').attr('class','axis axis-y').call(axisY);
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