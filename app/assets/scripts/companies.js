var $ = require('jquery');
var Overview = require('./collections/overview');
var Index = require('./views/index');

module.exports = function () {
  var $parent = $('#site-canvas');
  var overview = new Overview();
  var Internet = new Index({
    collection: overview,
    telco: false,
    parent: '#category--internet'
  });
  var Telco = new Index({
    collection: overview,
    telco: true,
    parent: '#category--telco'
  });
  overview.fetch({
    success: function () {
      Internet.render();
      Telco.render();
      // Telco.render('category--telco');
    }
  });
};
