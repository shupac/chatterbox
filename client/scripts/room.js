var Room = Backbone.Model.extend({
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
    this.set('roomname', this.escapeString(this.get('roomname')));
  }
});

var RoomView = Backbone.View.extend({
  tagName: 'li',
  render: function() {
    this.$el.html('<a href="#" class="roomLink">' + this.model.get('roomname')+ '</a>');
  }
});

var Rooms = Backbone.Collection.extend({
  model: Room,
  uniqueRooms: {},
  removeDups: function() {
    for(var i = 0; i < this.length; i++) {
      var room = this.at(i);
      // debugger;
      if(this.uniqueRooms[room.get('roomname')]) {
        this.remove(room);
        i--;
      }
      else this.uniqueRooms[room.get('roomname')] = true;
    }
  }
});

var RoomsView = Backbone.View.extend({
  render: function(){
    this.collection.forEach(this.addOne, this);
  },
  addOne: function(room){
    var roomView = new RoomView ({model: room});
    roomView.render();
    this.$el.append(roomView.el);
  },
  events: {
    
  }
});

var roomsCollection = new Rooms();
var roomsView = new RoomsView({collection: roomsCollection});