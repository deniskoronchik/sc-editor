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
  const $scroll_content = $container.find('.nl-scroll-content');

  // init audio
  if (!window.AudioContext) {
    if (!window.webkitAudioContext) {
        alert("Your browser does not support any AudioContext and cannot play back this audio.");
        return;
    }

    window.AudioContext = window.webkitAudioContext;
  }

  context = new AudioContext();

  function scrollDown() {
    $scroll_content.animate({ scrollTop: $scroll_content.prop("scrollHeight")}, 200);
  }

  function appendUserMessage(user, msg) {
    var $template = new Template(__dirname + '/templates/nl-chat-item-user.tmpl.html', {
      name: user,
      message: msg
    });
    $message_list.append($template.toString());
    scrollDown();
  }

  function appendSystemMessage(msg) {
    /// TODO: get name of system
    var $template = new Template(__dirname + '/templates/nl-chat-item-system.tmpl.html', {
      name: "JARVIS",
      message: msg
    });
    $message_list.append($template.toString());
    scrollDown();
  }

  function speech(text_addr) {
    function waitSpeech(node) {
      var tryCount = 0;
      function check() {
        console.log('try: ' + tryCount + ' node: ' + keynodes.nrel_result);
        sctp_client.iterate_constr(
          ScType.SctpConstrIter(ScType.SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [node,
                         ScType.sc_type_arc_common | ScType.sc_type_const,
                         ScType.sc_type_node,
                         ScType.sc_type_arc_pos_const_perm,
                         keynodes.nrel_result
                        ],
                        {"result": 2}),
          ScType.SctpConstrIter(ScType.SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                        ["result",
                         ScType.sc_type_arc_pos_const_perm,
                         ScType.sc_type_link
                        ],
                        {"speech": 2})
          ).then((results) => {
            console.log('test');
            if (!results) {
              tryCount++;
              if (tryCount < 10)
                window.setTimeout(check, 500);
            } else {
              var speech_addr = results.get(0, "speech");
              console.log(speech_addr);
              sctp_client.get_link_content(speech_addr, 'binary').then((data) => {
                console.log('got');
              });
            }
          });
      }

      window.setTimeout(check, 500);
    }

    sctp_client.create_node(ScType.sc_type_node | ScType.sc_type_const).then((node) => {
      sctp_client.create_arc(ScType.sc_type_arc_pos_const_perm, node, text_addr).then((arc) => {
        sctp_client.create_arc(ScType.sc_type_arc_pos_const_perm, keynodes.rrel_1, arc).then((arc2) => {
          sctp_client.create_arc(ScType.sc_type_arc_pos_const_perm, keynodes.command_generate_speech_from_text, node).then(() => {
            sctp_client.create_arc(ScType.sc_type_arc_pos_const_perm, keynodes.command_initiated, node).then(() => {
              waitSpeech(node);
            });
          });
        });
      });
    });
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
                       keynodes.nrel_output_text
                      ],
                      {"text": 2})
        ).then((results) => {
          var link_addr = results.get(0, "text");
          speech(link_addr);
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
    $message_input.val("");

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
