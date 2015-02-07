/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)yield([^\}]*)/, function(_, ws, match) {
    var val = match.trim();
    return ws + '@yield ' + JSON.stringify(val) + ';';
  });
};
