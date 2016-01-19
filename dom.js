/**
 * Module dependencies
 */

var Rule = require('./lib/dom/rule');
var AtRule = require('./lib/dom/atrule');
var File = require('./lib/dom/file');

var slice = Array.prototype.slice;

module.exports = function(selectors, props) {
  var children = slice.call(arguments, 2);

  if (selectors === '__ESS_FILE__') return new File(props, children);

  props = props || [];
  if (typeof selectors === 'function') {
    props.children = children;
    return selectors(props);
  }

  if (selectors === '&' || selectors.length === 1 && selectors[0] === '&') return {
    type: 'parent_props',
    props: props
  };

  var extracted = extractParentProps(children);
  props = mergeProps(extracted.props, props);
  if (selectors.indexOf('@') === 0) return new AtRule(selectors, props, extracted.children, extracted.raw);
  return new Rule(selectors, props, extracted.children, extracted.raw);
};

function extractParentProps(children, init) {
  if (children && !Array.isArray(children)) children = [children];
  return (children || []).reduce(function(acc, child) {
    if (Array.isArray(child) || child && child.nodes) return extractParentProps(child.nodes || child, acc);

    if (child && child.type === 'parent_props') {
      acc.props = mergeProps(acc.props, child.props);
    } else if (typeof child === 'string') {
      acc.raw.push(child);
    } else {
      acc.children.push(child);
    }
    return acc;
  }, init || {props: [], raw: [], children: []});
}

function mergeProps(parent, child) {
  if (Array.isArray(child)) return parent.concat(child);
  for (var k in child) {
    parent.push([k, child[k]]);
  }
  return parent;
}
