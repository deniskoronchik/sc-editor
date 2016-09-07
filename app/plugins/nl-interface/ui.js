const UI = require('../../ui');
const Template = require('template-js');
const Q = require('q');
const sctp = require('sc-network');
const ScType = sctp.Types;

function UserInterfaceNL($container, sctp_client, keynodes) {
  var html_template = new Template(__dirname + '/templates/nl-window.tmpl.html', {});
  $container.append(html_template.toString());

  const $message_list = $container.find('.list');
  const $message_input = $container.find('input');
  const $say_button = $container.find('.nl-command-line .button');

  function appendUserMessage(user, msg) {
    var $template = new Template(__dirname + '/templates/nl-chat-item-user.tmpl.html', {
      name: user,
      message: msg
    });
    $message_list.append($template.toString());
  }

  function appendSystemMessage(msg) {
    /// TODO: get name of system
    var $template = new Template(__dirname + '/templates/nl-chat-item-system.tmpl.html', {
      name: "JARVIS",
      message: msg
    });
    $message_list.append($template.toString());
  }

  // subscribe to emit system messages
  sctp_client.event_create(ScType.SctpEventType.SC_EVENT_ADD_OUTPUT_ARC, keynodes.main_nl_dialogue_instance, (addr, arg) => {

    sctp_client.get_arc(arg).then((data) => {
      var src_addr = data[0];
      var trg_addr = data[1];
      sctp_client.iterate_constr(
        ScType.SctpConstrIter(ScType.SctpIteratorType.SCTP_ITERATOR_5F_A_F_A_F,
                      [trg_addr,
                       ScType.sc_type_arc_common | ScType.sc_type_const,
                       keynodes.self,
                       ScType.sc_type_arc_pos_const_perm,
                       keynodes.nrel_author
                      ]),
        ScType.SctpConstrIter(ScType.SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                      [trg_addr,
                       ScType.sc_type_arc_common | ScType.sc_type_const,
                       ScType.sc_type_link,
                       ScType.sc_type_arc_pos_const_perm,
                       keynodes.nrel_translation
                      ],
                      {"text": 2})
        ).then((results) => {
          var link_addr = results.get(0, "text");
          sctp_client.get_link_content(link_addr, 'string').then((msg) => {
            console.log(msg);
            appendSystemMessage(msg);
          });
        });
      });
  });

  function emitUserMessage() {
    var message = $message_input.val();

    appendUserMessage('user', message);

    // generate it in memory
    //keynodes.main_nl_dialogue_instance
    sctp_client.create_link().then((link_addr) => {
      sctp_client.set_link_content(link_addr, message).then((addr) => {
        sctp_client.create_arc(sctp.sc_type_arc_pos_const_perm, keynodes.main_nl_dialogue_instance, link_addr);
      });
    });
  }

  // events
  $say_button.on('click', emitUserMessage);
  $message_input.on('keydown', function(evt) {
    if (evt.keyCode == 13) {
      emitUserMessage();
    }
  });

  return {

  };
}


module.exports = {
  factory         : UserInterfaceNL
};
