var Template = require('template-js');

var ref = require('./ui/references');
var ui_settings = require('./ui/settings');
var settings = require('./settings');


var ui = {};

// Sctp settings tab
ui_settings.add_tab(new ui_settings.Tab({
  "id": 'sctp',
  "name": 'Server',
  "onActive": function(self) {

  },
  "onSave": function(self) {
    var $content = self.getContainer();//ref.$page_settings_tab_content.find('[data-tab="' + self.getId() + '"]');
    var host_value = $content.find('[name="sctp_host"]').val();
    var port_value = $content.find('[name="sctp_port"]').val();

    settings.set_sctp_host(host_value);
    settings.set_sctp_port(parseInt(port_value));
  },
  "onCreate": function(self, $container) {
    var $tmpl = new Template('app/templates/settings_server.tmpl.html', {
      sctp_host_label: "Host",
      sctp_port_label: "Port",
      sctp_host_value: settings.get_sctp_host(),
      sctp_port_value: settings.get_sctp_port()
    });
    $container.html($tmpl.toString());
  }
}));


// --------------------
// value of page attribute for a sidebar button
function switch_content_page(page) {
  ref.$content_pages_container.find('.page:not(hidden)').each(function() {
    $(this).addClass('hidden');
  });

  ref.$content_pages_container.find('#' + page).removeClass('hidden');
}

function init_sidebar() {
  ref.$side_bar.sidebar({
    context: $('#ui-main-wrap')
  }).sidebar('attach events', ref.side_bar_button_selector);

  ref.$side_bar.find('a.item').click(function(e) {
    switch_content_page($(this).attr('page'));
  });
}

// --------------------
initImpl = function() {
  init_sidebar();

  ref.$content_dimmer.dimmer({
    'closable': false
  });

  // save settings button
  ref.$page_settings_button_save.click(function(e) {
    ui_settings.save();
  });
};

setContentDimmerTextImpl = function(message) {
  ref.$content_dimmer.dimmer('show').find('.text').text(message);
}

showContentDimmerImpl = function(message = "Loading") {
  setContentDimmerTextImpl(message);
  ref.$side_bar_button.addClass('disabled');
};

hideContentDimmerImpl = function() {
  ref.$content_dimmer.dimmer('hide');
  ref.$side_bar_button.removeClass('disabled');
};

isContentDimmerActiveImpl = function() {
  return ref.$content_dimmer.dimmer('is active');
};

updateConnectionStateImpl = function(is_connected) {
  var ok_class = 'olive';
  var fail_class = 'red';

  if (is_connected) {
    ref.$connection_state.removeClass(fail_class);
    ref.$connection_state.addClass(ok_class);
  } else {
    ref.$connection_state.removeClass(ok_class);
    ref.$connection_state.addClass(fail_class);
  }
};

module.exports = {
  init                      : initImpl,
  updateConnectionState     : updateConnectionStateImpl,
  isContentDimmerActive     : isContentDimmerActiveImpl,
  hideContentDimmer         : hideContentDimmerImpl,
  showContentDimmer         : showContentDimmerImpl,
  setContentDimmerText      : setContentDimmerTextImpl
};
