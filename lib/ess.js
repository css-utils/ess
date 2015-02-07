/**
 * Module dependencies
 */

var read = require('fs').readFileSync;
var Parser = require('./parser');

/**
 * Transform the css to a module definition
 */

exports = module.exports = function(css, opts) {
  var parser = new Parser(css, opts);
  return parser.toAst();
};

exports.file = function(file, opts) {
  opts = opts || {};
  opts.filename = file;
  return exports(read(file, 'utf8'), opts);
};
