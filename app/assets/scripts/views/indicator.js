var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Barchart = require('./barchart');
var template = require('../templates/indicator.tpl');
var companySpecificIndicators = require('../util/company-specific-indicators');
var isCategoryStart = require('../util/is-category-start');
var baseurl = require('../util/base-url');
var telco = require('../util/telco');

module.exports = Backbone.View.extend({
  template: template,
  tagName: 'div',

  initialize: function (options) {

    var indicator_type = options.indicator_id.charAt(0);

    var data = [];
    var a_telco = [];
    var a_internet = [];

    var indicators = this.model.getSortedScores();
    indicators.forEach(function (i, d) {
      data.push(i);
      var control = $.inArray(i.name, telco);
      if(control == '-1')
      {
        a_internet.push(i);
      }
      else
      {
        a_telco.push(i);
      }

    });

    this.id = 'js--indicator_' + this.model.get('id');
    
    if(indicator_type == 'G')
    {
      this.graphic = new Barchart({
        width: options.width,
        height: 250,
        data: this.model.getSortedScores(),
        id: options.indicator_id
      });
    }
    else 
    {
      this.graphic_telco = new Barchart({
        width: options.width/2,
        height: 250,
        data: a_telco,
        id: options.indicator_id
      });

      this.graphic_internet = new Barchart({
        width: options.width/2,
        height: 250,
        data: a_internet,
        id: options.indicator_id
      }); 
    }
  },

  handleResize: function (dimensions) {},

  render: function () {

    var indicator_type = this.model.get('indicator').charAt(0);

    var label = companySpecificIndicators[this.model.get('indicator')] || '';
    this.model.set('categoryTitle', isCategoryStart[this.model.get('indicator')]);
    this.$el.append(this.template(_.extend({}, this.model.attributes, {
      baseurl,
      label,
      indicator_type
    })));

    if(indicator_type == 'G')
    {
      this.graphic.render(this.$('.bar--container')[0]);
    }
    else 
    {
      this.graphic_telco.render(this.$('.bar--container--telco')[0]);
      this.graphic_internet.render(this.$('.bar--container--internet')[0]);
    }

    return this.$el;
  }
});
