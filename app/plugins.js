var Q = require('q');
var FileSystem = require('fs');
var Template = require('template-js');
var Path = require('path');
var Log = require('electron-log');

var settings = require('./settings');
var ui_settings = require('./ui/settings');

// TODO: possible make a plugin manager as an external package

/* Each plugin should be an unique directory and has file <plugin_name>.json with specified meta information.
 * You can use such fields in in:
 * - name: name of a plugin (required)
 * - version: version of a plugin (required)
 * - main: relative path to a main js file of a plugin (required)
 * - order: plugin load priority (optional) (default - 1000). Plugins with less value of order will load first.
 * - load: flag to load plugin (optional) (default - true). If true, then plugin will be loaded; otherwise - not.
 * - icon: relative path to icon file (optional) (default - null)
 * - description: string with description (optional) (default - empty string)
 */
function PluginManager() {
  var plugins = [];

  return {
    // Find and load all plugins in specified path directory
    loadPlugins: function(path) {
      Log.info('Load plugins from path ' + path);
      /// TODO: make async

      var plugins_meta = [];

      // check if specified path exists
      var stat_info = FileSystem.statSync(path);
      if (stat_info.isDirectory()) {
        var subdirs = FileSystem.readdirSync(path);
        for (var i = 0; i < subdirs.length; ++i) {
          var plugin_path = Path.normalize(Path.join(path, subdirs[i]));

          // check if plugin folder exists
          var plugin_stat_info = FileSystem.statSync(plugin_path);
          if (!plugin_stat_info.isDirectory()) {
            Log.warn(plugin_path + " isn't a directory");
            continue;
          }

          // open package info
          var plugin_package_path = Path.normalize(Path.join(plugin_path, '/package.json'));
          try {
            var plugin_package_stat_info = FileSystem.statSync(plugin_package_path);
          } catch(err) {
            Log.warn("Can't find package.json in " + plugin_path);
            continue;
          }

          if (!plugin_package_stat_info.isFile()) {
            Log.error(plugin_package_path + " isn't a file");
            continue;
          }

          // parse package info
          try {
            var plugin_json_data = FileSystem.readFileSync(plugin_package_path);
            var plugin_json = JSON.parse(plugin_json_data);
          } catch (err) {
            Log.error("Error while open " + plugin_package_path + ": " + err);
            continue;
          }
          plugin_json._this_directory_path = plugin_path;
          plugin_json._this_file_path = plugin_package_path;
          if (plugin_json.order === 'undefined') {
            plugin_json.order = 1000;
          }
          if (plugin_json.load === 'undefined') {
            plugin_json.load = true;
          }
          plugins_meta.push(plugin_json);
        }


        // sort plugins meta, by order
        plugins_meta.sort(function (a, b) {
          if (a.order < b.order)
            return -1;

          if (a.order > b.order)
            return 1;

          return 0;
        });

        // now load our plugins by order
        for (var i = 0; i < plugins_meta.length; ++i) {
          var meta = plugins_meta[i];

          // determine if plugin main exist
          if (meta.main === undefined) {
            log.error("There are no main property in " + meta._this_file_path);
            continue;
          }

          var plugin_main_path = Path.normalize(Path.join(meta._this_directory_path, meta.main));
          try {
            var plugin_main_info_stat = FileSystem.statSync(plugin_main_path);

          } catch (err) {
            Log.error("Main script " + plugin_main_path + " from " + meta._this_file_path + " can't be found");
            continue;
          }

          if (!meta.load) {
            Log.info("Plugin " + meta._this_file_path + " has load = false");
            continue;
          }

          if (!plugin_main_info_stat.isFile()) {
            Log.error("Main script " + plugin_main_path + " should be a file");
            continue;
          }

          // load plugin
          Log.info("Load plugin " + meta.name + " version " + meta.version);
          try {
            var plugin = new require('./' + Path.relative(__dirname, plugin_main_path));//'./plugins/test-plugin/test-plugin.js'))();
            plugin.__meta = meta;
            plugin.initPlugin();
            plugins.push(plugin);
          } catch (err) {
            Log.error("Error while loading " + plugin_main_path + ' : ' + err);
            continue;
          }
        }

        return true;
      }

      return false;
    },

    each: function(fn) {
      for (var i = 0; i < plugins.length; ++i) {
        fn(plugins[i]);
      }
    }

  };
}

// create settings panel
function create_settings_panel(manager) {

  ui_settings.add_tab(new ui_settings.Tab({
    "id": 'plugins',
    "name": 'Plugins',
    "onActive": function(self) {

    },
    "onCreate": function(self, $container) {
      // create items for a list of plugins
      var items_html = '';
      manager.each(function(plugin) {
        var meta = plugin.__meta;
        var icon = (meta.icon === undefined || meta.icon === null) ? 'assets/images/plugin-empty-icon.png' : meta.icon;
        var item_tmpl = new Template('app/templates/plugin_item.tmpl.html', {
          plugin_icon: icon,
          plugin_name: meta.name,
          plugin_description: meta.description
        });
        items_html += item_tmpl.toString() + '\n';
      });

      var $tmpl = new Template("app/templates/settings_plugins.tmpl.html", {
        plugins_path_label: 'Plugins path',
        plugins_path_value: settings.get_plugins_path(),
        plugin_items: items_html
      });
      $container.html($tmpl.toString());
    },
    "onSave": function(self) {
      var path = self.getContainer().find('[name="plugins_path"]').val();
      if (path && path.length > 0) {
        settings.set_plugins_path(path);
      }
    }
  }));
}

var plug_manager = new PluginManager();

function initImpl() {

  plug_manager.loadPlugins(settings.get_plugins_path());
  create_settings_panel(plug_manager);
}

module.exports = {
  init                : initImpl
};
