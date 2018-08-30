'use strict';

const OpenmapEditor = require('../index');

const applyJQuery = (jQuery) => {
  jQuery.fn.OpenmapEditor = function(settings) {
    if (typeof settings === 'strings'){
    } else {
      new OpenmapEditor(this, settings);
    }
    return this;
  }
}

if (typeof define === 'function' && define.amd) {
  define(['jquery'], applyJQuery);
} else {
  const jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    applyJQuery(jq);
  }
}

module.exports = applyJQuery;
