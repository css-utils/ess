/**
 * Module dependencies
 */

module.exports = function(css) {
  return css.replace(/^( *)(if|else|elseif|each|for) +(.*)\{/, function(_, ws, control, match) {
    return ws + '@' + control + ' ' + JSON.stringify(match) + ' {';
  });
};
