document.addEventListener("DOMContentLoaded", ()=>{
    
    const BASE_URL = "http://localhost:3000"
    const FROG_URL = "/frogs"
    const VEHICLE_URL = "/vehicles"
    const LANE_URL = "/lanes"
    const CAR_MOVE_TIME = 200 // in ms
    const CAR_ADD_TIME = 1000 // in ms
    const FROG_MOVE_INC = 10; // in px
    const VEHICLE_MOVE_INC = 10; // in px

    // HTML elements
    let gameHolder = document.getElementById("game-holder")
    let frog
    let frogTag = document.getElementById("frog")
    let countDownTag = document.getElementById("three-count")
    let pauseTag = document.getElementById("pause-display")
    let deathDiv = document.getElementById("death-overlay")
    let lifeDiv = document.getElementById("lives-overlay")
    let startTag = document.getElementById("start-overlay")
    let prizeTag = document.getElementById("prize")
    let winTag = document.getElementById("win-overlay")


    //Data storage
    let lanes = []
    let vehicles = [] // array of html elements
    let lives = 3

    // flags
    let paused = true;
    let firstGo = true;
    let level = 1;
    let count = 3;
    let locked = false

    //intervals
    let moveCarInterval
    let addCarInterval 
    let freezeInterval
    let countDownInterval

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
        checkPrize()
        checkVehicles()
    }


    function movefrogRight() {
        let leftNumbers = frogTag.style.left.replace("px", "");
        let left = parseInt(leftNumbers, 10);
    
        if (left < RIGHT_EDGE - 35) {
        frogTag.style.left = `${left + FROG_MOVE_INC}px`;
        }
        checkPrize()
        checkVehicles()
    }

    function movefrogUp() {
        let topNumbers = frogTag.style.top.replace("px", "");
        let top = parseInt(topNumbers, 10);
        if (top > TOP_EDGE + 7) {
        frogTag.style.top = `${top - FROG_MOVE_INC}px`;
        }
        checkPrize()
        checkVehicles()
    }
    
    function movefrogDown() {
        let topNumbers = frogTag.style.top.replace("px", "");
        let top = parseInt(topNumbers, 10);
        
        if (top < BOTTOM_EDGE - 35) {
            frogTag.style.top = `${top + FROG_MOVE_INC}px`;
        }
        checkPrize()
        checkVehicles()
    }
    function checkPrize(){
        let buffer = 7
        frogXMin = parseInt(frogTag.style.left.replace("px", "")) + buffer
        frogXMax = frogXMin + frogTag.offsetWidth - 2*buffer
        frogYMax = parseInt(frogTag.style.top.replace("px", "")) - buffer
        frogYMin = frogYMax - frogTag.offsetHeight + 2*buffer

        prizeXMin = parseInt(prizeTag.style.left.replace("px", "")) + buffer
        prizeXMax = prizeXMin + prizeTag.offsetWidth - 2*buffer
        prizeYMax = parseInt(prizeTag.style.top.replace("px", "")) - buffer
        prizeYMin = prizeYMax - prizeTag.offsetHeight + 2*buffer

        if(prizeXMin > frogXMin && prizeXMin < frogXMax || prizeXMax > frogXMin && prizeXMax < frogXMax){
            if(prizeYMin > frogYMin && prizeYMin < frogYMax || prizeYMax > frogYMin && prizeYMax < frogYMax){
                // THEY OVERLAP!
                
                youWin()
                 
            }
        }

    }

    function checkVehicles(){

        frogXMin = parseInt(frogTag.style.left.replace("px", "")) 
        frogXMax = frogXMin + frogTag.offsetWidth
        frogYMax = parseInt(frogTag.style.top.replace("px", ""))
        frogYMin = frogYMax - frogTag.offsetHeight

        vehicles.forEach(vehicle => {

            console.log("checking a vehicle")

            vehicleXMin = parseInt(vehicle.style.left.replace("px", ""))
            vehicleXMax = vehicleXMin + vehicle.offsetWidth
            vehicleYMax = parseInt(vehicle.style.top.replace("px", ""))
            vehicleYMin = vehicleYMax - vehicle.offsetHeight
            
            // CHECK X 
            if(vehicleXMin > frogXMin && vehicleXMin < frogXMax || vehicleXMax > frogXMin && vehicleXMax < frogXMax){
                if(vehicleYMin > frogYMin && vehicleYMin < frogYMax || vehicleYMax > frogYMin && vehicleYMax < frogYMax){
                    // THEY OVERLAP!
                    
                    frogHit()
                    
                    
                }
            }
        })
    }

    function youWin(){
        clearInterval(moveCarInterval)
        clearInterval(addCarInterval)
        document.removeEventListener("keydown", keyDownHandler)
        winTag.style.display = "block"

    }

    function resetGame(){
        location.reload()
    }

    function resetDOM(){
        paused = true;
        firstGo= true;
        locked = true;

        clearInterval(moveCarInterval)
        clearInterval(addCarInterval)

        lives -= 1

        frogTag.style.top = `${BOTTOM_EDGE - 27}px`
        frogTag.style.left = `${RIGHT_EDGE/2}px`
        
        removeVehicles()
        vehicles = []

        getStartingCars()

    }

    function frogHit(){

        if(lives <= 1){
            deathDiv.style.display="block"
            clearInterval(moveCarInterval)
            clearInterval(addCarInterval)
            document.removeEventListener("keydown", keyDownHandler)
            reloadInterval = setInterval(resetGame, 4000)

        }else{
        
            let span = lifeDiv.getElementsByTagName("span")[0]
            span.innerText = `Lives remaining: ${lives - 1}`
            lifeDiv.style.display="block"
  
            resetDOM()
        }
    }

    function checkThisVehicle(vehicle){
        
        frogXMin = parseInt(frogTag.style.left.replace("px", "")) 
        frogXMax = frogXMin + frogTag.offsetWidth
        frogYMax = parseInt(frogTag.style.top.replace("px", ""))
        frogYMin = frogYMax - frogTag.offsetHeight

        vehicleXMin = parseInt(vehicle.style.left.replace("px", ""))
        vehicleXMax = vehicleXMin + vehicle.offsetWidth
        vehicleYMax = parseInt(vehicle.style.top.replace("px", ""))
        vehicleYMin = vehicleYMax - vehicle.offsetHeight
        
        // CHECK X 
        if(vehicleXMin > frogXMin && vehicleXMin < frogXMax || vehicleXMax > frogXMin && vehicleXMax < frogXMax){
            if(vehicleYMin > frogYMin && vehicleYMin < frogYMax || vehicleYMax > frogYMin && vehicleYMax < frogYMax){
            
                frogHit()
            }
        }

    }
    

    // ==================  CAR STUFF ========================================


    // appends a vehicle to the dom in the given lane
    function appendCar(vehicle, lane){

        // add to the vehicle storage array
        vehicles.push(vehicle)

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

    function removeVehicles(){
        vehicles.forEach(vehicle => {
            gameHolder.removeChild(vehicle)
        })
    }

    // Fetches a random car from the api to add to the given or a random lane
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
                
            })

    }

    // Moves all the cars by one increment. Set with an interval
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
            checkThisVehicle(vehicle)
        })
        
    }

    // HANDLER STUFF =============================================================

    // adds the keydown listener to the document
    function addListener(){
        console.log("adding Event Listener")
        document.addEventListener("keydown", keyDownHandler)
        clearInterval(freezeInterval)
    }

    function changeCount(){
        count--
        if(count === 0 ){
            countDownTag.innerText = "GO!"
        }else if(count === -1){
            countDownTag.style.display = "none"
            clearInterval(countDownInterval)
        }else{
            countDownTag.innerText = count
        }
    }

    // handles all key presses (arrows and space bar)
    function keyDownHandler(e) {

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
                pauseTag.style.display = "block"
              
                
            }
        }else{ // START GAME
            
            if(e.keyCode === 13 ){
                lifeDiv.style.display = "none"
                startTag.style.display = "block"
                locked = false
            }

            //hit spacebar
            if (e.keyCode === 32 && !locked){
    
                paused = !paused
                pauseTag.style.display = "none"
                startTag.style.display = "none"
                
                //Set the car move interval
                moveCarInterval = setInterval(moveCars, CAR_MOVE_TIME)
                
                //Set the add car interval
                addCarInterval = setInterval(getCar, CAR_ADD_TIME)
                
                if(firstGo){
                    console.log("FIRST GO")
                    firstGo = false
                    count = 3;

                    document.removeEventListener("keydown", keyDownHandler)
                    console.log("removed listener") 
                    
                      //make the three visivle
                    countDownTag.innerText =  count;
                    countDownTag.style.display = "block";
                  
                    //set an interval for 1 second to change innerHTML
                    countDownInterval = setInterval(changeCount, 1000)
                    //set interval to start the listener after the 3 seconds
                    freezeInterval = setInterval(addListener, 4000)
                    
                }
                
            }

        }
        
    }

    // Initial fetches ====================================================

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

    function getAvatar(id){
        fetch(`${BASE_URL}${FROG_URL}/${id}`)
            .then(resp => resp.json())
            .then(data => {
                frog = data
                
                // put the froggo on the page
                frogTag.innerText = frog.avatar
                frogTag.style.top = `${BOTTOM_EDGE - 27}px`
                frogTag.style.left = `${RIGHT_EDGE/2}px`
              
                prizeTag.innerText = frog.prize
                prizeTag.style.top = `${TOP_EDGE - 3}px`;
                prizeTag.style.left = `${Math.floor(Math.random()* WIDTH ) - 20}px`

                document.addEventListener("keydown", keyDownHandler)
            })
        
    }

    //=======================================================


    // EXECUTION ==========================================

    // NEED TO DO THIS
    // display form at beginning
    // on submit, hide the form, show the gameboard

    //fetch and Add the avatar
    let id =5 //this will be changed when we do form
    getAvatar(id)

    //get the lanes
    getLanes() 

    
    

}) // END DOM LISTENER

