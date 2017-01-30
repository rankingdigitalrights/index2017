var Backbone = require('backbone');
var _ = require('underscore');
var Barchart = require('./barchart');
var template = require('../templates/indicator.tpl');
var companySpecificIndicators = require('../util/company-specific-indicators');
var isCategoryStart = require('../util/is-category-start');
var baseurl = require('../util/base-url');

module.exports = Backbone.View.extend({
  template: template,
  tagName: 'div',

  initialize: function (options) {
    this.id = 'js--indicator_' + this.model.get('id');
    this.graphic = new Barchart({
      width: options.width,
      height: 300,
      data: this.model.getSortedScores()
    });
  },

  handleResize: function (dimensions) {},

  render: function () {
    var label = companySpecificIndicators[this.model.get('indicator')] || '';
    this.model.set('categoryTitle', isCategoryStart[this.model.get('indicator')]);
    this.$el.append(this.template(_.extend({}, this.model.attributes, {
      baseurl,
      label
    })));
    this.graphic.render(this.$('.bar--container')[0]);
    return this.$el;
  }
});
