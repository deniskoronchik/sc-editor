var UI = require('../../ui');
var Template = require('template-js');

function UserInterfaceNL($container) {
  var html_template = new Template(__dirname + '/templates/nl-window.tmpl.html', {

  });
  $container.append(html_template.toString());

  return {

  };
}


module.exports = {
  factory         : UserInterfaceNL
};
