var $ = require('jquery');
var _ = require('underscore');

var BaseChart = require('./base-chart');
var LineDotChart = require('./line-dot-chart');

var categories = require('../util/categories');

module.exports = BaseChart.extend({
  id: 'category-line-dot-chart',
  tagName: 'div',
  initialize: function (options) {
    this.active = options.highlighted;
  },

  render: function (id) {
    // Only compare telcos amongst other telcos,
    // internet companies amonst other internet companies.
    var active = this.active;
    var activeModel = this.collection.findWhere({'id': active});
    var filtered = this.collection;
    if (!activeModel) {
      console.log('Unable to locate highlighted model', active);
    } else {
      var isTelco = activeModel.get('telco');
      filtered = this.collection.where({telco: isTelco});
    }

    var childViews = [];
    _.each(categories, function (cat) {
      var values = filtered.map(function (model) {
        return {
          display: model.get('display'),
          id: model.get('id'),
          val: model.get(cat.id)
        };
      });
      childViews.push(new LineDotChart({
        values: values,
        active: active,
        isTelco: isTelco,
        category: cat.display
      }));
    });

    var $el = this.$el;
    childViews.forEach(view => $el.append(view.render()));
    $('#' + id).append($el);
    this.childViews = childViews;
  }

});
