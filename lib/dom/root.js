module.exports = EssResult;

function EssResult(nodes) {
  this.nodes = nodes;
}

EssResult.prototype.process = function(parentSelectors, location) {
  return this.processChildren(parentSelectors, location, this.nodes);
};

EssResult.prototype.processChildren = function(parentSelectors, location, node) {
  if (Array.isArray(node)) return node.map(this.processChildren.bind(this, parentSelectors, location)).join('\n');
  if (node.process) return node.process(parentSelectors, location);
  return node.toString();
};

EssResult.prototype.toString = function() {
  return this.process([]);
};
