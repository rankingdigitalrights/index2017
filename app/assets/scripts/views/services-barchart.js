var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  margin: {top: 40, right: 20, bottom: 55, left: 40},

  initialize: function (options) {
    /* options
     *  - width
     *  - height
     *  - data
     */
    this.data = options.data;
    this.updateDimensions(options.width, options.height);

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.8)
      .domain(this.data.map((d) => d.name));

    this.y = d3.scale.linear()
      .range([this.height, 0])
      .domain([0, 100]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0);

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickFormat(d => d + '%')
      .ticks(1)
      .tickSize(0)
      .orient('left');

    this.tipC = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.c + '%');
    this.tipF = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.f + '%');
    this.tipP = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.p + '%');
  },

  render: function (container) {
    this.container = container;
    var svg = d3.select(container).append('svg')
      .attr('class', 'bar--chart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    svg.call(this.tipC);
    svg.call(this.tipF);
    svg.call(this.tipP);

    var g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'bar--axis_x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-35),translate(0,10)')
      .on('click', function (d) {
        var href = d.toLowerCase().replace('&', '')
          .replace('.', '').replace(' ', '');
        window.location.href = baseurl + '/companies/' + href;
      });

      g.append('g')
      .attr('class', 'bar--axis_x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-35)')
      .data(this.data)
      .html(d => + d.f + '%');;

    g.append('g')
      .attr('class', 'bar--axis_y')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');

    var barsC = g.selectAll('.barC')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barC bar--' + d.className;
        if (+d.val === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.name) + this.x.rangeBand() + 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tipC.show)
      .on('mouseout', this.tipC.hide);

    var barsF = g.selectAll('.barF')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barF bar--' + d.className;
        if (+d.val === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.name) - this.x.rangeBand() - 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tipF.show)
      .on('mouseout', this.tipF.hide);

    var barsP = g.selectAll('.barP')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barP bar--' + d.className;
        if (+d.val === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.name))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tipP.show)
      .on('mouseout', this.tipP.hide);

      

    barsC.transition()
      .duration(200)
      .attr('y', d => this.y(d.c))
      .attr('height', d => this.height - this.y(d.c));
    barsF.transition()
      .duration(200)
      .attr('y', d => this.y(d.f))
      .attr('height', d => this.height - this.y(d.f));
    barsP.transition()
      .duration(200)
      .attr('y', d => this.y(d.p))
      .attr('height', d => this.height - this.y(d.p));
    

  }
});
