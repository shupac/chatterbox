var ChatItem = Backbone.Model.extend({});

var chatItem = new ChatItem({
  username: 'Bot',
  text: 'Whatever',
  roomname: 'lobby'
});

var ChatView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    var html = this.model.get('username') + ': ' + this.model.get('text');
    $(this.el).html(html);
  }
});

var chatView = new ChatView({ model: chatItem });

chatView.render();
console.log(chatView.el);

$(document).ready(function() {
  $('.chatMsgs').append(chatView.el);
});