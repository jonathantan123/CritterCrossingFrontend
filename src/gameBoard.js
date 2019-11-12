class GameBoard{

    static formSubmitHandler(e){
        e.preventDefault()

        level = parseInt(e.target[0].value)

        CAR_MOVE_TIME = CAR_MOVE_TIME - level * 50//= 200 // in ms
        CAR_ADD_TIME = CAR_ADD_TIME - level * 200//= 1000 // in ms

        let id = e.target[2].value

        ApiConnector.getAvatar(id)
        ApiConnector.getLanes() 
    }

    static dropDown(frogs) {
        let formTag = document.getElementById("form")
        let avatarList = document.createElement("select")
   
        frogs.forEach((frog)=>{
           
            avatarList.appendChild(new Option (`${frog.avatar}`, frog.id))
        })

        formTag.appendChild(avatarList)
        
        formTag.addEventListener("submit", formSubmitHandler)

    }

    static removeVehicle(vehicle){
        GameBoard.tag.removeChild(vehicle)
    
    }

    static addVehicle(vehicle){
        GameBoard.tag.appendChild(vehicle)
    }

}
GameBoard.tag = document.getElementById("game-holder")
console.log(document)

console.log(document.getElementById("game-holder"))


//DIMENSIONS
GameBoard.WIDTH = GameBoard.tag.offsetWidth
GameBoard.LEFT_EDGE = 0
GameBoard.RIGHT_EDGE = WIDTH
GameBoard.BOTTOM_EDGE = GameBoard.tag.offsetHeight
GameBoard.TOP_EDGE =  0

// HTML overlays and tags
GameBoard.countdownOverlay = document.getElementById("three-count")
GameBoard.pauseOverlay = document.getElementById("pause-display")
GameBoard.deathOverlay = document.getElementById("death-overlay")
GameBoard.lifeOverlay = document.getElementById("lives-overlay")
GameBoard.startOverlay = document.getElementById("start-overlay")
GameBoard.winOverlay = document.getElementById("win-overlay")
GameBoard.formOverlayTag =document.getElementById("form-overlay")
GameBoard.spacebarOverlay = document.getElementById("spacebar-overlay") 