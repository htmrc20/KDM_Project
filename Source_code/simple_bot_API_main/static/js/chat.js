(function () {

	var is_typing = true;
    var Message;
    var Timeout;
    var cleared = false;
    var active = [];
    var autoCloseTimeOut; // added by Meenakshi Pasrija on 23rd July

    // Function to track total number of active SetTimeout functions are active
    function Timeout(fn, interval) {
        active.push(1);
        var id = setTimeout(function() {
            fn();
            active.pop(); // remove from array once function is finished.
          },interval);
    }

    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                is_typing = true;
                $('.notification_wrapper').find('p').show();
                var $message,
                    time_step = 400;
                $message = $($('.message_template').clone().html());
                if (_this.message_side === 'right') {
                    $message.find('p.error').remove();
                    time_step = 0;
                }
                $message.addClass('appeared');
                $message.addClass(_this.message_side).find('.text').html(_this.text);

                // calculate height of element to be inserted.
                var el_height = $message.outerHeight(true);
                $('.messages').append($message);
                var t = new Timeout(function () {
                    $message.find('p.error').remove();
                    $message.addClass('ecl_show');
                    $('.notification_wrapper').find('p').hide();
                }, time_step);
                $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 100);
            };
        }(this);
        return this;
    };
	var Payload;
	Payload = function (arg) {
		this.text = arg.text, this.message_side = arg.message_side;
		this.draw = function (_this) {
			return function () {
			    var time_step = 110;
			    is_typing = true;
				var $message;;
				$message = $($('.message_template').clone().html());
				$message.find('.avatar').html('');
				$message.addClass(_this.message_side).html(_this.text);
				$('.messages').append($message);
				var t = new Timeout(function () {
					$message.addClass('appeared');
					$message.addClass('ecl_show');
				}, time_step);
				$('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 10);
			};
		}(this);
		return this;
	};

	function isValidEmailAddress(emailAddress) {
		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		return pattern.test(emailAddress);
	}

	var random_id = Math.floor(Math.random() * 190020);
	function get_random_id() {
	    return Math.floor(Math.random() * 190020);
	}
	var last_message = '';
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val().trim();
        };
        sendMessage = function (text, message_side='right', message_type='text') {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
			if (message_type === 'text') {
				message = new Message({
					text: text,
					message_side: message_side
				});
			}
			else {
				message = new Payload({
					text: text,
					message_side: message_side
				});
			}
            message.draw();
        };
		
		botReply = function (sender_id, text, data) {

            text = text.trim();
            if (text == '') return;
			var request = $.ajax({
			  url: chat_bot_url,
			  type: "POST",
			  data: JSON.stringify({sender: sender_id, message: text, resume_data: data}),
			  contentType : "application/json", 
			  dataType: "json"
			});
			request.done(function(response) {
			debugger;
		      var prev_msg = null;
		      var delay = 100; // 4100
		      var ms = 300;
			  response.forEach(function(item, index, arr) {
			    is_typing = true;
				var bot_msg = last_message = item.text;

				// Check if bot message has name of HR
				// <span class='hr_name'>([A-Za-z]+)<\/span>
				var hr_name_regx = /<span class='hr_name'>([A-Za-z]+ ?[A-Za-z]+)<\/span>/g;
                var match = hr_name_regx.exec(bot_msg);
                if (hr_name === '') $('p.error').html('UMKC Roo Foundation is typing...');
                if (hr_name == '' && match != null && match.length > 0) {
                    hr_name = match[1];
                    console.log(hr_name);
//                    $('p.error').html('Tia is typing...');
                }

                // Extract User name
                var user_name_regx = /Thanks (<b class='bot_upper'>[A-Za-z]+<\/b>),/g;
                var match = user_name_regx.exec(bot_msg);
                if (user_name == '' && match != null && match.length > 0) {
                    user_name = match[1];
                    console.log(user_name);
                }

				var payload = item.data;
                if (bot_msg.indexOf(str_upload_resume) !== -1) {
                    var t = new Timeout(function () {
                        var upload_div = '<div class="payload_wrapper">';
                        upload_div +='<div class="image-upload">';
                        upload_div += '<label for="filePoster">';
                        upload_div += '<img src="images/attachment.svg" style="pointer-events: none"/>'+btn_upload_cv+'</label>';
                        upload_div += '<form action="" method="POST" enctype="multipart/form-data">';
                        upload_div += '<input type="file" id="filePoster" name="userFile">';
                        upload_div += '<input type="submit" id="btn">';
                        upload_div += '</form>';
                        upload_div += '</div>';
                        upload_div += '<span data-value="pressed no">'+btn_dont_upload_cv+'</span>';
                        upload_div += '</div>';
                        upload_div += '</div>';
                        sendMessage(upload_div, message_side='left', message_type='payload');
                    }, 3000);

                    var t = new Timeout(function () {
                        sendMessage(bot_msg, message_side='right');
                        prev_msg = bot_msg;
                    }, ms);
                    // Disable the input box if there is payload from the server.
                    $('.message_input').prop('disabled', true);
                    $('.message_input_wrapper').css('background', '#ebebe4');
                    return;
                }
				var t = new Timeout(function () {
					sendMessage(bot_msg, message_side='right');
					prev_msg = bot_msg;
				}, ms);

                ms = ms + delay;
				var t = new Timeout(function () {
					if (payload !== undefined) {

					    // Disable the input box if there is payload from the server.
                        $('.message_input').prop('disabled', true);
                        $('.message_input_wrapper').css('background', '#ebebe4');

						var answers = "<div class='payload_wrapper'>";
						payload.forEach(function(pItem) {
						    if ($.inArray(pItem.payload, ["Financial Markets", "Technology Services", "Digital", "Customer Operations", "CLX"]) != -1){
							    answers += "<div class='payload_' data-value='" +pItem.payload + "'><span data-value='" +pItem.payload + "' data-type='" +pItem.title+ "'>" + pItem.title + "</span><p style='' class='verticals_know_more' data-link='"+ vertical_links[pItem.payload.toLowerCase()] +"' target='_blank'>Click to know more</p></div>";
						    } else {
							    answers += "<span data-value='" +pItem.payload + "' data-type='" +pItem.title+ "'>" + pItem.title + "</span>";
						    }
						});
						answers += "</div>";

						sendMessage(answers, message_side='left', message_type='payload');
					} else {
					    // Enable the input box.
                        $('.message_input').prop('disabled', false);
                        $('.message_input_wrapper').css('background', '#fff');
					}

				}, ms);

				// Close the chat automatically after 30 seconds.
				$.each(thank_msg, function(i,v) {
                    var match = bot_msg.toLowerCase().indexOf(v.toLowerCase());
                    if(match > -1) {

                        var new_match = bot_msg.toLowerCase().indexOf("there is some problem while saving your details");
                        if (new_match > -1) {
                            thanks_msg_end = thanks_msg_end2
                        }

                        setTimeout(function() {
                            sendMessage(thanks_msg_end, 'right');
                            $('.message_input_wrapper').find('.message_input').attr('disabled', 'disabled');
                        $('.message_input_wrapper').css('background', '#ebebe4');
                        }, 1000);

						// updated by Meenakshi Pasrija on 23rd July
                        autoCloseTimeOut = setTimeout(function () {
                            $(".chat-box-toggle").trigger('click');
                            $('.message_input_wrapper').find('.message_input').attr('disabled', 'disabled');
                            $('.message_input_wrapper').css('background', '#ebebe4');
                            $('.chat-bg .messages').empty();
                        }, timeout_auto_close_chat);

                        return;
                    };
                });

			  });

			   if (last_message !== '' && last_message.indexOf(str_qualities_skills) !== -1 ) {
                  enableSkills();
			   }
			});

			request.fail(function(jqXHR, textStatus) {
			    if (text == trigger_bot_text) {
                    if (attempts <= max_attempts) {
                        random_id = get_random_id();
                        console.log('uuid', random_id);
                        var t = new Timeout(function () {
                            botReply(random_id, trigger_bot_text);
                        }, 1000);
                        is_initialized = false;
                        attempts +=1;
                    } else {
                      sendMessage(str_error_msg, 'right');
                    }
                } else {
                  sendMessage(str_error_msg, 'right');
                }

			});
		};

		handleInput = function () {
			var user_input = getMessageText();
			// Check for blank spaces
			if (!user_input.replace(/\s/g, '').length){ return false;}
			if (last_message !== '' && last_message.indexOf(str_name) !== -1 ) {
				if( !isNaN(user_input) ) {
				    var name_msg = valid_name;
				    sendMessage(user_input, message_side='left');
				    sendMessage(name_msg, message_side='right');
					return;
				}
			}
//			else if (last_message !== '' && last_message.indexOf(str_email_id) !== -1 ) {
//				if( !isValidEmailAddress(user_input) ) {
//				    var email_msg = valid_email_id;
//				    sendMessage(user_input, message_side='left');
//				    sendMessage(email_msg, message_side='right');
//					return;
//				}
//			} else if (last_message !== '' && last_message.toLowerCase().indexOf(str_phone) !== -1 ) {
//                var pat = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
//
//                if (!pat.test(user_input)) {
//                    var phone_msg = valid_phone_number;
//				    sendMessage(user_input, message_side='left');
//				    sendMessage(phone_msg, message_side='right');
//				    return;
//                }
//			}
			
			sendMessage(user_input, message_side='left');
			botReply(random_id, user_input);
		};

