/**
 * Module dependencies
 */

var postcss = require('postcss');
var nested = require('postcss-nested');
var DOM = require('./dom');
var slice = Array.prototype.slice;

module.exports = function(mod, from) {
  var compiler = postcss([validate, nested]);
  return function(props) {
    var out = mod.render(DOM, $get, props, null, genYield(props)) || '';
    var str = Array.isArray(out) ? out.join('') : out;
    return compiler.process(str, {from: from}).css;
  };
};

function validate(css) {
  (css.nodes || []).forEach(function(node) {
    if (!node.selector || !~node.selector.indexOf('&')) return;
    throw new Error('properties cannot be declared in the root. check ' + node.source.input.from);
  });
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
