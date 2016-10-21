console.log('7.0');

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

var arr1 = [
    {id:"red",value:23},
    {id:"blue",value:50}
];

var arr2 = [
    {id:"purple",value:50},
    {id:"red",value:23},
    {id:"blue",value:50}
];

var arr3 = [
    {id:"purple",value:50},
    {id:"red",value:23},
    {id:"green",value:50},
    {id:"yellow",value:20}
];

d3.select('#array-1').on('click',function(){ show(arr1)});
d3.select('#array-2').on('click',function(){ show(arr2)});
d3.select('#array-3').on('click',function(){ show(arr3)});

function show(arr){
    
    var updateSet = plot.selectAll("circle")
        .data(arr, function(d){return d.id})
        .style("stroke", "none"); //UPDATE

    var enterSet = updateSet.enter()
        .append("circle") //ENTER
        .attr("r", 0);

    console.log(enterSet.size());

    var exitSet = updateSet.exit().transition().attr("r", 0).remove(); //EXIT

    updateSet
        .merge(enterSet)
         .style("fill", function(d){
            return d.id;
        })

        .attr("cy", h/2)
        .transition()
        .attr("cx", function(d,i){
            return i*100;
        })
        .attr("r", 20);

    plot.selectAll("circle")
        .data(arr)
        .enter()
        .append("circle")
        .style("fill", function(d){
            return d.id;
        })

        .attr("cy", h/2)
        .attr("cx", function(d,i){
            return i*100;
        })
        .attr("r", 20);

}

/*
function show(arr){
    var updateSet = plot.selectAll('circle')
        .data(arr, function(d){return d.id}); //UPDATE

    var enterSet = updateSet.enter()
        .append('circle')
        .style('fill',function(d,i,g){console.log(g); return d.id})
        .style('stroke','black')
        .style('stroke-width','6px');

    var exitSet = updateSet.exit()
        .attr('r',2)
        .style('stroke','blue')
        .style('stroke-width','2px').remove();

    updateSet
        .style('stroke','black')
        .style('stroke-width','2px')
        .style('fill',function(d,i,g){console.log(g); return d.id});

    updateSet
        .merge(enterSet)
        .transition()
        .attr('cx',function(d,i){return 50+i*100})
        .attr('cy',h/2)
        .attr('r',20);
}
*/