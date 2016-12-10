var socket;
var cnv;
var start=false;
var canvasCreated=0;
var connected=false;
var myNick;
var myTurn=false;
var playerNames=[];
//var canStartGame=false;


function ConnectServer(){
  connected=true;
  socket=io.connect();
  setupRead();
  SendNickName();
  document.getElementById("waitForPlayers").style.display = 'block';

  $( "#nicknameDiv" ).toggle( "fade" );

  //document.getElementById("nicknameDiv").style.display = 'none';
}


function setupRead(){
  if (connected==true){
    console.log(connected);
    socket.on('mouse',newDrawing);
    socket.on('canStart',StartGame);
    socket.on('playerConnected',GetPlayers);
    socket.on('turnToPlayer',checkTurn)
    socket.on('listPlayers',setPlayerList);
  }
}

function checkTurn(turn){
if (turn==myNick){
  myTurn=true;
}
}


function SendNickName(){
  var nickname=document.getElementById("MyNickname").value;
  socket.emit('nicknameId',nickname);
  myNick=nickname;
}

function setup() {

}
function newDrawing(data){
  noStroke();
  fill(255,0,100);
  ellipse(data.x,data.y,32,32);

}

function setPlayerList(nickNames){
  var list;
  playerNames=nickNames;
  list="<h4>";
  for (var i = 0; i < nickNames.length; i++) {
    list+=playerNames[i]+"<br>";
  }
  document.getElementById('players').innerHTML=list;
}

function StartGame(canStartGame){

console.log("All players connected. The game can start: "+canStartGame);
start=true;


}

function GetPlayers(connectedPlayers){
  console.log("should work");

}


function draw(){
  if (start==true){
    drawCanvas();
}


function drawCanvas(){
  while (canvasCreated<=1){
  cnv=createCanvas(800,500);
  cnv.position((windowWidth-width)/2,(windowHeight-height)/2);
  background(255);
  canvasCreated++;
  document.getElementById("SendBar").style.display = 'block';
  document.getElementById("waitForPlayers").style.display = 'none';
  document.getElementById("nicknameDiv").style.display = 'none';
  document.getElementById("scores").style.display = 'block';

}
}


if (start && myTurn){
    if (mouseIsPressed){
      noStroke();
      fill(0);
    ellipse(mouseX,mouseY,32,32);
    var data={
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse',data);
  }
}

}

function SendGuess(){
  console.log("Sending word...");
  var guessedWord=document.getElementById("SubmitWord").value;
  socket.emit('checkAnswer',guessedWord);
}
