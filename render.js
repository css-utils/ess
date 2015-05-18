/**
 * Module dependencies
 */

var postcss = require('postcss');
var nested = require('postcss-nested');
var DOM = require('./dom');
var slice = Array.prototype.slice;

module.exports = function(mod, from) {
  var compiler = postcss([nested]);
  return function(props) {
    var out = mod.render(DOM, $get, props, null, genYield(props)) || '';
    var str = flatten([], out).join('');
    return compiler.process(str, {from: from}).css;
  };
};

function flatten(acc, out) {
  if (!Array.isArray(out)) acc.push(out);
  else out.forEach(flatten.bind(null, acc));
  return acc;
}

function $get(path, parent, fallback) {
  for (var i = 0; i < path.length; i++) {
    if (!parent) return undefined;
    child = parent[path[i]];
    if (typeof child === 'function') parent = child.bind(parent);
    else parent = child;
  }
  return parent;
}

function genYield(props) {
  props = props || {};
  return function $yield(name) {
    if (!name) return props.children;
    var prop = props[name];
    if (typeof prop === 'function') return prop.apply(null, slice.call(arguments, 1));
    return prop || '';
  };
}
