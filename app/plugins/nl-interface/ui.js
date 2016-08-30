var UI = require('../../ui');
var Template = require('template-js');
var Path = require('path');

function UserInterfaceNL($container) {
  var html_template = new Template(__dirname + '/templates/nl-window.tmpl.html', {

  });
  $container.append(html_template.toString());
  
  return {

  };
}


module.exports = {
  register: function() {
    UI.registerUserInterface('NL', {
      factory: function($container) {
        return new UserInterfaceNL($container);
      },
      icon: Path.resolve(__dirname, 'nl-ui-card.png'),
      description: "Talk with system by using natural language",
      displayName: "Natural Language",
    });
  },

  unregister: function() {
    UI.unregisterUserInterface('NL');
  }
};
