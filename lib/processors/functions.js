/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)function(.*)\{/, function(_, ws, match) {
    return ws + '@function' + match + '{';
  });
};
