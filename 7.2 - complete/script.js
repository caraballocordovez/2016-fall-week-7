console.log('7.2');

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

var scaleX, scaleY, scaleSize;

//Import data and parse
d3.queue()
    .defer(d3.csv,'../data/world_bank_1995_gdp_co2.csv',parse)
    .defer(d3.csv,'../data/world_bank_2010_gdp_co2.csv',parse)
    .await(function(err,rows1995,rows2010){
        //Mine for max and min
        var minX = d3.min(rows2010,function(d){return d.gdpPerCap}),
            maxX = d3.max(rows2010,function(d){return d.gdpPerCap});
        var extentY = d3.extent(rows2010,function(d){return d.co2PerCap});
        var extentPop = d3.extent(rows2010,function(d){return d.pop});
        scaleX = d3.scalePow()
            .exponent(.5)
            .domain([minX, maxX])
            .range([0,w]);
        scaleY = d3.scalePow()
            .exponent(.5)
            .domain(extentY)
            .range([h,0]);
        scaleSize = d3.scaleSqrt()
            .domain(extentPop)
            .range([2,50]);

        //Draw axis
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


        draw(rows2010);

        //toggle between years
        d3.select('#year-1995').on('click',function(){ draw(rows1995)});
        d3.select('#year-2010').on('click',function(){ draw(rows2010)});
    });


function draw(rows){

    //Represent: nodes
    var nodes = plot.selectAll('.country')
        .data(rows,function(d){return d.code}); //UPDATE

    //Enter
    var nodesEnter = nodes.enter() //ENTER
        .append('g')
        .attr('class','country')
        .attr('transform',function(d){
            return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.co2PerCap)+')';
        })
        .on('click',function(d){
           d3.select(this).classed('highlight',true);
        });

    nodesEnter.append('circle')
        .attr('r',function(d){
            //return scaleSize(d.pop);
            return 0;
        })
        .style('fill-opacity',1)
        .style('stroke','blue');
    nodesEnter.append('text')
        .text(function(d){return d.code});

    //Exit
    nodes.exit().remove();

    //Update
    var nodesTransition = nodes
        .merge(nodesEnter) //UPDATE + ENTER
        .transition().duration(1000)
        .attr('transform',function(d){
            return 'translate('+scaleX(d.gdpPerCap)+','+scaleY(d.co2PerCap)+')';
        });

    nodesTransition.select('circle')
        .attr('r', function(d){
            return scaleSize(d.pop);
        })
        .style('fill-opacity',.1)
        .style('stroke','black');
}

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