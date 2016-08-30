var ref = require('./references');

var Template = require('template-js');


// Variables to store UI state like members in a class
var registeredUserInterfaces = {};
var uiWindows = {};

function registerUserInterfaceImpl(name, meta) {
  if (registeredUserInterfaces[name]) {
    throw "User interface with name " + name + " already exist";
  }

  registeredUserInterfaces[name] = meta;
}

function createUserInterfaceImpl(name, $container) {
  var meta = registeredUserInterfaces[name];
  if (name) {
    return meta.factory($container);
  }

  throw "There are no registered user interface " + name;

  return null;
}

function unregisterUserInterfaceImpl(name) {
  throw "Not implemented";
}

// ----------------------------

/* Make active specified window. Other windows will be deactivated
 * Params:
 * - ui_name - value of ui-name attribute of window that need to become active.
 */
function activateWindow(ui_name) {
  ref.$page_home_cards.addClass('hidden');
  ref.$page_home_windows.find('[ui-name=":not(' + ui_name + ')"]').addClass('hidden');
  ref.$page_home_windows.find('[ui-name="' + ui_name + '"]').removeClass('hidden');
}

/* Opens specified interafce window. If it doesn't exist, then it would be created
 * Params:
* - ui_name - value of ui-name attr of card (equal to registered user interface name)
 */
function requestWindow(ui_name) {
  // try to find it
  var window = uiWindows[ui_name];
  if (window) {
    activateWindow(ui_name);
  } else {
    // create window and activate it
    if (uiWindows[ui_name]) {
      throw "Window " + ui_name + " already exist";
    }

    // append container and create window
    var win_tmpl = new Template('app/templates/ui-home-window.tmpl.html', {
      ui_name: ui_name
    });
    ref.$page_home_windows.append(win_tmpl.toString());
    var win = createUserInterfaceImpl(ui_name, ref.$page_home_windows.find('[ui-name="' + ui_name + '"]'));
    uiWindows[ui_name] = win;

    activateWindow(ui_name);
  }
}

function initImpl() {
  var items_html = '';

  for (var item in registeredUserInterfaces) {
    if (registeredUserInterfaces.hasOwnProperty(item)) {
      var name = item;
      var meta = registeredUserInterfaces[item];

      meta.__name = name;
      var html_template = new Template('app/templates/ui-home-item.tmpl.html', {
        name: name,
        icon_path: meta.icon,
        display_name: meta.displayName,
        description: meta.description
      });

      items_html += html_template.toString();
    }
  }

  ref.$page_home_cards.html(items_html);

  // subscribe on click
  ref.$page_home_cards.find('[ui-name]').click(function(evt) {
    var ui_name = $(this).attr('ui-name');
    if (ui_name) {
      requestWindow(ui_name);
    }
  });

  uiInterfaces = registeredUserInterfaces;
}

module.exports = {
  init:   initImpl,

  /// TODO: Move register/create/unregistre functions to PluginManager ot somethign like this
  /* Register new factory of specified user interface.
   * Parameters:
   * - name - name of register interface
   * - meta - object that contains meta information. It contains such fields:
   *   - factory - function, that create interface. It has one param - container.
   *               This parameter is a container where user interface can create controls.
   *               Function returns object, that represents window. This object should have such methods:
                   - onActiveChange - calls when window changes it activity state and
                                      receive one flag (ture - active, false - none).
   *   - icon - absolute path to icon, that represents this interface at home screen.
   *   - displayName - name that will be displayed at home screen
   *   - description - string that contains description of user interface (also shows at home screen)
   */
  registerUserInterface     : registerUserInterfaceImpl,

  /* Find registered user interface. Call factory function and return it result.
   * Params:
   * - name - name of user interface to create
   * - $container - container where it shoud be created
   */
  createUserInterface       : createUserInterfaceImpl,

  /* Unregister registered before user interface.
   * Parameters:
   * - name - name of user interface to unregister
   */
  unregisterUserInterface   : unregisterUserInterfaceImpl
};
