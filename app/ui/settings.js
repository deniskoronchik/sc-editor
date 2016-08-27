var ref = require('./references');

/* This module implement UI for a settings page
 */
settings = {}

function SettingsUI() {
  var tabs = [];

  function create_header(tab) {
    return $(document.createElement('a'))
              .addClass('item')
              .attr('data-tab', tab.getId())
              .text(tab.getName());
  }

  function create_content(tab) {
    return $(document.createElement('div'))
              .addClass('ui bottom attached tab segment')
              .attr('data-tab', tab.getId());
  }

  return {

    add: function(tab) {
      if (tabs.indexOf(tab) !== -1) {
        throw "Tab " + tab.getId() + " already exist";
      }

      tabs.push(tab);
      // create container for this tab
      var $header = create_header(tab);
      ref.$page_settings_tab_header.append($header);
      // make active first tab
      var $content = create_content(tab);
      ref.$page_settings_tab_content.append($content);

      tab.onCreate($content);
      if (tabs.length === 1) {
        $header.addClass('active');
        $header.tab('change tab', tab.getId());
      }

    },

    remove: function(tab) {
      var tab_id = null;
      if (typeof tab === 'string') {
        tab_id = tab;
      } else {
        tab_id = tab.getId();
      }

      ref.$page_settings_tab_header.remove('[data-tab="' + tab_id + '"]');
      ref.$page_settings_tab_content.remove('[data-tab="' + tab_id + '"]');

      /// TODO: find new active
    },

    save: function() {
      // find avtive tab
      var active_id = ref.$page_settings_tab_header.find('.active').attr('data-tab');
      if (active_id && active_id.length > 0) {
        for (var t in tabs) {
          var tab = tabs[t];
          if (tab.getId() === active_id) {
            tab.onSave();
          }
        }
      }
    }
  };
}

// --------------------------------------
function SettingsTab(options) {
  var opts = options;
  var $container = null;

  return {
    getContainer: function() {
      return $container;
    },

    getId: function() {
      return options.id;
    },

    getName: function() {
      return options.name;
    },

    onActive: function() {
      options.onActive(this);
    },

    onSave: function() {
      options.onSave(this);
    },

    onCreate: function($cont) {
      $container = $cont;
      options.onCreate(this, $container);
    }
  };
}

// --------------------------------------

var settings_ui = new SettingsUI();
settings.add_tab = function(tab) {
  settings_ui.add(tab);
}

// tab - object or id of a tab to remove
settings.remove_tab = function(tab) {
  settings_ui.remove(tab);
}

settings.save = function() {
  settings_ui.save();
}

/* constructor for a settings ui-tab provider
 * Options:
 * - id: unique id, of this tab in english.
 * - name: string that contains display name of a tab
 * - onActive: function that will be calls, when tab appears active. It takes
 * two parameters:
 *     - pointer to this tab
 *     - boolean value (if active - true; otherwise - false);
 * - onCreate: function that calls one time, when tab ui need to be constructed.
 * Takes one parameter:
 *     - pointer to this tab
 * - onSave: function that calls when user request to save values from this tab
 * It takes two parameters
 *     - pointer to this tab
 *     - jquery object of tab ui container;
 */
settings.Tab = SettingsTab;

module.exports = settings;
