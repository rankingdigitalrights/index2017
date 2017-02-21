var $ = require('jquery');
var Overview = require('./collections/overview');
var Companies = require('./views/index');

module.exports = function () {
  var $parent = $('#site-canvas');
  var overview = new Overview();
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

  overview.fetch({
    success: function () {
      Internet.render();
      Telco.render();
    }
  });
};
