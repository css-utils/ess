/**
 * Module dependencies
 */

var trim = require('./trim');

var i = 0;
var PREFIX = 'EXTEND___';

module.exports = function(css) {
  return css.replace(/^( *)\%([^\( ]*)(\([^\)]\))?/, function(_, ws, path, args) {
    var name = PREFIX + (i++);
    return ws + '@_import ' + JSON.stringify(name + ' from ' + JSON.stringify(path + '?raw')) + ';\n' +
           ws + name + (args || '');
  });
};
