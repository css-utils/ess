var Root = require('./root').prototype;
module.exports = File;

function File(props, children) {
  this.location = props.location + encodeProps(props.props);
  this.nodes = Array.isArray(children) ? children : [children];
  this._i = 0;
}
File.prototype = Object.create(Root);

File.prototype.process = function(parentSelectors, _location) {
  return [
    this.begin(),
    Root.process.call(this, parentSelectors, this),
    this.end()
  ].join('');
};

File.prototype.begin = function() {
  if (this._i === 0) return '/** BEGIN ' + this.location + ' **/\n';
  this._i++;
  return '';
};

File.prototype.end = function() {
  this._i--;
  if (this._i === 0) return '\n/** END ' + this.location + ' **/';
  return ''
};

function encodeProps(props) {
  return Object.keys(props || {}).length ? ' ' + JSON.stringify(props) : '';
}