//        window.setInterval(function(){
//          botReply(random_id, 'ping');
//        }, 5000);

        $('.send_message').click(function (e) {
			handleInput()
        });

        $(document).on('click', '.verticals_know_more', function (e){
            window.open(
              $(this).data('link'),
              '_blank' // <- This is what makes it open in a new window.
            );
        });

        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                if (active.length > 0 || $.active != 0) return;
                handleInput();
            }
        });

        // Display typing message while ajax request is being processed.
        var timer;
        $(document).ajaxStart( function () {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                var $wait_msg = $($('.message_template').clone().html());
                $wait_msg.addClass('appeared wait_msg');
                $wait_msg.addClass('left');
                $('p.error').show();
                $('.messages').append($wait_msg);
                $('.messages').animate({ scrollTop: $('.messages').prop('scrollHeight') }, 1000);
            }, ajax_timeout);
        }).ajaxStop( function () {
            clearTimeout(timer);
            $('.wait_msg').hide();
        });
		
		$(document).on('click', '.messages .payload_wrapper span', function (e) {
			var bot_value = $(this).data('value');
			var user_value = $(this).text();
			$(this).parent().parent().remove();
			sendMessage(user_value, message_side='left');
			botReply(random_id, bot_value);
        });

        $(document).on('change', '#filePoster', function() {

            var img, reader, file;

            var formdata = false;
            if (window.FormData) {
              formdata = new FormData();
            }

            var i = 0, len = this.files.length;
            for ( ; i < len; i++ ) {
              file = this.files[i];
            }

            // Only doc, docx and pdf file format is supported
            var ext = file['name'].split('.').pop();
            if(ext !== "pdf" && ext !== "docx" && ext !== "doc"){
                sendMessage(valid_upload_cv, message_side='left');
                return;
            }

            if ( window.FileReader ) {
              reader = new FileReader();
              reader.readAsDataURL(file);
            }
            if (formdata) {
              formdata.append("file", file);
            }

            // Notify user and disable upload and rather not buttons while upload is in progress.
//            sendMessage(str_wait_upload_cv, message_side='right');
            $('.payload_wrapper').addClass("disabled");

            $.ajax({
               url: upload_file_url,
               type: 'POST',
               data: formdata,
               cache: false,
               contentType: false,
               enctype: 'multipart/form-data',
               processData: false,
               success: function (resp) {
//                 if(false) {
                if (resp['IsCompleted'] === true) {
                    var resume_name = resp['FileName'].replace(/ /g,"_");
                    var statement = 'Resume ' + resume_name + ' with doc id ' + resp['DocId'] + ' is uploaded successfully';
                    sendMessage("Thanks " + user_name + str_resume_success, message_side='right');
                    var t = new Timeout(function() {
                        botReply(random_id, statement, resp);
                    }, 1000);
                    $('.image-upload').hide();
                    $('.image-upload').next().remove();
                }
//                else {
                else if(resp['IsCompleted'] === false || resp.hasOwnProperty('error')) {
                    // Resume not uploaded, increase count
                    if (!resume_count.hasOwnProperty(random_id)) {
                        resume_count[random_id] = 1;
                    } else {
                        resume_count[random_id] ++;
                    }
                    if (resume_count[random_id] == 3) {
                      // bot will message
                      sendMessage(str_new_upload_error, message_side='right');
                      sendMessage(thanks_msg_end, message_side='right');
                      $('.payload_wrapper').addClass("disabled");
                    }
                    else {
                        sendMessage(str_upload_cv_error, message_side='right');
                        $('.payload_wrapper').removeClass("disabled");
                    }
                }
                $('#filePoster').val('');
               },
               error: function(resp) {
                 // error response - look at 'result' object
                 console.log(resp);
                 sendMessage(str_upload_cv_error, message_side='right');
                 $('.payload_wrapper').removeClass("disabled");
                 $('#filePoster').val('');
                 return;
               }
           });
        });

        enableSkills = function() {
            $tag_instance = $('.message_input_wrapper .message_input').tagit({
                availableTags: all_tags,
                allowSpaces: true,
                allowDuplicates: false,
                placeholderText: placeholder_skills,
//                autocomplete: ({
//                      source: function(request, response) {
//                          $.ajax({
//                              url: autocomplete_url,
//                              data: JSON.stringify({
//                                    prefixText: request.term,
//                                    count:1,
//                                    contextKey: request.term
//                                }),
//                              contentType: "application/json; charset=utf-8",
//                              type: 'POST',
//                              success: function(data) {
//                                  response($.map(data['d'], function(item) {
//                                      return {
//                                          label: item,
//                                          value: item
//                                      }
//                                  	})
//                                  );
//                          },
//                          error: function(request, status, error) {
//                              console.log(str_fetch_skill_error);
//                          }
//                        });
//                    },
//                    minLength: 2,
//                })
            });

            // Process tags when enter key is pressed.
            $('.tagit-new .ui-widget-content').keydown(function(event) {
                if (event.which == $.ui.keyCode.ENTER) {
                    var selected_skills = '';
                    var $tags = $(this).parent().parent().find('li.tagit-choice');
                    if ($tags !== undefined && $tags.length !== 0) {
                        $tags.each(function(idx, item) {
                            var tag = $(item).find('span.tagit-label').text();
                            selected_skills = selected_skills + tag + ', ';
                        });
                        selected_skills = selected_skills.replace(/,\s*$/, "");
                        sendMessage(selected_skills, message_side='left');
                        botReply(random_id, selected_skills.replace(/,+/g, ";"));

                        // Remove all tags
                         $($tag_instance).tagit("destroy");
                        $('.message_input_wrapper').find('ul').remove();
                        $('.message_input_wrapper').find('.message_input').removeClass('tagit-hidden-field');
                    }
                }
            });
        };

        // Open chat box when user click the chat balloon
        var is_initialized = true;
        $("#chat-circle").click(function() {
            $("#chat-circle").toggle('fade');
            $(".chat-box").toggle('fade');

            if($(this).css('display') == 'block' && is_initialized == true) {
                random_id = get_random_id();
                console.log('uuid', random_id);
                var t = new Timeout(function () {
                    botReply(random_id, trigger_bot_text);
                }, 500);
                $('.message_input_wrapper').find('.message_input').removeAttr('disabled');
                $('.message_input_wrapper').css('background', '#fff');
                is_initialized = false;
            }
        });

        $(".chat-box-toggle").click(function() {

//            if (confirm('Are you sure you want to close the chat?')) {
//                console.log('yes');
//            } else {
//                return false;
//            }

            clearTimeout(autoCloseTimeOut); // added by Meenakshi on 23rd
            $("#chat-circle").toggle('fade');
            $(".chat-box").toggle('fade');
            is_initialized = true; // added by Meenakshi on 23rd July
            setTimeout(function(){

                // Clear the chat
                hr_name = user_name = '';
                $('.chat-bg .messages').empty();
                try {
                    $($tag_instance).tagit("destroy");
                    $('.message_input_wrapper').find('ul').remove();
                    $('.message_input_wrapper').find('.message_input').removeClass('tagit-hidden-field');
                    $('.message_input_wrapper').find('.message_input').removeAttr('disabled'); // added by Meenakshi on 23rd July
                } catch(err) {
                    console.log('trying to delete the element which is not initialized yet.');
                }
                //is_initialized = true; commented by Meenakshi on 23rd July
            }, 2500);
        });

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });
    });

}.call(this));
//$(function() {
//    document.onload($("#chat-circle").click());
//})

$(document).ready(function(){
  $("#chat-circle").click( );
});