/**
 * Module dependencies
 */

var DOM = require('./dom');
var Root = require('./lib/dom/root');
var slice = Array.prototype.slice;

module.exports = function(mod, from) {
  return function(props) {
    var out = mod.render(DOM, $get, props, null, genYield(props)) || '';
    return new Root(out);
  };
};

function $get(path, parent, fallback) {
  for (var i = 0, child; i < path.length; i++) {
    if (!parent) return undefined;
    child = parent[path[i]];
    if (typeof child === 'function') parent = child.bind(parent);
    else parent = child;
  }
  return parent;
}

function genYield(props) {
  props = props || {};
  return function $yield(name, $get, t) {
    if (!name) return props.children;
    var prop = props[name];
    if (typeof prop === 'function') return prop.apply({g: $get, t: t}, slice.call(arguments, 3));
    return prop || '';
  };
}