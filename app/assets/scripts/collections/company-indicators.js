var Backbone = require('backbone');
var model = require('../models/company-indicator');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  model: model,
  url: baseurl + '/assets/static/company-indicator.json',
});
