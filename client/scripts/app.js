// YOUR CODE HERE:
var useURL = 'https://api.parse.com/1/classes/chatterbox';

var _msgResults;
var lastMsgTime = 0;
var filter = 'lobby';
var friends = {};
var scrollPosition;


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
  var users = {};
  var chatRooms = {};
  $('.rooms').text('');
  $('.users').text('');
  for (var i = 0; i < _msgResults.length; i++) {
    var room = _msgResults[i].roomname;
    var user = _msgResults[i].username;
    if (!chatRooms[room]) {
      chatRooms[room] = 1;
      $('.rooms').append('<li><a href="#" class="roomLink">' + escapeString(room) + '</a></li>');
    } else {
      chatRooms[room]++;
    }

    if (!users[user]) {
      users[user] = 1;
      var friendDisplay = 'none';
      if(friends[user]) {
        friendDisplay = 'inline';
      }

      $('.users').append('<li><a href="#" class="userLink">' + escapeString(user) + '</a><span class="friend" style="display:'+friendDisplay+'">*</span></li>');
    }
  }
  $('a.roomLink').on('click', function(){
    filter = $(this).text();
    scrollPosition = undefined;
    displayByRoom( filter );
  });
  $('a.userLink').on('click', function(){
    var thisUser = $(this).text();
    friends[thisUser] = !friends[thisUser];
    $(this).parent().find('> .friend').toggle();
    retrieve();
  });
  return chatRooms;
};

var displayByRoom = function(target) {
  target = target || 'lobby';
  $('ul.chatMsgs').text('');
  var filtered = _(_msgResults).each(function(msgData){
    if (msgData.roomname === target) {
      var node = $('<li>' + escapeString(msgData.username, msgData) + ': ' + escapeString(msgData.text, msgData) + '</li>');
      if(friends[msgData.username]) {
        node.addClass('bold');
      }
      $('.chatMsgs').prepend(node);
    }
  });
  if (scrollPosition === undefined) {
    scrollPosition = $('ul.chatMsgs')[0].scrollHeight;
  }
  $('ul.chatMsgs').scrollTop(scrollPosition);
  $('ul.chatMsgs').scroll(function() {
    scrollPosition = $('ul.chatMsgs')[0].scrollTop;
    // console.log(scrollPosition);
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
  setInterval(retrieve, 2000);

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