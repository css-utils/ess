module.exports = Selector;

function Selector(str) {
  if (!(this instanceof Selector)) return new Selector(str);
  this.parts = str ? [str] : [];
}

Selector.prototype.extend = function(str) {
  var parts = this.parts.slice();
  parts.push(str);
  var sel = new Selector();
  sel.parts = parts;
  return sel;
};

Selector.prototype.toString = function() {
  var parts = this.parts;
  return formatSelector(parts, parts.length - 1);
};

function formatSelector(parts, i) {
  var str = parts[i];
  if (i < 1) return str;

  if (!str.match(/[\<\&]/)) return formatSelector(parts, i - 1) + ' ' + str;

  return str
    .replace(/\<\//g, function(match) {
      return formatSelector(parts, 0);
    })
    .replace(/\<+/g, function(match) {
      return formatSelector(parts, i - match.length - 1);
    })
    .replace(/&/g, function() {
      return formatSelector(parts, i - 1);
    });
}
