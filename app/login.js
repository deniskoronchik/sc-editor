var ipcRenderer = require('electron').ipcRenderer;

$(document).ready(function() {
  $('.ui.form').form({
    fields: {
      email: {
        identifier  : 'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your e-mail'
          },
          {
            type   : 'email',
            prompt : 'Please enter a valid e-mail'
          }
        ]
      },
      password: {
        identifier  : 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your password'
          },
          {
            type   : 'length[8]',
            prompt : 'Your password must be at least 6 characters'
          }
        ]
      }
    }
  });

  ipcRenderer.send('logged-in', 'Denis Koronchik');
});
