'use strict';

var OpenmapEditor = require('../index');

var applyJQuery = function applyJQuery(jQuery) {
  jQuery.fn.OpenmapEditor = function (settings) {
    if (typeof settings === 'strings') {} else {
      new OpenmapEditor(this, settings);
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