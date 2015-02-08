/**
 * Module dependencies
 */

var trim = require('./trim');

module.exports = function(css) {
  return css.replace(/^( *)=(.*)/, function(_, ws, match) {
    return ws + '@expression ' + trim(match);
  });
};
