/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)import(.+)/, function(_, ws, match) {
    return ws + '@_import' + JSON.stringify(match) + ';';
  });
};
