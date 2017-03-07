var _ = require('underscore');
var $ = require('jquery');

var BaseChart = require('./../base-chart');
var ServiceCircleChart = require('./../service-circle-chart');
var categories = require('../../util/categories');
var template = require('../../templates/company-overview.tpl');

module.exports = BaseChart.extend({
  
  initialize: function (options) {
    _.extend(this, options);
    //this.$el.append(this.template());
    //$('#' + options.container).append(this.$el);
  },

  // We want to render four circle graphs:
  // the overview, and each category graph.
  render: function (el) {

    var tmp = this.collection;
    var companyName = this.companyName;
    var comp = tmp.findWhere({ id: companyName });

    var category = ['freedom', 'privacy', 'commitment'];
    category.forEach(function (i, dd) {
        
        //console.info(x);
        var data = comp.attributes[i].reverse();;

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 10,
            right: 350,
            bottom: 10,
            left: 10
        };

        var width = 460 - margin.left - margin.right,
            height = 25 * data.length; // 200 - margin.top - margin.bottom;


        var svg = d3.select("#indicators--"+i).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scale.linear()
            .domain(d3.extent(data, function(d) { 
                var neg = d.value * (-1);
                return neg; 
            }))
            .range([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1)
            .domain(data.map(function (d) {
                return d.name;
            }));

        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("right");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
                .selectAll("text")  
                .attr("x", 110);

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                var neg = d.value * (-1); 
                return x(Math.min(0, neg)); 
            })
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) {
                var neg = d.value * (-1);
                return Math.abs(x(neg) - x(0)); 
            })
            .attr("height", y.rangeBand());
            

        //add a value label to the right of each bar
        /*
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
        });
        */
    })
  },
});
