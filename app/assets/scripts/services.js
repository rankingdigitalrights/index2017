var queue = require('queue-async');
var $ = require('jquery');

var Company = require('./collections/company');
var Survey = require('./collections/survey');
var Overview = require('./collections/overview');

var CategoryChart = require('./views/category-line-dot-chart');
var SurveyView = require('./views/survey');
var CompanyOverview = require('./views/company-overview');
var Collapse = require('./views/collapse');

function segment (arr) {
  var l = arr.length;
  var segmented = [];
  arr.forEach(function (item, i) {
    if (i < l - 1) {
      segmented.push([arr[i], arr[i + 1]]);
    }
  });
  return segmented;
}

module.exports = function (companyName) {

  // Set up the collapsible bits
  // First find the <h3> delimiters
  var $analysis = $('#js--analysis_inner').children();
  var indices = [];
  for (let i = 0, ii = $analysis.length; i < ii; ++i) {
    if ($analysis.eq(i).is('h3')) {
      indices.push(i);
    }
  }

  // Add the length as the final one so we know where to stop.
  indices.push($analysis.length);

  // Simple function to segment get segments between indices.
  indices = segment(indices);

  // Assign the proper elements to each view.
  indices.forEach(function (segment, idx) {
    var $triggerTarget = $analysis.eq(segment[0]);
    var $body = $();
    for (let i = segment[0] + 1, ii = segment[1]; i < ii; ++i) {
      $body = $body.add($analysis.eq(i));
    }
    var collapse = new Collapse({
      el: $triggerTarget,
      $triggerTarget, $body
    });

    // Default open the first one.
    if (idx === 0) {
      collapse.toggleExpand();
    }

  });

  var overview = new Overview();
  var categories = new CategoryChart({
    collection: overview,
    highlighted: companyName
  });
  var companyOverview = new CompanyOverview({
    collection: overview,
    companyName: companyName,
    container: 'comp--circle_chart'
  });

  overview.fetch({
    success: function () {
      categories.render('comp--dot_chart');
      companyOverview.render();
    }
  });

  // Company responses rely on both survey questions,
  // and how each company answered them.
  var company = new Company({company: companyName});
  var survey = new Survey();

  // Fetch both at once before initializing the view
  var q = queue()
  q.defer(cb => company.fetch({success: () => cb(null, company)}));
  q.defer(cb => survey.fetch({success: () => cb(null, survey)}));
  q.await(function (err, company, survey) {
    var survey = new SurveyView({
      company: company,
      survey: survey
    });
    survey.render('comp--score-table');
  });

};
