io = io.connect('/');

var nbPlayer = 0;

var path;
var layer = project.activeLayer;
var connect = false;
var game = false;
var isMaster = false;
var compteurMessage = 0;

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 2;
tool.minDistance = 10;
tool.maxDistance = 45;


/*
function onMouseDown(event) {
	if (path) {
		path.selected = false;
	};
	path = new Path();
	path.strokeColor = 'black';
	path.strokeWidth = 10;
	path.fullySelected = false;
}

function onMouseDrag(event) {
	path.add(event.point);
}

function onMouseUp(event) {
	path.selected = false;
	Segment(path);
	path.simplify();
	//path.smooth();
}*/

var path;

function onMouseDown(event) {
	if(!isMaster)
		return false;
	path = new Path();
	path.fillColor = {
		hue: Math.random() * 360,
		saturation: 1,
		brightness: 1
	};
	//path.fullySelected = true;
	path.add(event.point);
}

function onMouseDrag(event) {
	if(!isMaster)
		return false;
	var step = event.delta / 2;
	step.angle += 90;
	
	var top = event.middlePoint + step;
	var bottom = event.middlePoint - step;
	
	path.add(top);
	path.insert(0, bottom);
	path.smooth();
}

function onMouseUp(event) {
	if(!isMaster)
		return false;
	path.add(event.point);
	path.closed = true;
	path.smooth();
	io.emit('paintAdd', { point: path } );
}

function onResize(event) {
}

function clear(){
	for(var i = layer.children.length-1;i>-1;i--)
		layer.children[i].remove();
	view.update();
}

function afterClear(){
	if(layer.children.length > 0)
		layer.lastChild.remove();
	view.update();
}



var timeDecompte = function(time){
	var m_time = time * 1000;
	var dateFin = 0;
	var play = false;

	this.reload = function(){
		if(play){
			var date = new Date();
			var timeReste = dateFin - date.getTime();
			if(timeReste<0)
				timeReste = 0;
			m_time = timeReste;	
		}
	}

	this.getTime = function(){
		this.reload();
		return m_time/1000;
	};
	
	this.setTime = function(time){
		m_time = time * 1000;
		dateFin = time * 1000;
	};

	this.play = function(){
		var date = new Date();
		play = true;
		dateFin = date.getTime() + m_time;
		return m_time;
	};

	this.pause = function(){
		play = false;
	};

	return "time";
};





/**********************************************
 *
 *
 * RESEAU MULTIJOUEUR 
 */

io.on('paintAdd', function (data) {
	//console.log(data);
	var path = new Path({
		segments: data.point[1].segments,
		fillColor: data.point[1].fillColor,
		closed:true
	});
	path.smooth();
	view.update();
});

io.on('paintClear', function () {
	clear();
	view.update();
});

io.on('paintAfterClear', function () {
	afterClear();
	view.update();
});

/**********************************************
 *
 *
 * Affichage
 */
 $(function(){
	$("#reMove").on( "click", function( event ) {
		if(!isMaster)
			return false;
		io.emit('paintAfterClear', { point: path } );
		afterClear();
	});
	/*all clear*/
	$("#reClear").on( "click", function( event ) {
		if(!isMaster)
			return false;
		io.emit('paintClear', { point: path } );
	  	clear();
	});

	$("#Message").on( "click", function( event ) {
		$("#Message-block").show();
		$("#User-block").hide();
	});

	$("#User").on( "click", function( event ) {
		$("#User-block").show();
		$("#Message-block").hide();
	});

	$(document).keydown(function(e){
		if( e.which === 90 && e.ctrlKey ){
			io.emit('paintAfterClear', { point: path } );
	        afterClear();
	    }          
	}); 

	$("#connection-submit").click(function(event) {
		if($("#connection-pseudo").val() != ""){
			var user = {
				pseudo : $("#connection-pseudo").val()
			};
			io.emit('login', user);
		}
	});

	//GESTION DES MESSAGE
	$('#Tchatform').submit(function(event){	
		event.preventDefault();
		io.emit('message', {message: $('#message').val()} );
		$('#message').val('');
		return false;
	});

	//GESTION DES Mot
	$('#FromMot').submit(function(event){	
		event.preventDefault();
		io.emit('testMot', $('#mot').val());
		$('#mot').val('');
		return false;
	});

	/* MESSAGE SERVEUR */
	io.on('loginOK', function () {
		connect = true;
		$("#connection").hide();
	});

	io.on('newPlayer', function (data) {
		nbPlayer++;
		$("#User-block").append('<p id="'+ data.id +'">'+data.pseudo+' <span>0</span> </p>');
		$("#" + data.id).css('background-color', 'rgb('+data.color.R+','+data.color.G+','+data.color.B+')');
		$("#time2").text(nbPlayer + " utilisateur");
	});

	io.on('deletePlayer', function (data) {
		$("#" + data.id).remove();
		nbPlayer--;
		$("#time2").text(nbPlayer + " utilisateur");
	});

	io.on('message', function (data) {
		$("#Message-block-message").prepend('<p><span class="pseudo"> ' + data.pseudo + " : </span>" + data.message + "</p>");
		++compteurMessage;
		if(compteurMessage>200)
		{
			$('#Message-block-message p:last').remove();
			--compteurMessage;
		}
	});

	io.on('infoMot', function (data) {
		infoMessage(data);
	});

	io.on('infoMotGagnier', function (data){
		infoMessage(data.pseudo + " " + data.message);
		$("#"+data.id+" span").text( 1 + parseInt($("#"+data.id+" span").text()));
	});

	var compte = false;
	var time = new timeDecompte(0);
	var boucle;
	
	io.on('timeParti', function (data) {
		if(compte || data <= 0)
			return false;
		compte = true;
		time.setTime(data);
		time.play();
		boucle = setInterval((function(){
			$("#time").text(getTimeFormat(time.getTime()));
		    if(time.getTime() <= 0){
		    	compte = false;
		    	infoMessage("Parti  Fini");
		        clearInterval(boucle);
		    }
		}),100);
	});

	io.on('isPlayer', function (message) {
		isMaster = true;
		infoMessage("C'est a toi de deviner faire deviner le mot: (aller go go go)");
		$("#isPlayer").css('display', 'inline-block');
		$("#isPlayerMot").text(message);
	});

	io.on('finPartie', function () {
		isMaster = false;
		clearInterval(boucle);
		compte = false;
		$("#isPlayer").hide();
		$("#isPlayerMot").text("");
		$("#time").text("00:00");
	});



var timer = function(time){};

function getTimeFormat(nombre){
	nombre = nombre;
	var heure = nombre / 60;
	var minute = nombre % 60;

	heure =  parseInt(heure);
	minute = parseInt(minute);
	if(heure < 10)
		heure = "0" + Math.floor(heure);
	if(minute < 10)
		minute = "0" + Math.floor(minute);

	return heure + ":" + minute;
}

function heure(){
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	var t = "am";
	if(h>=12) t = "pm";
	if(h>12) h%=12;
	if(m<10) m="0" + m;
	return (h + ":" + m + t + " ");
}

	function infoMessage(message){
		if(connect){
			$(".message").text(message);
			$("#message-info").show();
			$("#background-message-info").show();
		}
	}

	$("#boutton-ok").click(function(event) {
		$("#message-info").hide();
		$("#background-message-info").hide();
	});

});