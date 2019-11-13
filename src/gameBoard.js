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

    formSubmitHandler = (e) => {
        e.preventDefault()
        this.game.setLevel(parseInt(e.target[0].value))

        let id = e.target[2].value

        ApiConnector.getAvatar(this.game, id)
        ApiConnector.getLanes(this.game) 
    }

    buildDropDown(frogs) {
        let formTag = document.getElementById("form")
        let avatarList = document.createElement("select")
   
        frogs.forEach((frog)=>{
           
            avatarList.appendChild(new Option (`${frog.avatar}`, frog.id))
        })

        formTag.appendChild(avatarList)
        
        formTag.addEventListener("submit", this.formSubmitHandler)

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

    resetFrog(frog){
        frog.tag.style.top = `${this.BOTTOM_EDGE - 27}px`
        frog.tag.style.left = `${this.RIGHT_EDGE/2}px`
 
        console.log("putting frog at: (", frog.tag.style.left, ", ", frog.tag.style.top, ")" )

    }


    removeVehicle(vehicle, index){
        this.tag.removeChild(vehicle)
        Vehicle.tags.splice(index,1)
    
    }

    removeAllVehicles(){
        
        //Vehicle.all = []
        Vehicle.tags.forEach(tag => this.removeVehicle)
        Vehicle.tags = []
    
    }

}



