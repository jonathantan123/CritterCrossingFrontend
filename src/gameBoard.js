let countDownInterval

class GameBoard{

    constructor(game){
        this.tag = document.getElementById("game-holder")
        this.game = game
    
        
        //DIMENSIONS
        this.WIDTH = this.tag.offsetWidth
        this.HEIGHT = this.tag.offsetHeight
        this.LEFT_EDGE = 0
        this.RIGHT_EDGE = this.WIDTH
        this.BOTTOM_EDGE = this.HEIGHT
        this.TOP_EDGE =  0

        this.winStrip = document.getElementById("winStrip")
        this.winStrip.style.top = 0
        this.winStrip.style.height = `${this.HEIGHT * .070}px`
        this.winStrip.style.left = "0px"
        this.winStrip.style.width = `${this.WIDTH -4}px`

        this.riverTag = document.getElementById("river")
        this.riverTag.style.height = `${this.HEIGHT * .23}px`
        this.riverTag.style.top = `${this.HEIGHT * .090}px`
        this.riverTag.style.left = "0px"
        this.riverTag.style.width = `${this.WIDTH -4}px`
    

        // HTML overlays and tags
        this.countdownOverlay = document.getElementById("three-count")
        this.pauseOverlay = document.getElementById("pause-overlay")
        this.deathOverlay = document.getElementById("death-overlay")
        this.lifeOverlay = document.getElementById("lives-overlay")
        this.startOverlay = document.getElementById("start-overlay")
        this.winOverlay = document.getElementById("win-overlay")
        this.formOverlay =document.getElementById("form-overlay")
        this.spacebarOverlay = document.getElementById("spacebar-overlay") 
        this.livesTag = document.getElementById("lives")
        this.levelTag = document.getElementById("level")
        this.headerTitle = document.getElementById("headerTitle")

        //The audio clip for countdown
        this.countDownAudio = new Audio("./audio/countdown.mp3")
    }

    hoverHandler(e){
        console.dir(e.target)
        e.target.style.cursor="pointer";
    }

    // On starting form submit, fetch the avatar
    formSubmitHandler = (e) => {
        e.preventDefault()
    
        this.game.setLevel(this.game.level)

        let id = e.target.dataset.id

        Adapter.getAvatar(this.game, id)
        Adapter.getLanes(this.game) 

        this.headerTitle.addEventListener("click", this.game.resetGame)
        this.headerTitle.addEventListener("mouseover", this.hoverHandler)
    }

    // Builds the avatar dropDown menu
    buildForm(avatars) {
        
        let formContainer = document.getElementById("form-container")
        
        avatars.forEach((avatar)=>{    
        
            let card = document.createElement("form")
            card.className = "card"
            card.dataset.id = avatar.id

           // let avatarImg = document.createElement("img")
           let avatarImg = document.createElement("input")
            avatarImg.type = "image"
            avatarImg.className= "avatar-image"
            avatarImg.src = avatar.src
            avatarImg.alt = "Submit"
           // avatarImg.src = avatar.image
           

            let breakTag = document.createElement("br")

            // let submitButton = document.createElement("input")
            // submitButton.type = "submit"
            // submitButton.className = "button"
            // submitButton.value= avatar.name
            // submitButton.dataset.id = avatar.id
            card.addEventListener("submit", this.formSubmitHandler)

            card.append(avatarImg) //, breakTag, submitButton)
            formContainer.appendChild(card)
            
        })
        
    }
  
    // Starts the game start countdown
    setCountDown(){
        countDownInterval = setInterval(this.changeCount, 1000)
        this.countDownAudio.play()
    }


    // Increments the countdown
    changeCount = () =>{
        this.game.count--
        if(this.game.count === 0 ){
            this.countdownOverlay.innerText = "GO!"
        }else if(this.game.count === -1){
            this.countdownOverlay.style.display = "none"
            clearInterval(countDownInterval)
        }else{
            this.countdownOverlay.innerText = this.game.count
        }
    }

    setLevel(level){
        this.levelTag.innerText = `Level: ${level}`
    }
    setLives(lives){
        this.livesTag.innerText = `Lives: ${lives}`
    }

    // Place the prize avatar on the DOM
    placePrize(prize){
        prize.setLocation(`${Math.floor(Math.random()* this.WIDTH ) - 20}px`, `${this.TOP_EDGE - 3}px`)
    }

    // Put the frog avatar at the starting position
    resetFrog(frog){
        frog.tag.style.top = `${this.BOTTOM_EDGE - 27}px`
        frog.tag.style.left = `${this.RIGHT_EDGE/2}px`

    }

    // appends a vehicle to the dom in the given lane
    appendCar(vehicle, lane){

        // add to the vehicle storage array
        Vehicle.tags.push(vehicle)

        let y_coord = this.BOTTOM_EDGE - lane.height*40 - 20
        let x_coord

        this.tag.appendChild(vehicle)

        if(lane.direction === "east"){
            x_coord = -60
            vehicle.style.transform = 'rotate(180deg)';
        }else{
            x_coord = this.WIDTH + 5
        }

        vehicle.style.left = `${x_coord}px`
        vehicle.style.top = `${y_coord}px`

    }

    // Removes a given vehicle from the DOM
    removeVehicle = (vehicle, index)=>{
        this.tag.removeChild(vehicle)
    }

    // Removes all the vehicles from the DOM
    removeAllVehicles(){
        
        console.log('removing all vehicles: ', Vehicle.tags)
        Vehicle.tags.forEach((tag, index) => this.removeVehicle(tag, index), this)
        Vehicle.tags = []
    
    }

    addLog(lane = undefined){  
        let random = false
        if(lane === undefined){
            random = true
            let index = Math.floor(Math.random() * 4) +  5
            lane = Lane.all[index]

        }
        let log = document.createElement("img")
        let y_coord = this.BOTTOM_EDGE -  243 - (lane.height - 4) * 20
        let x_coord 

        log.dataset.dir = lane.direction
        log.className = "log"
        log.src = "./img/log.png"

        this.tag.appendChild(log)

        
        if(lane.direction === "east"){
            x_coord = random? -70 : Math.random() * this.WIDTH  - 20 
            log.style.transform = 'rotate(180deg)';
        }else{
            x_coord = random? this.WIDTH + 10 : Math.random() * this.WIDTH  - 20

        }

        // Set the log's location
        log.style.left = `${x_coord}px`
        log.style.top = `${y_coord}px`
        
        //Add this to the array of all logs
        Log.tags.push(log)
        
    }

     // Removes a given vehicle from the DOM
     removeLog = (log)=>{
        this.tag.removeChild(log)
    }

    removeAllLogs(){
       
        Log.tags.forEach((tag, index) => this.removeLog(tag, index), this)
        Log.tags = []
    
    }




}



