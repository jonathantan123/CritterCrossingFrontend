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

        // HTML overlays and tags
        this.countdownOverlay = document.getElementById("three-count")
        this.pauseOverlay = document.getElementById("pause-display")
        this.deathOverlay = document.getElementById("death-overlay")
        this.lifeOverlay = document.getElementById("lives-overlay")
        this.startOverlay = document.getElementById("start-overlay")
        this.winOverlay = document.getElementById("win-overlay")
        this.formOverlay =document.getElementById("form-overlay")
        this.spacebarOverlay = document.getElementById("spacebar-overlay") 
    }

    // On starting form submit, fetch the avatar
    formSubmitHandler = (e) => {
        e.preventDefault()
        this.game.setLevel(parseInt(e.target[0].value))

        let id = e.target[2].value

        ApiConnector.getAvatar(this.game, id)
        ApiConnector.getLanes(this.game) 
    }

    // Builds the avatar dropDown menu
    buildDropDown(frogs) {
        let formTag = document.getElementById("form")
        let avatarList = document.createElement("select")
        avatarList.className = "avatar-list"
        let submitDiv = document.getElementsByClassName("select-div")[0]
        
        // add placeholder / prompt
        avatarList.appendChild(new Option ("CHOOSE YOUR SPRITE...", ""))
        avatarList.options[0].disabled = true

        frogs.forEach((frog)=>{
           
            avatarList.appendChild(new Option (`${frog.avatar}`, frog.id))
        })

        formTag.insertBefore(avatarList, submitDiv)
        
        formTag.addEventListener("submit", this.formSubmitHandler)

    }

    // Starts the game start countdown
    setCountDown(){
        countDownInterval = setInterval(this.changeCount, 1000)
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
        console.log("removing vehicle at index ", index)
        this.tag.removeChild(vehicle)
       
    
    }

    // Removes all the vehicles from the DOM
    removeAllVehicles(){
        
        console.log('removing all vehicles: ', Vehicle.tags)
        Vehicle.tags.forEach((tag, index) => this.removeVehicle(tag, index), this)
        Vehicle.tags = []
    
    }

}



