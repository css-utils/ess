/**
 * Module dependencies
 */

var trim = require('./trim');

module.exports = function(css) {
  return css.replace(/^( *)([A-Z].*)/, function(_, ws, match) {
    return ws + '@constructor ' + trim(match);
  });
};
