var _ = require('underscore');
var $ = require('jquery');
var Overview = require('./collections/overview');
var IndexService = require('./collections/index-service');
var Companies = require('./views/index');
var CircleChart = require('./views/circle-chart');

module.exports = function () {
  var $parent = $('#site-canvas');
  var overview = new Overview();
  var indexservice = new IndexService();

  var Internet = new Companies({
    collection: overview,
    telco: false,
    parent: '#category--internet--home'
  });
  var Telco = new Companies({
    collection: overview,
    telco: true,
    parent: '#category--telco--home'
  });

  indexservice.fetch({
    success: function () {
      //console.info(indexservice);
      indexservice.forEach(function (d, i) {
        var id = d.attributes.id;
        var total = d.attributes.total;
        var service = d.attributes.service;
        var company = d.attributes.company;
        var val = 100-total;

        var data = [
          {
            "id": "remainder",
            "name": "Remainder",
            "val": val,
          }, 
          {
            "id": id,
            "max": 100,
            "name": service,
            "val": total,
          }
        ];

        var label = {name: company, val: total};
        var chart = new CircleChart(_.extend({
          width: 200,
          height: 200,
          diameter: 200 * 0.95,
          data: data,
          label: label
        }));
        chart.render('#circle--chart--' + id);
      });
    }
  })
  overview.fetch({
    success: function () {
      Internet.render();
      Telco.render();
    }
  });
};
