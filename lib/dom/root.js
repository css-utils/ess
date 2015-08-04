module.exports = EssResult;

function EssResult(nodes) {
  this.nodes = nodes;
}

EssResult.prototype.process = function(parentSelectors) {
  return this.processChildren(parentSelectors, this.nodes);
};

EssResult.prototype.processChildren = function(parentSelectors, node) {
  if (Array.isArray(node)) return node.map(this.processChildren.bind(this, parentSelectors)).join('\n');
  if (node.process) return node.process(parentSelectors);
  return node.toString();
};

EssResult.prototype.toString = function() {
  return this.process([]);
};
