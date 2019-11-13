const FROG_MOVE_INC = 10; // in px

class Frog {

    constructor(avatar){
        this.tag = document.getElementById("frog")
    }


    move(dir, gameBoard) {
    
        let left = parseInt(this.tag.style.left.replace("px", ""));
        let top = parseInt(this.tag.style.top.replace("px", ""));
       
        switch (dir){

            case "left":
                if (left > gameBoard.LEFT_EDGE + 5) {
                    this.tag.style.left = `${left - FROG_MOVE_INC}px`;
                }
                break;
            case "right":
                if (left < gameBoard.RIGHT_EDGE - 35) {
                    this.tag.style.left = `${left + FROG_MOVE_INC}px`;
                }
                break;
            case "up":
                if (top > gameBoard.TOP_EDGE + 7) {
                    this.tag.style.top = `${top - FROG_MOVE_INC}px`;
                }
                break;
            case "down":
                if (top < gameBoard.BOTTOM_EDGE - 35) {
                    this.tag.style.top = `${top + FROG_MOVE_INC}px`;
                }
                break;

        }
        
 
        
    }
    
}
