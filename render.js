/**
 * Module dependencies
 */

var postcss = require('postcss');
var nested = require('postcss-nested');
var DOM = require('./dom');
var slice = Array.prototype.slice;

module.exports = function(mod) {
  var compiler = postcss([nested]);
  return function(props) {
    var out = mod.render(DOM, $get, props, null, genYield(props));
    var str = Array.isArray(out) ? out.join('') : out;
    return compiler.process(str).css;
  };
};

function $get(path, parent, fallback) {
  for (var i = 0; i < path.length; i++) {
    if (!parent) return undefined;
    parent = parent[path[i]];
  }
  return parent;
}

function genYield(props) {
  return function $yield(name) {
    if (!name) return props.children;
    var prop = props[name];
    if (typeof prop === 'function') return prop.apply(null, slice.call(arguments, 1));
    return prop || '';
  };
}
