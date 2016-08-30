
side_bar_button_selector      =   '#ui-main-sidebar-button';

$page_settings_content        =   $('#ui-main-settings-page');
$page_settings_tab_header     =   $page_settings_content.find('#ui-main-settings-tab-header');
$page_settings_tab_content    =   $page_settings_content.find('#ui-main-settings-tab-content');

module.exports = {
  side_bar_button_selector:   side_bar_button_selector,

  $content_dimmer:            $('#ui-main-content-dimmer'),
  $side_bar:                  $('#ui-main-sidebar'),
  $side_bar_button:           $(side_bar_button_selector),
  $connection_state:          $('#ui-main-connect-state'),

  $content_pages_container:   $('#ui-main-content'),

  $sidebar_home_button:       $('#ui-main-sidebar-home-button'),
  $sidebar_settings_button:   $('#ui-main-sidebar-settings-button'),
  $sidebar_about_button:      $('#ui-main-sidebar-about-button'),

  $page_home_content:         $('#ui-main-home-page'),
  $page_home_cards:           $('#ui-main-home-page-cards'),
  $page_home_windows:         $('#ui-main-home-window'),

  $page_settings_content:     $page_settings_content,
  $page_settings_tab_header:  $page_settings_tab_header,
  $page_settings_tab_content: $page_settings_tab_content,
  $page_settings_button_save: $('#ui-main-settings-button-save')
}
