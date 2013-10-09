var useURL = 'https://api.parse.com/1/classes/chatterbox';

var MessageItem = Backbone.Model.extend({
  initialize: function() {
    this.parse();
  },
  escapeString: function(string) {
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
    return "";
  },
  parse: function() {
    this.set('username', this.escapeString(this.get('username')));
    this.set('text', this.escapeString(this.get('text')));
  }
});

var MessageView = Backbone.View.extend({
  tagName: 'li',
  template: _.template('<%= username %> : <%= text %>'),
  render: function() {
    var attributes = this.model.attributes;
    this.$el.html(this.template(attributes));
  }
});

var ChatMessages = Backbone.Collection.extend({
  model: MessageItem
});

var ChatMsgsView = Backbone.View.extend({
  render: function() {
    this.collection.forEach(this.addOne, this);
  },
  addOne: function(messageItem) {
    var messageView = new MessageView({ model: messageItem});
    messageView.render();
    this.$el.append(messageView.el);
  }
});




// var UserView = Backbone.View.extend({
//   tagName: 'li',
//   events: {
//     'click a': 'toggleFriend'
//   },
//   toggleFriend: function() {
//     this.model.toggleFriend();
//   },
//   template: _.template('<a href="#"><%= username %></a> <span>*</span>'),
//   render: function() {
//     var attributes = this.model.toJSON();
//     this.$el.html(this.template(attributes));
//   }

// });

var retrieve = function(room) {
  $.ajax({
    url : useURL,
    type : 'GET',
    data : {
      order: "-createdAt",
      limit: 50
    },
    success : function(data) {
      chatMessages.reset(data.results);
      chatMsgsView.render();
      roomsCollection.reset(data.results);
      roomsCollection.removeDups();
      roomsView.render();
      $('.chatMsgs').append(chatMsgsView.el);
      $('.rooms').append(roomsView.el);

    }
  });
};

  var chatMessages = new ChatMessages();
  var chatMsgsView = new ChatMsgsView({collection: chatMessages});

$(document).ready(function() {
  // $('.chatMsgs').append(chatView.el);
  // $('.users').append(userView.el);
  retrieve();
});

