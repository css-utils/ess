/**
 * Module dependencies
 */

var p = [
  require('./block'),
  require('./vars'),
  require('./export'),
  require('./if'),
  require('./import'),
  require('./functions'),
  require('./unbuffered'),
  require('./constructors'),
  require('./yield'),
  require('./comment'),
  require('./expression')
];

module.exports = function(css) {
  return css.split('\n').map(function(line) {
    return p.reduce(function(acc, fn) {
      return fn(acc);
    }, line);
  }).join('\n');
};
