var ui = {};

ui.init = function() {
  $('#ui-main-sidebar')
    .sidebar({
      context: $('#ui-main-wrap')
    })
    .sidebar('attach events', '#ui-main-sidebar-button');
};

module.exports = ui;
