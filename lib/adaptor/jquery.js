'use strict';

var GeoPicker = require('../index');

var applyJQuery = function applyJQuery(jQuery) {
  jQuery.fn.GeoPicker = function (settings) {
    if (typeof settings === 'strings') {} else {
      new GeoPicker(this, settings);
    }
    return this;
  };
};

if (typeof define === 'function' && define.amd) {
  define(['jquery'], applyJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    applyJQuery(jq);
  }
}

module.exports = applyJQuery;