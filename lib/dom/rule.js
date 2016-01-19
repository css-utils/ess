var Selector = require('./selector');

module.exports = Rule;

function Rule(selectors, props, children, raw) {
  this.selectors = Array.isArray(selectors) ? selectors : [selectors];
  this.props = props;
  this.children = children;
  this.raw = raw;
}

Rule.prototype.processSelector = function(parentSelectors) {
  var self = this;
  if (!parentSelectors || !parentSelectors.length) return self.selectors.map(Selector);
  return parentSelectors.reduce(function(acc, i) {
    return self.selectors.reduce(function(acc, j) {
      acc.push(i.extend(j));
      return acc;
    }, acc);
  }, []);
};

Rule.prototype.processSelf = function(selectors, location) {
  var props = this.props;
  var raw = this.raw;
  if (!props.length && !raw.length) return '';
  var acc = [];
  acc.push(selectors.join(',\n') + ' {');
  props.forEach(function(prop) {
    if (typeof prop[0] !== 'undefined') acc.push('  ' + prop[0] + ': ' + prop[1] + ';');
  });
  raw.forEach(function(str) {
    acc.push('  ' + str);
  });
  acc.push('}');
  return acc.join('\n');
};

Rule.prototype.processChildren = function(selectors, location) {
  var self = this;
  return self.children.map(function(child) {
    if (typeof child === 'string') return child;
    if (child && child.process) return child.process(selectors, location);
    return '';
  }).join('\n');
};

Rule.prototype.process = function(parentSelectors, location) {
  var self = this;
  parentSelectors = parentSelectors || [];
  var selectors = this.processSelector(parentSelectors);
  var acc = [];
  if (location) acc.push(location.begin());
  acc.push(self.processSelf(selectors, location));
  acc.push(self.processChildren(selectors, location));
  if (location) acc.push(location.end());
  return acc.join('\n');
};

Rule.prototype.toString = function() {
  var str = this.process();
  return str;
};
