var express = require('express');
var app = express();
var http = require('http').Server(app);
var io=require('socket.io')(http);
var port = process.env.PORT || 3000;
app.use(express.static('public'));
app.get('/',function (req,res){
    res.sendFile(__dirname+'/public/index.html');
});

http.listen(port, function(){
  console.log("Server running on port "+port);
});

var connectedPlayers=0;
io.sockets.on("connection",newConnection);

//// Game Variables
var canStartGame=false;
var selWord;
var turn;
var nickNames=[];
////

function newConnection(socket){
connectedPlayers +=1;
socket.on('nicknameId',setNickname);
console.log("New Connection " + socket.id);
console.log("Players Connected: " + connectedPlayers);
socket.on('checkAnswer',CheckAnswer);
socket.on('mouse',mouseMsg);
socket.on("disconnect",disconnectedClient);
io.sockets.emit("playerConnected",connectedPlayers);
if (connectedPlayers==2){
  canStartGame=true;
  console.log("Send Message:" + canStartGame);
  io.sockets.emit('canStart', canStartGame);
  SelectWord();
  turnToPlayer=Math.floor(Math.random()*2);
  ChangePlayerTurn();
}

function setNickname(nickname1){
  socket.nickname=nickname1;
  console.log(socket.nickname);
  nickNames.push(socket.nickname);
  io.sockets.emit('listPlayers',nickNames);

}

function ChangePlayerTurn(){

turn=nickNames[0];
io.sockets.emit('turnToPlayer',turn);
  console.log("Turn: "+ turn);
}



function disconnectedClient(){
  connectedPlayers-=1;
  console.log("Someone has disconnected");
  nickNames.splice(nickNames.indexOf(socket.nickname), 1);
}



function SelectWord(){
  var words={"word":["perro","gato","caballo"]}
  selWord=words.word[Math.floor(Math.random()*3)];
  console.log(selWord);
}

function CheckAnswer(guessedword){
  console.log("checking answer...");
  console.log("The player typed:"+guessedword);
if (selWord==guessedword){
  console.log("correct!");
}
}

function connectedToServer(){

}


function mouseMsg(data){
  //console.log(data);
  socket.broadcast.emit('mouse',data);
}



}
