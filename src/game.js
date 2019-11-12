let CAR_MOVE_TIME = 175// in ms
let CAR_ADD_TIME = 800  // in ms
const FROG_MOVE_INC = 10; // in px
const VEHICLE_MOVE_INC = 10 // in px

 //intervals
let moveCarInterval
let addCarInterval 
let freezeInterval
let countsDownInterval

class Game{

    // handles all key presses (arrows and space bar)
    static keyDownHandler(e) {

        // IF THE GAME IS GOING
        if(!paused){
            if (e.key === "ArrowLeft") {
                Frog.moveFrog("left");
            }
            if (e.key === "ArrowRight") {
                Frog.moveFrog("right");
            }
            if (e.key === "ArrowUp") {
                Frog.moveFrog("up");
            }
            if (e.key === "ArrowDown") {
                Frog.moveFrog("down");
            }
            if (e.keyCode === 32){ // SPACE BAR
                console.log("PAUSING")  
                Game.pause()       
            }
        }else{ // IF THE GAME IS PAUSED
            
            // If User Hits Enter
            if(e.keyCode === 13 ){

                GameBoard.lifeOverlay.style.display = "none"
                GameBoard.spacebarOverlay.style.display = "block"
                Game.locked = false

            }

            //hit spacebar
            if (e.keyCode === 32 && !locked){
    
                Game.paused = !Game.paused
                GameBoard.pauseOverlay.style.display = "none"
                GameBoard.startOverlay.style.display = "none"
                GameBoard.spacebarOverlay.style.display = "none"
                
                //Set the car move interval
                moveCarInterval = setInterval(moveCars, CAR_MOVE_TIME)
                
                //Set the add car interval
                addCarInterval = setInterval(getCar, CAR_ADD_TIME)
                
                if(Game.firstGo){
                  
                    Game.firstGo = false
                    Game.count = 3;

                    document.removeEventListener("keydown", keyDownHandler)
                   
                    
                    //make the three visivle
                    GameBoard.countdownOverlay.innerText =  count;
                    GameBoard.countdownOverlay.style.display = "block";
                  
                    //set an interval for 1 second to change innerHTML
                    GameBoard.countDownInterval = setInterval(changeCount, 1000)

                    //set interval to start the listener after the 3 seconds
                    freezeInterval = setInterval(addListener, 4000)
                    
                }
                
            }

        }
        
    }

    static stopTheCars(){
        //remove the car mover listeners
        clearInterval(moveCarInterval)
        clearInterval(addCarInterval)

    }

    static pause(){
        paused = !paused

        Game.stopTheCars()

        GameBoard.pauseOverlay.style.display = "block"
    }

    // adds the keydown listener to the document
    static addListener(){
        console.log("adding Event Listener")
        document.addEventListener("keydown", keyDownHandler)
        clearInterval(freezeInterval)
    }

    static changeCount(){
        count--
        if(count === 0 ){
            GameBoard.countDownTag.innerText = "GO!"
        }else if(count === -1){
            GameBoard.countDownTag.style.display = "none"
            clearInterval(countDownInterval)
        }else{
            GameBoard.countDownTag.innerText = count
        }
    }

    static frogHit(){

        if(Game.lives <= 1){

            //display that you died
            GameBoard.deathOverlay.style.display="block"
            Game.stopTheCars()
            document.removeEventListener("keydown", keyDownHandler)

            // reset the game (reload page) in 4 seconds
            reloadInterval = setInterval(Game.resetGame, 4000)

        }else{
        
            let span = GameBoard.lifeOverlay.getElementsByTagName("span")[0]
            span.innerText = `Lives remaining: ${Game.lives - 1}`
            GameBoard.lifeOverlay.style.display="block"
  
            Game.resetDOM()
        }
    }
    

    static youWin(){
        Game.stopTheCars()

        document.removeEventListener("keydown", keyDownHandler)
        GameBoard.winOverlay.style.display = "block"

    }

    static resetGame(){
        location.reload()
    }

    static resetDOM(){
        Game.paused = true;
        Game.firstGo= true;
        Game.locked = true;

        Game.stopTheCars()

        Game.lives -= 1

        Frog.reset()
        
        Vehicle.removeAll()
        ApiConnector.getStartingCars()

    }
}
Game.lives = 3
Game.paused = true;
Game.firstGo = true;
Game.level = 1;
Game.count = 3;
Game.locked = false