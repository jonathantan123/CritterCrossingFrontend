const FROG_MOVE_INC = 10; // in px

class Frog {

    constructor(avatar){
        this.tag = document.getElementById("frog")
    }


    move(dir) {
        let left = parseInt(this.tag.style.left.replace("px", ""));
        let top = parseInt(this.tag.style.top.replace("px", ""));
       
        switch (dir){

            case "left":
                if (left > GameBoard.LEFT_EDGE + 5) {
                    this.tag.style.left = `${left - FROG_MOVE_INC}px`;
                }
                break;
            case "right":
                if (left < GameBoard.RIGHT_EDGE - 35) {
                    this.tag.style.left = `${left + FROG_MOVE_INC}px`;
                }
                break;
            case "up":
                if (top > GameBoard.TOP_EDGE + 7) {
                    this.tag.style.top = `${top - FROG_MOVE_INC}px`;
                }
                break;
            case "down":
                if (top < GameBoard.BOTTOM_EDGE - 35) {
                    this.tag.style.top = `${top + FROG_MOVE_INC}px`;
                }
                break;

        }
        
        // this.checkConflict(Prize.tag, "win")
        // Vehicle.tags.forEach(checkConflict)
        
    }
    // checkConflict(itemTag, result = "lose"){

    //     let buffer = 7
        
    //     let frogXMin = parseInt(this.tag.style.left.replace("px", "")) + buffer
    //     let frogXMax = frogXMin + this.tag.offsetWidth - 2*buffer
    //     let frogYMax = parseInt(this.tag.style.top.replace("px", "")) - buffer
    //     let frogYMin = frogYMax - this.tag.offsetHeight + 2*buffer

    //     let itemXMin = parseInt(itemTag.style.left.replace("px", "")) + buffer
    //     itemXMax = itemXMin + itemTag.offsetWidth - 2*buffer
    //     itemYMax = parseInt(itemTag.style.top.replace("px", "")) - buffer
    //     itemYMin = itemYMax - itemTag.offsetHeight + 2*buffer

    //     if(itemXMin > frogXMin && itemXMin < frogXMax || itemXMax > frogXMin && itemXMax < frogXMax){
    //         if(itemYMin > frogYMin && itemYMin < frogYMax || itemYMax > frogYMin && itemYMax < frogYMax){
                
    //             if(result === "win"){
    //                 Game.youWin()

    //             }else{
    //                 Game.frogHit()
    //             }  
    //         }
    //     }
    // }

    

}
