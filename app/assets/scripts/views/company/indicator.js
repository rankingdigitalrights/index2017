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

    var xxx = this.collection;
    var companyName = this.companyName;
    var comp = xxx.findWhere({ id: companyName });
    console.info(comp);

    //this.collection.forEach(function (d, i) {
        var category = ['freedom', 'privacy', 'commitment'];
        category.forEach(function (xx, yy) {
            //console.info(x);
            var data = comp.attributes[xx];

            //set up svg using margin conventions - we'll need plenty of room on the left for labels
            var margin = {
                top: 15,
                right: 25,
                bottom: 15,
                left: 60
            };

            var width = 200,//460 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var svg = d3.select("#indicators--"+xx).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scale.linear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.value;
                })]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([height, 0], .1)
                .domain(data.map(function (d) {
                    return d.name;
                }));

            //make y axis to show bar names
            var yAxis = d3.svg.axis()
                .scale(y)
                //no tick marks
                .tickSize(0)
                .orient("left");

            var gy = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")

            //append rects
            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.name);
                })
                .attr("height", y.rangeBand())
                .attr("x", 0)
                .attr("width", function (d) {
                    return x(d.value);
                });

            //add a value label to the right of each bar
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

        })
    //});
  },
});
