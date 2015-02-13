/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)block(.*)/, function(_, ws, match) {
    return ws + '@block' + match;
  });
};
