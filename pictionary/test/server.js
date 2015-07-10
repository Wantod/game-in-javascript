var app = require('express')();
var http = require('http');
var server = require('http').createServer(app);

var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
var fs = require('fs');



// Chargement de la page index.html
var server = http.createServer(function(req, res) {
   fs.readFile( __dirname +'/index.html', 'utf-8', function(error, content) {
    if(!error){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);        
    }else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("Erreur 404");
    }


    });
});

server.listen(2995);

var io = require('socket.io').listen(server); // desactiver le debug : { log: false }
io.set('log level', 1); // desactivé le debug

var users = 0;

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    ++users;
    console.log(users + " connecters");

    /* Nouvelle personne*/
    socket.on('newUser', function(pseudo) {
        if(pseudo != null){
            console.log("Connection ... ");
            pseudo = ent.encode(pseudo);
            socket.set('pseudo', pseudo);
            io.sockets.emit('newUser', pseudo);
        }
    });

    /* Personne qui quite le Site */
    socket.on('disconnect', function(){
           --users;
           console.log(users + " connecters");
    });    

});


/*
server.on('close', function() { // Si le serveur est quiter
    console.log('Bye bye !');
})

server.close(); // On quite le serveur
*/