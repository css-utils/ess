/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)export(.+)/, function(_, ws, match) {
    return ws + '@export' + JSON.stringify(match) + ';';
  });
};
