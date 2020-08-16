var time = 60;
var locksPicked = 0;
var numOfKeys = 0;
var keyLabels = ["key1Label","key2Label","key3Label","key4Label","key5Label","key6Label"];
var possibleKeys = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j",
                    "k","l","z","x","c","v","b","n","m","1","2","3","4","5","6","7","8",
                    "9","0","!","@","#","$","%","^","&","*","(",")"]; //this is bad
var gameWin = false;  // shows the state of the game and changes depending on how gameEnd is called, either via timer ending or by locksPicked == 20
var counter = 0;

onEvent("startGame", "click", newGame);

function newGame(){   //begins the timer and gameplay
  setScreen("transitionScreen");
  setText("timer", time + " seconds...");
  setText("lockCount", "Locks picked: " + locksPicked);
  setTimeout(function() {
    setScreen("gameScreen");
  }, 1000);
  timedLoop(1000, timer);
  gameplay();
}

function timer(){  //timer for the game
    time--;
    setText("timer", time + " seconds...");
    if (time <= 10){  
      //whenever the time is below 10 seconds, change the text to red
      setProperty("timer", "text-color", "red");
    } else { 
      // this code changes the timer text back to white if the player correctly hits some sets of keys to increase the time to over 10 again
      setProperty("timer", "text-color", "white");
    }
    if(time <= 0 || locksPicked == 20) { // when the time reaches 0, interrupt everything and trigger the end screen
    gameEnd();
    stopTimedLoop();
}}

function setKeys(){
    numOfKeys = randomNumber(1,6);
    for (counter = 0; counter < keyLabels.length; counter++){
      hideElement(keyLabels[counter]);
    }
    for (counter = 0; counter < numOfKeys; counter++){
      showElement(keyLabels[counter]);
      setText(keyLabels[counter], possibleKeys[randomNumber(0, possibleKeys.length - 1)]);
    }
}

function gameplay(){ // actual game
  setKeys(); //  initialization of the keys
  checkIfCorrect(); //the heart of the game; checks which keys are shown and if the player hit the correct key
  }

function checkIfCorrect(){
  var currentKeyPlace = 0;
  onEvent("gameScreen", "keypress", function(event){
    if (event.key == getText(keyLabels[currentKeyPlace])){ //if the player's key is the current key...
      setProperty(keyLabels[currentKeyPlace],"background-color","#5a5a5a");
      setProperty("gameScreen", "background-color", "green"); //flash a green screen and
      currentKeyPlace++;                                      //increase the place of the key to check
      setTimeout(function() {
        setProperty("gameScreen", "background-color", "#1d1d1d");
      }, 100);
      if (currentKeyPlace == numOfKeys){ //if the current key is the final key of the set,
        locksPicked++;                  //increase the score.
        if (locksPicked == 20){     //if the score gets to 20,
          gameWin = true;           //set the game state to victory and
          counter = 0;
          currentKeyPlace = 0;
          gameEnd();
          }
        setText("lockCount", "Locks picked: " + locksPicked); //on each set completed that does not end the game,
        for (counter = 0; counter < keyLabels.length; counter++){
          setProperty(keyLabels[counter],"background-color","#0eb490"); //reset the color of each key,
        }
        currentKeyPlace = 0;                                            //reset the key place to start the next set,
        setText("timerUpdate", "+1 second");                            //give the player a second back
        showElement("timerUpdate");                                     //and update the label,
        setTimeout(function() {
          setProperty("gameScreen", "background-color", "#1d1d1d");
          hideElement("timerUpdate");
        }, 350);
        time++;
        setText("timer", time + " seconds...");
        setKeys();                                                      //and finally, display a new, random set of keys
      }
    } else { //if the player's key is not the next key they have to press...
        currentKeyPlace = 0;  //kick them back to the first key,
        for (counter = 0; counter < keyLabels.length; counter++){ //reset the colors of the keys,
          setProperty(keyLabels[counter],"background-color","#0eb490");
        }
        setProperty("gameScreen", "background-color", "red");     //reduce their time by two seconds
        setText("timerUpdate", "-2 seconds");                     //(and update the label),
        showElement("timerUpdate");
        setTimeout(function() {                                   //and flash a red screen
          setProperty("gameScreen", "background-color", "#1d1d1d");
          hideElement("timerUpdate");
        }, 350);
        time -= 2;
        if (time <= 0)
          currentKeyPlace = 0;
        setText("timer", time + " seconds...");
    
    }
    }
  );
  }
  
function gameEnd(){ 
  setScreen("gameOver");
  for (var counter = 0; counter < keyLabels.length; counter++){
    setProperty(keyLabels[counter],"background-color","#0eb490");
  }
  if (gameWin == true){ //if the game state flag is set to true for victory
    setText("gameOverLabel", "You unlocked the door!");
    setText("finalResults", "Who needs 20 locks on their door!?");
    setProperty("tryAgain","height", 100);
    setText("tryAgain", "I think there's another door around here somewhere!");
  } else { //if the flag is set to false for failure
    setText("gameOverLabel", "Your lockpick broke...");
    setText("finalResults", "There were " + (20 - locksPicked) + " locks left!");
    setText("tryAgain", "I think I have a spare!");
    setProperty("tryAgain","height",55);
  }
  onEvent("tryAgain", "click", gameReset); //reinitialize and restart the game
}

function gameReset(){
  time = 60;
  locksPicked = 0;
  setScreen("mainMenu");
  gameWin = false;
}
  
