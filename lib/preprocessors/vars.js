/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)var(.+)/, function(_, ws, match) {
    return ws + '@var' + JSON.stringify(match) + ';';
  });
};
