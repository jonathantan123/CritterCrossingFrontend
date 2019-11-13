class Prize{

    constructor(avatar){
        this.tag = document.getElementById("prize")
    
    }

    randomLocation(gameBoard){
        this.setLocation(`${Math.floor(Math.random()* gameBoard.WIDTH ) - 20}px`, `${gameBoard.TOP_EDGE - 3}px`)
    }

    setLocation(left, top){
        console.log("setting location at (", left, ", ", top, ")")
        this.tag.style.top = top
        this.tag.style.left = left
    }
}
