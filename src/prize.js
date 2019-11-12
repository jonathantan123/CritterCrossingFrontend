class Prize{

    static setLocation(left, top){
        Prize.tag.style.top = top
        Prize.tag.style.left = left
    }
}
Prize.tag = document.getElementById("prize")