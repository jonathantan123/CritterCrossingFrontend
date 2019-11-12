class Vehicle{

    // constructor(avatar, dir){
    //     this.avatar = avatar
    //     this.direction = dir
    // }
    
    // Fetches a random car from the api to add to the given or a random lane
    static getCar(lane = lanes[Math.floor(Math.random()*5)]){
        
        fetch(`${BASE_URL}${VEHICLE_URL}?limit=1`)
            .then(resp =>resp.json())
            .then(data => {

                data = data[Math.floor(Math.random()*data.length)]
            
                let vehicleTag = document.createElement("img")
                vehicleTag.className = "vehicle"
                vehicleTag.src = data.avatar
                vehicleTag.dataset.dir = lane.direction
                appendCar(vehicleTag, lane)

                //Vehicle.all.push(new Vehicle(data.avatar, lane.direction))
                
            })

    }
    
    
    // appends a vehicle to the dom in the given lane
    static appendCar(vehicle, lane){

        // add to the vehicle storage array
        Vehicle.tags.push(vehicle)

        let y_coord = BOTTOM_EDGE - lane.height*40 - 20
        let x_coord

        GameBoard.addVehicle(vehicle)

        if(lane.direction === "east"){
            x_coord = -60
            vehicle.style.transform = 'rotate(180deg)';
        }else{
            x_coord = WIDTH + 5
        }

        vehicle.style.left = `${x_coord}px`
        vehicle.style.top = `${y_coord}px`

    }

    static removeAll(){
        
        //Vehicle.all = []
        Vehicle.tags.forEach(tag => GameBoard.removeVehicle)
        Vehicle.tags = []
    
    }

    static removeVehicle(index){
        GameBoard.removeVehicle(Vehicle.tags[index])
        //Vehicle.all.splice(index,1)
        Vehicle.tags.splice(index,1)

    }

    // Moves all the cars by one increment. Set with an interval
    static moveCars(){
        Vehicle.tags.forEach((vehicle, index) => {
            let left = parseInt(vehicle.style.left.replace("px", ""))
            if(vehicle.dataset.dir === "east"){
                if (left < WIDTH + 20) {
                    vehicle.style.left = `${left + VEHICLE_MOVE_INC}px`;
                }else{
                    Vehicle.removeVehicle(index)
                }
              
            }else {
                if (left > -80) {
                    vehicle.style.left = `${left - VEHICLE_MOVE_INC}px`;
                }else{
                    Vehicle.removeVehicle(index)
                }
            }
            Game.checkConflict(vehicle) // was checkThisVehicle
        })
        
    }
}
Vehicle.tags = []
//Vehicle.all = []