var _count = 0;
var _countConnect = 0;

exports.count = _count;

function Players(socket){

	//Atribut
	var _id = null;
	var _pseudo = null;
	var _connect = false;
	var _socket = socket;

	var _color = {};

	//Action constucteur
	_count++;

	this.connect = function(pseudo){
		if(_connect)
			return false;
		_id = pseudo;
		_pseudo = pseudo;
		_connect = true;
		_color = {
			R: Math.floor(Math.random()*256),
			G: Math.floor(Math.random()*(256-30)),
			B: Math.floor(Math.random()*256)
		};

		_countConnect++;

		return true;
	};


	// Get Set
	this.getConnect = function(){ return _connect; };
	this.getPseudo  = function(){ return _pseudo; };
	this.getId = function(){ return _id; };
	this.getColor = function(){ return _color;};


	this.destructor = function(){
		_count--;
		if(_connect)
			_countConnect--;

		_socket.broadcast.emit('deletePlayer',{ id : _id });
		delete this;
	};

	this.getPlayer = function(socket) {
		socket.emit("newPlayer", {
	        pseudo : _pseudo,
	        id : 	 _id,
	        color : _color
	    });
	};

	console.log("Connecter : " + _count + "\nEn connection :" +_countConnect +" sur ip :"+socket.handshake.address.address+"\n");
	return true;
};

exports.players = Players;