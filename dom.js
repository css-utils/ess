/**
 * Module dependencies
 */

var Rule = require('./lib/dom/rule');
var AtRule = require('./lib/dom/atrule');
var assign = require('object-assign');

var slice = Array.prototype.slice;

module.exports = function(selectors, props) {
  var children = slice.call(arguments, 2);
  props = props || {};
  if (typeof selectors === 'function') {
    props.children = children;
    return selectors(props);
  }

  delete props.key;

  if (selectors === '&' || selectors.length === 1 && selectors[0] === '&') return {
    type: 'parent_props',
    props: props
  };

  var extracted = extractParentProps(children);
  props = assign(extracted.props, props);
  if (selectors.indexOf('@') === 0) return new AtRule(selectors, props, extracted.children, extracted.raw);
  return new Rule(selectors, props, extracted.children, extracted.raw);
};

function extractParentProps(children, init) {
  if (children && !Array.isArray(children)) children = [children];
  return (children || []).reduce(function(acc, child) {
    if (Array.isArray(child) || child && child.nodes) return extractParentProps(child.nodes || child, acc);

    if (child && child.type === 'parent_props') {
      for (var key in child.props) {
        acc.props[key] = child.props[key];
      }
    } else if (typeof child === 'string') {
      acc.raw.push(child);
    } else {
      acc.children.push(child);
    }
    return acc;
  }, init || {props: {}, raw: [], children: []});
}