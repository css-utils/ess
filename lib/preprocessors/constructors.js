/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)([A-Z].*)/, function(_, ws, match) {
    var ending = /(\{|\;) *$/.test(match) ? '' : ';';
    return ws + '@constructor ' + JSON.stringify(match) + ending;
  });
};
