/**
 * Module dependencies
 */

var pre = [
  require('./vars'),
  require('./unbuffered'),
  require('./expression'),
  require('./export'),
  require('./import'),
  require('./extend'),
  require('./yield')
];

var post = [
  require('./block'),
  require('./if'),
  require('./functions'),
  require('./constructors'),
  require('./comment')
];

exports.pre = gen(pre);
exports.post = gen(post);

function gen(arr) {
  return function(css) {
    return css.split('\n').map(function(line) {
      return arr.reduce(function(acc, fn) {
        return fn(acc);
      }, line);
    }).join('\n');
  };
}
