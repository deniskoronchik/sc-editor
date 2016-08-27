var ref = require('./ui/references');
var ui_settings = require('./ui/settings');
var settings = require('./settings');

var ui = {};

// Sctp settings tab
ui_settings.add_tab(new ui_settings.Tab({
  "id": 'sctp',
  "name": 'server',
  "onActive": function(self) {

  },
  "onSave": function(self) {
    var $content = ref.$page_settings_tab_content.find('[data-tab="' + self.getId() + '"]');
    var host_value = $content.find('[name="sctp_host"]').val();
    var port_value = $content.find('[name="sctp_port"]').val();

    settings.set_sctp_host(host_value);
    settings.set_sctp_port(parseInt(port_value));
  },
  "onCreate": function(self, $container) {
      var $element =
        $(document.createElement('div'))
          .addClass('ui two column middle aligned relaxed fitted stackable grid')
          .append($(document.createElement('div'))
            .addClass('column')
            .append($(document.createElement('div'))
              .addClass('ui form segment')
              .append($(document.createElement('div'))
                .addClass('field')
                .append($(document.createElement('label')).text('Host'))
                .append($(document.createElement('input'))
                  .attr('name', 'sctp_host')
                  .attr('placeholder', 'localhost')
                  .attr('type', 'text')
                  .val(settings.get_sctp_host)
                )
              )
              .append($(document.createElement('div'))
                .addClass('field')
                .append($(document.createElement('label')).text('Port'))
                .append($(document.createElement('input'))
                  .attr('name', 'sctp_port')
                  .attr('placeholder', '55770')
                  .attr('type', 'text')
                  .val(settings.get_sctp_port)
                )
              )
            )
          );

      $container.append($element);
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
ui.init = function() {
  init_sidebar();

  ref.$content_dimmer.dimmer({
    'closable': false
  });

  // save settings button
  ref.$page_settings_button_save.click(function(e) {
    ui_settings.save();
  });
};

ui.showContentDimmer = function(message = "Loading") {
  ref.$content_dimmer.dimmer('show').find('.text').text(message);
  ref.$side_bar_button.addClass('disabled');
};

ui.hideContentDimmer = function() {
  ref.$content_dimmer.dimmer('hide');
  ref.$side_bar_button.removeClass('disabled');
};

ui.isContentDimmerActive = function() {
  return ref.$content_dimmer.dimmer('is active');
};

ui.updateConnectionState = function(is_connected) {
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

module.exports = ui;
