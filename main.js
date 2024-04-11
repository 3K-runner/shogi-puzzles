const BOARD_NUM = 5;

const tileId = (num1, num2) => "tile" + num1.toString() + num2.toString(); 

const NumberToPx = num => num.toString() + "px";
const PxToNumber = str => Number(str.slice(0, -2));

// Takes a value as a stringed number with px as unit 
//and operates it acording to a function and a given number
const operatePX = str => func => num2 => {
    const num1 = PxToNumber(str);
    return NumberToPx(func(num1, num2));
}

const div = (num1, num2) => num1 / num2;

const multi = (num1, num2) => num1 * num2;

const dimension = offset => (num1, num2) => (num1 / num2) - offset;

const getScreenSize = () => {
    if (window.innerWidth > 0) {
        return (window.innerWidth <= window.innerHeight) ? window.innerWidth : window.innerHeight;
    }
    return (screen.width <= screen.height) ? screen.width : screen.height;
}

//--------------------------------------------

const SetRootVar = () => {
    const root = document.querySelector(":root");

    const body = document.getElementById("body");
    const style = body.currentStyle || window.getComputedStyle(body) || screen.getComputedStyle(width);
    
    const screenSize = NumberToPx(getScreenSize() - 2 * PxToNumber(style.marginTop));

    const paddingSize = operatePX(screenSize)(multi)(0.15);
    root.style.setProperty("--padding-size", paddingSize);

    const boardSize = operatePX(screenSize)(multi)(0.65);
    root.style.setProperty("--board-size", boardSize);

    const tileBorderSize = getComputedStyle(root).getPropertyValue("--border-width");
    const tileSize = operatePX(boardSize)(dimension(2.1 * PxToNumber(tileBorderSize)))(BOARD_NUM);
    root.style.setProperty("--tile-size", tileSize);

    const handWidth = operatePX(tileSize)(multi)(BOARD_NUM - 1);
    root.style.setProperty("--hand-width", handWidth);

    const fontSize = operatePX(tileSize)(multi)(0.55);
    root.style.setProperty("--font-size", fontSize);
}

const CreateTiles = () => { 
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            var tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = tileId(i, j);

            document.getElementById("board").appendChild(tile);
            var txt = document.createElement("div");
            txt.id = tileId(i, j) + "t";

            document.getElementById(tileId(i, j)).appendChild(txt)
        }
    }
}

const Create = () => {
    CreateTiles();
}

window.addEventListener("resize", function(event){
    SetRootVar();
});
