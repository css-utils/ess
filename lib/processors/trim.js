module.exports = function(line) {
  for (var i = line.length - 1; i >= 0; i--) {
    if (isEnding(line.charAt(i))) continue;
    return guessEnding(line.slice(0, i + 1), line.slice(i + 1, line.length));
  }
};

function isEnding(val) {
  return val === '}' || val === ';' || val === '{' || val === ' ';
}

function guessEnding(content, ending) {
  var semicolon = ending.trim().charAt(0) !== '{' ? ';' : '';
  return JSON.stringify(content) + semicolon + ending;
}
