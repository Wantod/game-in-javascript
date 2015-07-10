var express = require('express');
var app = express();

var server = require('http').createServer(app);
var fs = require('fs');
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var io = require('socket.io').listen(server);
var sha = require('sha');
var port = 1225;

app.get(/^\/user\/([0-9]{1,4}).png$/, function (req, res) {

    fs.readFile( __dirname + '/image/' + req.params + '.png', 'utf-8', function(error, content) {
    if(!error){
        res.setHeader('Content-Type', 'image/png');
        res.sendfile(__dirname + '/image/' + req.params + '.png');       
    }else{
        res.setHeader('Content-Type', 'text/plain');
        res.send(404, 'Page introuvable !');
    }
    });
})
.get(/^\/video$/, function (req, res) {

    fs.readFile( __dirname + '/public/youtube.html', 'utf-8', function(error, content) {
    if(!error){
        res.setHeader('Content-Type', 'text/html');
        res.sendfile(__dirname + '/public/youtube.html');       
    }else{
        res.setHeader('Content-Type', 'text/plain');
        res.send(404, 'Page introuvable !');
    }
    });
})
.use(express.static(__dirname + '/public'))      // Dossier "Public" accesible par tous
.use(function(req, res, next){                      // Erreur 404
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

server.listen(port); // ON OUVRE LE SERVER
console.log("Port :" + port);

/************************************\
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓╔══╦══╗║ ║ ╔═══╦═══ ═╦═╦══╗ ▓▓▓▓▓
▓▓▓▓▓╚═╗║  ║╠═  ╠══ ║     ║ ║  ║ ▓▓▓▓▓
▓▓▓▓▓══╝╚══╝║ ║ ╚══ ║  . ═╩═╚══╝ ▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
\************************************/


//io.set('log level', 1); // desactivé le debug

// Delete this row if you want to see debug messages
io.set('log level', 1);

var chaine = require("./src/mot");

var timeDecompte = require("./src/Time").timeDecompte;
var timeGameLast = new timeDecompte(350); // 350
var id_player = 0;
var mot = "";

var game = false;
/* Gestion Personnage */
var Players = require('./src/Players2');
var players = {};
var playerAFK = true;

var boucle;
function jeux(){
    if(game)
        return true;
    timeGameLast.setTime(120); // 360
    do{
        var id = Math.floor(Math.random() * (Players.countConnect()) );
        var key = getKeyPlayers(id);
        id_player = key;
    }while(key == null)

    //INITIALISER
    game = true;
    playerAFK = true;
    mot = chaine.getMot();

    players[key].emit("isPlayer", mot);
    console.log("Le mot est : " + mot + "\t" +players[key].getPseudo() + " is Master");

    timeGameLast.play();
    io.sockets.emit('timeParti', timeGameLast.getTime());

    boucle = setInterval((function(){
        if(playerAFK && timeGameLast.getTime() <= 100)
            FinJeux();
        if(timeGameLast.getTime()<=0){
            FinJeux();
        }
    }),100);
}

function getKeyPlayers(id){
    var i = 0;
    for(var key in players){
        if(i == id)
            return key;
        i++;
    }
}

function FinJeux(){
    io.sockets.emit('finPartie');
    io.sockets.emit('paintClear');
    clearInterval(boucle);
    game = false;
    id_player = 0;
    timeGameLast.setTime(0);

    if(!game && Players.countConnect() > 1)
        jeux();
}



io.sockets.on('connection', function (socket) {

    if(game)
        socket.emit('timeParti', timeGameLast.getTime());
    
    var player = new Players.players(socket);

    for (var key in players) {
        players[key].getPlayer(socket);
    }

    socket.on('login', function(user){
        if(players[user.pseudo] != null || !/^[a-zA-Z0-9-]{1,15}$/.test(user.pseudo))
            return false;
        user.pseudo = ent.encode(user.pseudo);
        if(player.connect(user.pseudo)){
            player.getPlayer(io.sockets);
            players[player.getId()] = player;
            socket.emit('loginOK');

            if(!game && Players.countConnect() > 1)
                jeux();
        }

    });

    socket.on('disconnect', function(){
        if(player.getConnect()){
            if(player.getId() == id_player){
                console.log("relancer : " +player.getId() + ":"+id_player );
                FinJeux();
            }
            delete players[player.getPseudo()];
        }
        delete player.destructor();
    });

    /* Dessin*/
    socket.on('paintAdd', function(data){
        if(player.getId() == id_player){
            playerAFK = false;
            socket.broadcast.emit('paintAdd', data);
        }
    });

    socket.on('paintAfterClear', function(){
        if(player.getId() == id_player)
           socket.broadcast.emit('paintAfterClear');
    });

    socket.on('paintClear', function(){
        if(player.getId() == id_player){}
           socket.broadcast.emit('paintClear');
    });

    socket.on('message', function(data){
        if(data.message != "" && player.getConnect())
           io.sockets.emit('message', {
                pseudo : player.getPseudo(),
                message : ent.encode(data.message)
           });
    });

    socket.on('testMot', function(data){
        if(game && player.getConnect() && player.getId() != id_player){
            if(chaine.formateChaine(mot) == chaine.formateChaine(ent.encode(data))){
                //Code pour lesser que 10 seconde
                socket.emit("infoMotGagnier",{ message : "tu as gagnier", pseudo : player.getPseudo(), id : player.getId() });
                socket.broadcast.emit('infoMotGagnier', { message : "a trouver le mot MOUHAHAHAHAHA", pseudo : player.getPseudo(), id : player.getId()});
                FinJeux();
            }else
                socket.emit('infoMot', "rater :)");
        }
    });

});












/*var ListeMot = [
];*/