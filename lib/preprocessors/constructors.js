/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)([A-Z][^\{\;]*)([\{\;])?/, function(_, ws, match, ending) {
    return ws + '@constructor ' + JSON.stringify(match) + (ending || ';');
  });
};
