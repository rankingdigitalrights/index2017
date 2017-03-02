var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    id: '',
    total: '',
    service: '',
    company: ''
  }
});
