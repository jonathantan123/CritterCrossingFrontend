let CAR_MOVE_TIME = 175// in ms
let CAR_ADD_TIME = 800  // in ms
const VEHICLE_MOVE_INC = 10 // in px

 //intervals
let moveCarInterval
let addCarInterval 
let freezeInterval
let countsDownInterval

class Game{

    constructor(){
        this.gameBoard = new GameBoard(this)
        this.frog = new Frog("")
        this.prize = new Prize("")
        this.lives = 3
        this.paused = true;
        this.firstGo = true;
        this.level = 1;
        this.count = 3;
        this.locked = false
    }

    // handles all key presses (arrows and space bar)
    static keyDownHandler(e) {

        // IF THE GAME IS GOING
        if(!paused){
            if (e.key === "ArrowLeft") {
                this.frog.move("left");
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowRight") {
                this.frog.move("right");
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowUp") {
                this.frog.move("up");
                this.checkForWinOrLoss()
            }
            if (e.key === "ArrowDown") {
                this.frog.move("down");
                this.checkForWinOrLoss()
            }
            if (e.keyCode === 32){ // SPACE BAR
                console.log("PAUSING")  
                this.pause()       
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
    
                this.paused = !this.paused
                GameBoard.pauseOverlay.style.display = "none"
                GameBoard.startOverlay.style.display = "none"
                GameBoard.spacebarOverlay.style.display = "none"
                
                //Set the car move interval
                moveCarInterval = setInterval(this.moveCars, CAR_MOVE_TIME)
                
                //Set the add car interval
                addCarInterval = setInterval(this.getCar, CAR_ADD_TIME)
                
                if(this.firstGo){
                  
                    this.firstGo = false
                    this.count = 3;

                    document.removeEventListener("keydown", keyDownHandler)
                   
                    
                    //make the three visivle
                    GameBoard.countdownOverlay.innerText =  count;
                    GameBoard.countdownOverlay.style.display = "block";
                  
                    //set an interval for 1 second to change innerHTML
                    GameBoard.countDownInterval = setInterval(this.changeCount, 1000)

                    //set interval to start the listener after the 3 seconds
                    freezeInterval = setInterval(addListener, 4000)
                    
                }
                
            }

        }
        
    }

    // Moves all the cars by one increment. Set with an interval
     moveCars(){
        Vehicle.tags.forEach((vehicle, index) => {
            let left = parseInt(vehicle.style.left.replace("px", ""))
            if(vehicle.dataset.dir === "east"){
                if (left < WIDTH + 20) {
                    vehicle.style.left = `${left + VEHICLE_MOVE_INC}px`;
                }else{
                    this.gameBoard.removeVehicle(vehicle, index)
                }
              
            }else {
                if (left > -80) {
                    vehicle.style.left = `${left - VEHICLE_MOVE_INC}px`;
                }else{
                    this.gameBoard.removeVehicle(vehicle, index)
                }
            }
            this.checkConflict(vehicle) // was checkThisVehicle
        })
        
    }

    setLevel(level){
        this.level = level
        this.CAR_MOVE_TIME = CAR_MOVE_TIME - this.level * 50//= 200 // in ms
        this.CAR_ADD_TIME = CAR_ADD_TIME - this.level * 200//= 1000 // in ms
    }

    setFrog(avatar){
        this.frog.avatar = avatar
        this.frog.tag.innerText = avatar
        this.gameBoard.resetFrog(this.frog)
    }

    setPrize(avatar){
        this.prize.avatar = avatar
        this.prize.tag.innerText = avatar
        this.prize.randomLocation(this.gameBoard)
    }


    stopTheCars(){
        //remove the car mover listeners
        clearInterval(moveCarInterval)
        clearInterval(addCarInterval)

    }

    pause(){
        paused = !paused
        Game.stopTheCars()
        GameBoard.pauseOverlay.style.display = "block"
    }

    // adds the keydown listener to the document
    addListener(){
        console.log("adding Event Listener")
        document.addEventListener("keydown", this.keyDownHandler)
        clearInterval(freezeInterval)
    }

    changeCount(){
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

    frogHit(){

        if(Game.lives <= 1){

            //display that you died
            GameBoard.deathOverlay.style.display="block"
            this.stopTheCars()
            document.removeEventListener("keydown", this.keyDownHandler)

            // reset the game (reload page) in 4 seconds
            reloadInterval = setInterval(this.resetGame, 4000)

        }else{
        
            let span = GameBoard.lifeOverlay.getElementsByTagName("span")[0]
            span.innerText = `Lives remaining: ${Game.lives - 1}`
            GameBoard.lifeOverlay.style.display="block"
  
            this.resetDOM()
        }
    }
    

    youWin(){
        this.stopTheCars()

        document.removeEventListener("keydown", this.keyDownHandler)
        GameBoard.winOverlay.style.display = "block"

    }

    resetGame(){
        location.reload()
    }

    resetDOM(){
        this.paused = true;
        this.firstGo= true;
        this.locked = true;

        this.stopTheCars()

        this.lives -= 1

        this.gameBoard.resetFrog(this.frog)
        
        this.gameBoard.removeAllVehicles()
        ApiConnector.getStartingCars(this)

    }

    checkForWinOrLoss(){
        this.checkConflict(this.prize.tag, "win")
        Vehicle.tags.forEach(this.checkConflict)
    }


    checkConflict(itemTag, result = "lose"){

        let buffer = 7
        
        let frogXMin = parseInt(this.frog.tag.style.left.replace("px", "")) + buffer
        let frogXMax = frogXMin + this.frog.tag.offsetWidth - 2*buffer
        let frogYMax = parseInt(this.frog.tag.style.top.replace("px", "")) - buffer
        let frogYMin = frogYMax - this.frog.tag.offsetHeight + 2*buffer

        let itemXMin = parseInt(itemTag.style.left.replace("px", "")) + buffer
        itemXMax = itemXMin + itemTag.offsetWidth - 2*buffer
        itemYMax = parseInt(itemTag.style.top.replace("px", "")) - buffer
        itemYMin = itemYMax - itemTag.offsetHeight + 2*buffer

        if(itemXMin > frogXMin && itemXMin < frogXMax || itemXMax > frogXMin && itemXMax < frogXMax){
            if(itemYMin > frogYMin && itemYMin < frogYMax || itemYMax > frogYMin && itemYMax < frogYMax){
                
                if(result === "win"){
                    this.youWin()

                }else{
                    this.frogHit()
                }  
            }
        }
    }
}
