const BASE_URL = "http://localhost:3000"
const FROG_URL = "/frogs"
const VEHICLE_URL = "/vehicles"
const LANE_URL = "/lanes"

class ApiConnector{

    static getStartingCars(){
        Vehicle.tags = []
        //Vehicle.all = []

        Lane.all.forEach(lane => {
            //get one car
            Vehicle.getCar(lane)
            
        })

        //Hide the form
        Gameboard.formOverlayTag.style.display = "none"
    }

    
    static getLanes(){
        fetch(`${BASE_URL}${LANE_URL}`)
            .then(resp => resp.json())
            .then(data => {
                Lane.all = data
            
                 //load initial cars
                getStartingCars()
            })
    
    }
    
    static getAvatar(id){
        fetch(`${BASE_URL}${FROG_URL}/${id}`)
            .then(resp => resp.json())
            .then(data => {
             
                Game.createFrog(data)
                Frog.avatar = data.avatar
                Frog.prize = data.prize

                // put the froggo on the page
                Frog.setAvatar(data.avatar)
                
                Frog.reset()
              
                Prize.tag.innerText = data.prize
                Prize.setLocation(`${Math.floor(Math.random()* WIDTH ) - 20}px`, `${TOP_EDGE - 3}px`)
    
                document.addEventListener("keydown", keyDownHandler)
            })
        
    }

    static fetchAllFrogs() {
        fetch(`${BASE_URL}${FROG_URL}`)
        .then(resp => resp.json())
        .then(data => GameBoard.dropDown(data))
    }


}

