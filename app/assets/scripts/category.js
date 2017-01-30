var $ = require('jquery');
var _ = require('underscore');
var Overview = require('./collections/overview');
var Survey = require('./collections/survey');
var Barchart = require('./views/barchart');
var Indicators = require('./views/category-indicators');
var Collapse = require('./views/collapse');
var barsort = require('./util/barsort');

module.exports = function generateCategory (category) {

  if (category === 'freedom-of-expression') {
    category = 'freedom';
  }

  var toggles = [];
  toggles.push(new Collapse({
    el: $('.trigger'),
    $body: $('.collapse--target')
  }));

  var $parent = $('#category--overview_chart');
  var overview = new Overview();
  var overviewSuccess = function () {
    var data = overview.map(function (model) {
      return {
        name: model.get('display'),
        src: model.get('id'),
        val: Math.round(model.get(category)),
        className: category
      };
    }).sort(barsort);
    var barchart = new Barchart({
      width: $parent.width(),
      height: 400,
      data: data
    });
    barchart.render($parent[0]);
  }
  overview.fetch({success: overviewSuccess});

  var survey = new Survey();
  var indicators = new Indicators({
    category,
    collection: survey
  });

  survey.fetch({
    success: () => indicators.render('category--indicators')
  });

};
