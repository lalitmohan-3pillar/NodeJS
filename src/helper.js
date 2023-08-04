const handlebars = require('handlebars');

handlebars.registerHelper('substring', function(str, start, end) {
  return str.substring(start, end);
});

module.exports = handlebars;