/**
 * Module dependencies
 */

var slice = Array.prototype.slice;

module.exports = function(selectors, props) {
  var children = slice.call(arguments, 2);
  if (typeof selectors === 'function') {
    props = props || {};
    props.children = children;
    return selectors(props);
  }

  return '\n' + formatSelectors(selectors) + ' {\n' +
    formatProps(props) +
    formatChildren(children) +
  '}\n';
};

function formatSelectors(selectors) {
  return Array.isArray(selectors) ?
    selectors.join(',\n') :
    selectors;
}

function formatProps(props) {
  if (!props) return '';
  var parts = [];
  for (var k in props) {
    if (k === 'key') continue;
    parts.push('  ' + k + ': ' + props[k] + ';');
  }
  return parts.join('\n') + '\n';
}

function formatChildren(children) {
  if (!children || children.length === 0) return '';
  return children.map(function(child) {
    if (Array.isArray(child)) return formatChildren(child);
    if (!child) return '';
    return child.split('\n').map(function(line) {
      return '  ' + line;
    }).join('\n');
  }).join('\n') + '\n';
}
