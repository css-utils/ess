/**
 * Module dependencies
 */

var postcss = require('postcss');
var sws = require('css-sws');
var jade2ast = require('jade2ast');
var processors = require('./processors');
var pre = processors.pre;
var post = processors.post;

module.exports = Parser;

function Parser(css, opts) {
  this.source = css;
  this.opts = opts || {};
  this.compiler = postcss();
}

Parser.prototype.use = function(fn) {
  this.compiler.use(fn);
};

Parser.prototype.parse = function(input) {
  var type = input.type;
  if (this['visit_' + type]) return this['visit_' + type](input);
  return null;
};

Parser.prototype.parseChildren = function(children) {
  if (!children || children.length === 0) return undefined;
  return children.map(this.parse.bind(this));
};

Parser.prototype.visit_atrule = function(rule) {
  if (rule.name === 'block') throw new Error('blocks can only be used as immediate children to constructors (line ' + rule.source.start.line + ')');
  if (rule.name === 'constructor') return this.visit_constructor(rule);
  if (rule.name === 'each') return this.visit_each(rule);
  if (rule.name === 'else') return this.visit_else(rule);
  if (rule.name === 'elseif') return this.visit_elseif(rule);
  if (rule.name === 'expression') return this.visit_expression(rule);
  if (rule.name === 'export') return this.visit_export(rule);
  if (rule.name === 'function') return this.visit_function(rule);
  if (rule.name === '_import') return this.visit_import(rule);
  if (rule.name === 'if') return this.visit_if(rule);
  if (rule.name === 'unbuffered') return this.visit_unbuffered(rule);
  if (rule.name === 'var') return this.visit_var(rule);
  if (rule.name === 'yield') return this.visit_yield(rule);
  return this.visit_atrule_body(rule);
};

Parser.prototype.visit_atrule_body = function(rule) {
  return {
    type: 'tag',
    name: JSON.stringify('@' + rule.name + ' ' + rule.params),
    children: this.parseChildren(rule.nodes),
    buffer: true
  };
};

Parser.prototype.visit_comment = function(comment) {
  return {
    type: 'js_comment',
    value: comment.text
  };
};

Parser.prototype.visit_constructor = function(node) {
  var self = this;
  var call = jade2ast(JSON.parse(node.params))[0];
  call.props = call.props || {};

  var children = (node.nodes || []).filter(function(c) {
    if (c.type !== 'atrule' && c.name !== 'block') return true;
    var parts = c.params.trim().split(/([^\(]+)/);
    var args = parts[3];
    args = args ? '(' + args : undefined;
    
    call.props[parts[1]] = {
      block: true,
      name: parts[1],
      args: args,
      expression: self.parseChildren(c.nodes)
    };
    return false;
  });
  
  call.children = this.parseChildren(children);
  return call;
};

Parser.prototype.visit_decl = function(node) {
  return this.visit_rule({
    nodes: [
      node
    ],
    selector: '&'
  });
};

Parser.prototype.visit_else = function(node) {
  return {
    type: 'else',
    children: this.parseChildren(node.nodes)
  };
};

Parser.prototype.visit_each = function(node) {
  var params = JSON.parse(node.params).trim();
  var parts = params.split(/ *(?:in|of) */);
  var target = parts[0].trim().split(/ *, */);

  return {
    type: 'each',
    expression: parts[1],
    value: target[0],
    key: target[1] || '$index',
    children: this.parseChildren(node.nodes),
    buffer: true
  };
};

Parser.prototype.visit_elseif = function(node) {
  return {
    type: 'elseif',
    expression: JSON.parse(node.params),
    children: this.parseChildren(node.nodes)
  };
};

Parser.prototype.visit_expression = function(node) {
  return {
    type: 'expression',
    expression: JSON.parse(node.params),
    buffer: true
  };
};

Parser.prototype.visit_export = function(node) {
  return {
    type: 'export',
    expression: JSON.parse(node.params)
  };
};

Parser.prototype.visit_function = function(node) {
  return {
    type: 'function',
    expression: node.params,
    children: this.parseChildren(node.nodes)
  };
};

Parser.prototype.visit_if = function(node) {
  return {
    type: 'if',
    expression: JSON.parse(node.params),
    children: this.parseChildren(node.nodes)
  };
};

Parser.prototype.visit_import = function(node) {
  return {
    type: 'import',
    expression: JSON.parse(node.params)
  };
};

Parser.prototype.visit_prop = function(prop) {
  var expr = /^ *=/.test(prop.value) ?
        prop.value.replace(/^ *=/, '') :
        JSON.stringify(prop.value);
  return {
    expression: expr
  };
};

Parser.prototype.visit_root = function(root) {
  return this.parseChildren(root.nodes);
};

Parser.prototype.visit_rule = function(rule) {
  var self = this;
  var selectors = rule.selector.split(',').map(function(sel) {
    return sel.trim();
  });

  var name = '[' + selectors.map(function(sel) {
    return '"' + sel.replace(/\`([^\`]+)`/g, function(_, match) {
      return '" + ' + match + ' + "';
    }) + '"';
  }).join(',') + ']';

  var props = rule.nodes.reduce(function(acc, node) {
    if (node.type !== 'decl') return acc;
    acc[node.prop] = self.visit_prop(node);
    return acc;
  }, {});

  var children = rule.nodes.filter(function(node) {
    return node.type !== 'decl';
  });
  
  return {
    type: 'tag',
    name: name,
    props: props,
    children: this.parseChildren(children),
    buffer: true
  };
};

Parser.prototype.visit_unbuffered = function(node) {
  return {
    type: 'expression',
    expression: JSON.parse(node.params)
  };
};

Parser.prototype.visit_var = function(node) {
  return {
    type: 'var',
    expression: JSON.parse(node.params)
  };
};

Parser.prototype.visit_yield = function(node) {
  var params = JSON.parse(node.params).trim();
  var parts = params.trim().split(/([^\(]+)/);
  var args = parts[3];
  args = args ? '(' + args : undefined;
  return {
    type: 'yield',
    name: parts[1],
    args: args
  };
};

Parser.prototype.toAst = function(test) {
  var css = post(sws(pre(this.source)));
  var ast = this.compiler.process(css, {from: this.opts.filename});

  var transformed = this.parse(ast.root);

  return transformed;
};
