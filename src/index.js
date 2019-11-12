document.addEventListener("DOMContentLoaded", ()=>{
    
    const BASE_URL = "http://localhost:3000"
    const FROG_URL = "/frogs"
    const VEHICLE_URL = "/vehicles"
    const LANE_URL = "/lanes"
    const CAR_MOVE_TIME = 100 // in ms
    const CAR_ADD_TIME = 650 // in ms
    const FROG_MOVE_INC = 10; // in px
    const VEHICLE_MOVE_INC = 10; // in px

    // HTML elements
    let gameHolder = document.getElementById("game-holder")
    let frog
    let frogTag = document.getElementById("frog")

    //Data storage
    let lanes = []
    
    let vehicles = []

    // flags
    let paused = true;
    let firstGo = true;
    let level = 1;

    //intervals
    let moveCarInterval
    let addCarInterval 
    let freezeInterval
    

    //game dimensions
    const WIDTH = gameHolder.offsetWidth
    const LEFT_EDGE = 0
    const RIGHT_EDGE = WIDTH
    const BOTTOM_EDGE = gameHolder.offsetHeight
    const TOP_EDGE =  0

    // ================= FROG STUFF ================================================
  
    function movefrogLeft() {
        let leftNumbers = frogTag.style.left.replace("px", "");
        let left = parseInt(leftNumbers, 10);
    
        if (left > LEFT_EDGE + 5) {
            frogTag.style.left = `${left - FROG_MOVE_INC}px`;
        }
    }


    function movefrogRight() {
        let leftNumbers = frogTag.style.left.replace("px", "");
        let left = parseInt(leftNumbers, 10);
    
        if (left < RIGHT_EDGE - 35) {
        frogTag.style.left = `${left + FROG_MOVE_INC}px`;
        }
    }

    function movefrogUp() {
        let topNumbers = frogTag.style.top.replace("px", "");
        let top = parseInt(topNumbers, 10);
        if (top > TOP_EDGE + 7) {
        frogTag.style.top = `${top - FROG_MOVE_INC}px`;
        }
    }
    
    function movefrogDown() {
        let topNumbers = frogTag.style.top.replace("px", "");
        let top = parseInt(topNumbers, 10);
        
        if (top < BOTTOM_EDGE - 35) {
            frogTag.style.top = `${top + FROG_MOVE_INC}px`;
        }
    }
    

    // ==================  CAR STUFF ========================================
    
    function addListener(){
        console.log("adding Event Listener")
        document.addEventListener("keydown", keyDownHandler)
        clearInterval(freezeInterval)
    }

    // HAPPEN EVERY ~3 SECONDS
    function appendCar(vehicle, lane){
        vehicles.push(vehicle)

        //place on DOM based on this Lane

        let y_coord = BOTTOM_EDGE - lane.height*40 - 20
        let x_coord

        gameHolder.appendChild(vehicle)
        if(lane.direction === "east"){
            x_coord = -60
            vehicle.style.transform = 'rotate(180deg)';
        }else{
            x_coord = WIDTH + 5
        }

        vehicle.style.left = `${x_coord}px`
        vehicle.style.top = `${y_coord}px`

    }

    function getCar(lane = lanes[Math.floor(Math.random()*5)]){
        
        fetch(`${BASE_URL}${VEHICLE_URL}?limit=1`)
            .then(resp =>resp.json())
            .then(data => {

                data = data[Math.floor(Math.random()*data.length)]
            
                let vehicle = document.createElement("img")
                vehicle.className = "vehicle"
                vehicle.src = data.avatar
                vehicle.dataset.dir = lane.direction
                appendCar(vehicle, lane)

                //add keyDown listener
                document.addEventListener("keydown", keyDownHandler) 
                
            })

    }

    // HAPPEN EVERY 
    function moveCars(){
        vehicles.forEach((vehicle, index) => {
            let left = parseInt(vehicle.style.left.replace("px", ""))
            if(vehicle.dataset.dir === "east"){
                if (left < WIDTH + 20) {
                    vehicle.style.left = `${left + VEHICLE_MOVE_INC}px`;
                }else{
                    vehicles.splice(index,1)
                    //remove it from DOM
                    gameHolder.removeChild(vehicle)
                    // remove it from array
                }
              
            }else {
                if (left > -80) {
                    vehicle.style.left = `${left - VEHICLE_MOVE_INC}px`;
                }else{
                    vehicles.splice(index,1)
                    //remove it from DOM
                    gameHolder.removeChild(vehicle)
                    // remove it from array
                }
            }
        })
        
    }

    function getStartingCars(){
        lanes.forEach(lane => {
            //get one car
            getCar(lane)
            
        })
    }

    function getLanes(){
        fetch(`${BASE_URL}${LANE_URL}`)
            .then(resp => resp.json())
            .then(data => {
                lanes = data
            
                 //load initial cars
                getStartingCars()
            })

    }
    function keyDownHandler(e) {
        console.log("handling click!")
        if(!paused){
            if (e.key === "ArrowLeft") {
                movefrogLeft();
            }
            if (e.key === "ArrowRight") {
                movefrogRight();
            }
            if (e.key === "ArrowUp") {
                movefrogUp();
            }
            if (e.key === "ArrowDown") {
                movefrogDown();
            }
            if (e.keyCode === 32){
                console.log("PAUSING")
                paused = !paused
                //remove the car mover listeners
                clearInterval(moveCarInterval)
                clearInterval(addCarInterval)
                
                //pause game timer
                
            }
        }else{ // START GAME
            
            //hit spacebar
            if (e.keyCode === 32){
                
           
                paused = !paused
                
                //Set the car move interval
                moveCarInterval = setInterval(moveCars, CAR_MOVE_TIME)
                
                //Set the add car interval
                addCarInterval = setInterval(getCar, CAR_ADD_TIME)
                
                if(firstGo){
                    firstGo = false
                    🚄
                    
                    document.removeEventListener("keydown", keyDownHandler)
                    
                    console.log("removed listener") 
                    freezeInterval = setInterval(addListener, 3000)
                    
                }
                
            }

        }
        
    }

    function getAvatar(id){
        fetch(`${BASE_URL}${FROG_URL}/${id}`)
            .then(resp => resp.json())
            .then(data => {
                frog = data
                
                // put the froggo on the page
                frogTag.innerText = frog.avatar
                frogTag.style.top = `${BOTTOM_EDGE - 27}px`
                frogTag.style.left = `${RIGHT_EDGE/2}px`


            })
        
    }

    //=======================================================


    // EXECUTION ==========================================

    // NEED TO DO THIS
    // display form at beginning
    // on submit, hide the form, show the gameboard

    //fetch and Add the avatar
    let id =1 //this will be changed when we do form
    getAvatar(id)

    //get the lanes
    getLanes() 

    
    

}) // END DOM LISTENER

