var _ = require('underscore');
var $ = require('jquery');

var d3 = require('d3');
d3.tip = require('d3-tip')(d3);

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
        var data = comp.attributes[i].reverse();

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 20,
            right: 350,
            bottom: 10,
            left: 10
        };

        var width = 460 - margin.left - margin.right,
            height = 45 * data.length; // 200 - margin.top - margin.bottom;


        var svg = d3.select("#indicators--"+i).append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", "100%")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")
            .attr("x", 60)             
            .attr("y", 0)
            .attr("text-anchor", "right")  
            .style("font-size", "14px")
            .style("text-transform", "uppercase") 
            .text("score");

        svg.append("text")
            .attr("x", 110)             
            .attr("y", 0)
            .attr("text-anchor", "left")  
            .style("font-size", "14px")
            .style("text-transform", "uppercase") 
            .text("indicators");

        var x = d3.scale.linear()
            .domain(d3.extent(data, function(d) { 
                var neg = d.value * (-1);
                return neg; 
            }))
            .range([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], 0.3)
            .domain(data.map(function (d) {
                return d.name;
            }));

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0.3)
            .orient("right");

        var tip = d3.tip()
            .attr('class', 'bar--tip')
            .offset([-10, 0])
            .html(function(d) {
                return Math.round(d.value) +"%";
            });

        svg.call(tip);

        var indicator_width = $('#indicators--privacy').width();
        var wrap_width = Number(indicator_width) - 120;

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
                .selectAll("text")
                .attr("y", -8)
                .attr("x", 110)
                .style("font-size", "15px")

            .call(wrap, wrap_width);


        var bars = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                var neg = d.value * (-1); 
                return 100 - Number(d.value);
            })
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) {
                return d.value;
            })
            .attr("height", y.rangeBand())

            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var barBg = svg.selectAll(".barBg")
            .data(data)
            .enter().append("rect")
            .style('fill', '#E5DBD2')
            .attr("x", 0)
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) {
                return 100-Number(d.value);
            })
            .attr("height", y.rangeBand());
    })

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0.1,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 110).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 110).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

  },
});
