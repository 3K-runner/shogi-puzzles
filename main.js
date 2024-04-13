const BOARD_NUM = 5;

const tileId = (num1, num2) => "tile" + num1.toString() + num2.toString();

const NumberToPx = num => num.toString() + "px";
const PxToNumber = str => Number(str.slice(0, -2));

// Takes a value as a stringed number with px as unit 
//and operates it acording to a function and a given number
const operatePX = str => func => num2 => NumberToPx(func(PxToNumber(str), num2));


const div = (num1, num2) => num1 / num2;

const multi = (num1, num2) => num1 * num2;

const dimension = offset => (num1, num2) => (num1 / num2) - offset;

const getScreenSize = vertical => {
    if (window.innerWidth > 0) {
        if (window.innerWidth <= window.innerHeight) {
            vertical[0] = true;
            return window.innerWidth;
        }
        return window.innerHeight;
    }
    if (screen.width <= screen.height) {
        vertical[0] = true;
        return screen.width;
    }
    return screen.height;
}

//--------------------------------------------

const SetRootVar = () => {
    //changes value inside the list
    const vertical = [false];
    const root = document.querySelector(":root");

    const body = document.getElementById("body");
    const style = body.currentStyle || window.getComputedStyle(body) || screen.getComputedStyle(width);
    
    const screenSize = NumberToPx(getScreenSize(vertical) - 2 * PxToNumber(style.marginTop));

    const paddingSize = operatePX(screenSize)(multi)(0.20);
    root.style.setProperty("--padding-size", paddingSize);

    const boardSize = operatePX(screenSize)(multi)(0.60);
    root.style.setProperty("--board-size", boardSize);

    const tileBorderSize = getComputedStyle(root).getPropertyValue("--border-width");
    const tileSize = operatePX(boardSize)(dimension(2.1 * PxToNumber(tileBorderSize)))(BOARD_NUM);
    root.style.setProperty("--tile-size", tileSize);

    const handWidth = operatePX(tileSize)(multi)(BOARD_NUM - 1);
    root.style.setProperty("--hand-width", handWidth);

    const fontSize = operatePX(tileSize)(multi)(0.55);
    root.style.setProperty("--font-size", fontSize);

    const frameMargin = vertical[0] ? "0 auto" : "0";
    root.style.setProperty("--frame-margin", frameMargin)
}

const CreateTiles = () => { 
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = tileId(i, j);

            document.getElementById("board").appendChild(tile);
            let txt = document.createElement("div");
            txt.id = tileId(i, j) + "t";

            document.getElementById(tileId(i, j)).appendChild(txt)
        }
    }
}

window.addEventListener("resize", SetRootVar);
