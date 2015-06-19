var Rule = require('./rule');

module.exports = AtRule;

function AtRule(selectors, props, children, raw) {
  this.selectors = Array.isArray(selectors) ? selectors : [selectors];
  this.props = props;
  this.children = children || [];
  this.raw = raw;
}

AtRule.prototype.processChildren = function(parent) {
  var self = this;
  if (!self.children.length) return '';
  var children = self.children.map(function(child) {
    return child ? child.process(parent) : '';
  }).join('\n');
  return self.selectors.join(',\n') + ' {\n' + indent(children) + '\n}\n';
};

AtRule.prototype.processSelf = function(parentSelectors) {
  var self = this;
  if (!parentSelectors.length) return '';
  var children = Rule.prototype.processSelf.call(this, parentSelectors);
  return self.selectors.map(function(selector) {
    return selector + ' {\n' + indent(children) + '\n}\n';
  });
};

AtRule.prototype.process = function(parentSelectors) {
  var self = this;
  parentSelectors = parentSelectors || [];
  return self.processSelf(parentSelectors) + '\n' + self.processChildren(parentSelectors);
};

AtRule.prototype.toString = function() {
  var str = this.process();
  return str;
};

function indent(str) {
  return str.split('\n').map(function(line) {
    return '  ' + line;
  }).join('\n');
}
