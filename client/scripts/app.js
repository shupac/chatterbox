// YOUR CODE HERE:
var useURL = 'https://api.parse.com/1/classes/chatterbox';

var _msgResults;
var lastMsgTime = 0;
var filter = 'lobby';

var sendChat = function() {
  var msg = {
    "username": 'Shu',
    "text": $('.msgInput').val(),
    'roomname': filter
  };
  var stringified = JSON.stringify(msg);
  $.ajax({
    url : useURL,
    type : 'POST',
    data : stringified,
    contentType : 'application/json',
    success : function() {
      retrieve();
    }
  });
  $('.msgInput').val('');
};

var retrieve = function(room) {
  $.ajax({
    url : useURL,
    type : 'GET',
    data : {
      order: "-createdAt",
      limit: 200
    },
    success : function(data) {
      _msgResults = data.results;
      displayByRoom(filter);
      buildChatRooms();
    }
  });
};

var buildChatRooms = function() {
  var chatRooms = {};
  $('.rooms').text('');
  for (var i = 0; i < _msgResults.length; i++) {
    var room = _msgResults[i].roomname;
    if (!chatRooms[room]) {
      chatRooms[room] = 1;
      $('.rooms').append('<p><a href="#" class="roomLink">' + escapeString(room) + '</a></p>');
    } else {
      chatRooms[room]++;
    }
  }
  $('a.roomLink').on('click', function(){
    filter = $(this).text();
    displayByRoom( filter );
  });
  return chatRooms;
};

var displayByRoom = function(target) {
  target = target || 'lobby';
  $('ul.chatMsgs').text('');
  var filtered = _(_msgResults).each(function(msgData){
    if (msgData.roomname === target) {
      $('.chatMsgs').prepend('<li>' + escapeString(msgData.username, msgData) + ': ' + escapeString(msgData.text, msgData) + '</li>');
    }
  });
};

var escapeString = function(string, data) {
  if (string !== undefined && string !== null) {
    var returnString = '';
    var specChars = {
     "&": "&amp",
     "<": "&lt",
     ">": "&gt",
     '"': "&quot",
     "'": "&#x27",
     '/': "&#x2F",
     "$": "bling"
    };
    for (var i = 0; i < string.length; i++) {
      if (specChars[ string[i] ] === undefined) {
        returnString += string[i];
      } else {
        returnString += specChars[ string[i] ];
      }
    }
    return returnString;
  }
};

$(document).ready(function() {
  retrieve();
  setInterval(retrieve, 1000);

  $('.msgInput').on('keypress', function(event) {
    if (event.which === 13 && $('.msgInput').val() !== '') {
      sendChat();
    }
  });

});

// $.ajax({
//   url: 'https://api.parse.com/1/users',
//   type: 'GET',
//   success: function(data) {
//     console.log(data);
//   }
// });


// Object
// results: Array[12]
// 0: Object
// createdAt: "2013-10-07T16:22:03.280Z"
// objectId: "teDOY3Rnpe"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T16:22:03.280Z"
// username: "gary"