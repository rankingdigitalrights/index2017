var $ = require('jquery');
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
      .rangeRoundBands([0, this.width], 0.08)
      .domain(this.data.map((d) => d.name));

    this.y = d3.scale.linear()
      .range([this.height, 0])
      .domain([-1, 100]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0);

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickFormat(d => d + '%')
      .orient('left');

    this.tip = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.name + '<br />' + Math.round(d.val) + '%');
  },

  render: function (container) {
    this.container = container;
    var indicator_id  = this.id;
    var svg = d3.select(container).append('svg')
      .attr('class', 'bar--chart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    svg.call(this.tip);

    var g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'bar--axis_x')
      .attr('transform', 'translate(0,' + this.height + ')')
    .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-35)')

      .attr('indicator_id', indicator_id) // parameter for ajax calls

      .on('click', function (d) {
        var href = d.toLowerCase().replace('&', '')
          .replace('.', '').replace(' ', '');
          if(indicator_id){
            ajax_call(href, indicator_id);
          }
          else {
            window.location.href = baseurl + '/companies/' + href;
          }
        });


    g.append('g')
      .attr('class', 'bar--axis_y')
      .call(this.yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');

    var bars = g.selectAll('.bar')
      .data(this.data)
    .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'bar bar--' + d.className;
        if (+d.val === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.name))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide);

    bars.transition()
      .duration(200)
      .attr('y', d => this.y(d.val))
      .attr('height', d => this.height - this.y(d.val));





    // TO DO

    $('.close').click(function() {
      $('.modal').hide();
    });

    function ajax_call(href,  id)
    {
      // alert(baseurl + '/assets/static/indicators/' + id.toLowerCase() + '.json');
      $.ajax({ 
        type: 'GET', 
        url: baseurl + '/assets/static/indicators/' + id.toLowerCase() + '.json', 
        dataType: 'json',
        success: function (data) {

          // clear table
          $('#indicatorsTable').text('');

          var name = data.name;
          var paragraph_1 = data.paragraph_1;
          var paragraph_2 = data.paragraph_2;
          var companies = data.companies;

          var company = getObjects(companies, 'id', href);

          // create header
          var header = "<tr><th class='cell--first' width='50%'>"+name+"</th>";
          var headers = company[0].headers;
          var columns = headers.length;
          var width = 50/columns
          for (var i = 0; i < headers.length; i++) {
            header += "<th class='cell--"+i+"' width="+width+"%>" + headers[i].text + "</th>";
          };
          header += "</tr>";
          $('#indicatorsTable').append(header);
          
          var company_name = company[0].name;
          var company_score = company[0].score;

          $('.indicator--name').text(name);
          $('#paragraph--1').text(paragraph_1);
          $('#paragraph--2').text(paragraph_2);
          $('#company--name').text(company_name);
          $('#company--score').text(company_score);

          $('.modal').show(); // display modal

          // create row
          var rows = company[0].rows;
          for (var i = 0; i < rows.length; i++) {
            var row = "<tr>";
            var cells = rows[i].cells;
            for (var j = 0; j < cells.length; j++) {
              row += "<td class='cell--"+j+"'>" + cells[j].value + "</td>";
            }
            row += "</tr>";
            $('#indicatorsTable > tbody:last-child').append(row);
          };

          // create average
          var sum = "<tr class='average'><td class='cell--first'>Average</td>";
          var average = company[0].average;
          for (var i = 0; i < average.length; i++) {
            sum += "<td class='cell--"+i+"'>" + average[i].value + "</td>";
          }
          sum += "</tr>";
          $('#indicatorsTable > tbody:last-child').append(sum);
        }
      });
    };

    function getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
          if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
          } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
      }
      return objects;
    };



  }
});
