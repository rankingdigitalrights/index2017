var $ = require('jquery');
var _ = require('underscore');
var Overview = require('./collections/overview');
var Survey = require('./collections/survey');
var CompanyServices = require('./collections/company-services');
var Barchart = require('./views/services-barchart');
var Indicators = require('./views/category-indicators');
var Collapse = require('./views/collapse');
var barsort = require('./util/barsort');

module.exports = function generateService (category) {

  var $parent = $('#service--overview_chart');
  var overview = new Overview();
  
  var overviewSuccess = function () {
    var data = overview.map(function (model) {
    // var data = overview.filter(model => model.get('telco') === true).map(function (model) { // filter Overview collection
      return {
        name: model.get('display'),
        src: model.get('id'),
        c: model.get('commitment'),
        f: model.get('freedom'),
        p: model.get('privacy'),
       // val: Math.random()*100,
        className: category
      };
    }).sort(barsort);
    var barchart = new Barchart({
      width: $parent.width(),
      height: 400,
      data: data
    });
    console.info(data);
    barchart.render($parent[0]);
  }

  overview.fetch({success: overviewSuccess});

  /*
  if (category === 'freedom-of-expression') {
    category = 'freedom';
  }

  var toggles = [];
  toggles.push(new Collapse({
    el: $('.trigger'),
    $body: $('.collapse--target')
  }));

  var $parent = $('#service--overview_chart');
  var overview = new Overview();
  var overviewSuccess = function () {
    var data = overview.map(function (model) {
    // var data = overview.filter(model => model.get('telco') === true).map(function (model) { // filter Overview collection
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
  */

};
