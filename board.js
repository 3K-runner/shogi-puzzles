const pieces = (num => {
    switch (num) {
    case 9:  return [[" ", " "], 
                     ["歩", "と"], 
                     ["香", "杏"], 
                     ["桂", "圭"], 
                     ["銀", "全"], 
                     ["金", "金"], 
                     ["角", "馬"], 
                     ["飛", "竜"], 
                     ["王", "玉"]];
    case 5:  return [[" ", " "], 
                     ["歩", "と"], 
                     ["銀", "全"], 
                     ["金", "金"], 
                     ["角", "馬"], 
                     ["飛", "竜"], 
                     ["王", "玉"]];
    default: return [];
    };
})(BOARD_NUM);

const NOTATION_PIECES = (num => {
    switch (num) {
    case 5:  return ["psgbrk", "PSGBRK"];       
    case 9:  return ["plnsgbrk", "PLNSGBRK"];
    default: return ["", ""];
    }
})(BOARD_NUM);

const makeTab = () => {
    let std_tab_var = [];
    for (let i = 0; i < BOARD_NUM; i++) {
        std_tab_var[i] = [];
        for (let j = 0; j < BOARD_NUM; j++) {
            std_tab_var[i][j] = [0, 0, 0];
        }
    }
    return std_tab_var;
}

const makeHand = () => {
    let std_hand_var = [];
    for (let i = 0; i < 2; i++) {
        std_hand_var[i] = [];
        for (let j = 0; j < pieces.length - 1; j++) {
            std_hand_var[i][j] = 0;
        }
    }
    return std_hand_var;
}

const clean_board = () => ({
    tab:  makeTab(),
    hand: makeHand(),
    turn: 0,
    mate: 0,
});

//----------------------------------

const FillBoard = boardToUse => {
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            const piece = boardToUse.tab[i][j];
            let tile = document.getElementById(tileId(i, j) + "t");
            
            const turn_or_pro = (piece[0] == (pieces.length - 1)) ? 1 : 2;
            tile.textContent = pieces[piece[0]][piece[turn_or_pro]];
            if (piece[0] == 0) continue;
            
            tile.style.transform = (piece[1] == 0) ? "rotate(180deg)" : "" ;
            tile.style.color     = (piece[2] == 0) ? "#000000" : "#FF0000";
        }
    }
}

const handId = turn => "hand" + turn.toString();

const FillHand = boardToUse => {
    for (let i = 0; i < 2; i++) {
        let handstr = "";
        if (boardToUse.hand[i][0] != 0) {
            for (let j = 1; j < pieces.length - 1; j++) {
                let numhand = boardToUse.hand[i][j];
                if (numhand == 0) continue;
                handstr = handstr + numhand.toString() + pieces[j][0] + " ";
            }
        }

        document.getElementById(handId(i)).textContent = handstr;
    }
}

const setMate = (turn, mate) => {
    let mateMessage = "";
    if (mate == 0) {
        mateMessage = "No mate";
    } else {
        const player = (turn == 0) ? "Gote" : "Sente";
        mateMessage = "Mate in " + mate.toString() + ": " + player + " to win";
    }
    document.getElementById("mate").textContent = mateMessage;
}

const boardfile = () => ({
    file: "",
    count: 0,

    Add(str) {
        this.file = str;
    },

    Read() {
        let resp = this.file[this.count];
        this.count++;
        if (resp == "+") {
            resp = resp + this.file[this.count];
            this.count++;
        }
        return resp;
    }
});

const charIsNumber = char => {
    const numbers = [..."0123456789"];
    for (let i = 0; i < numbers.length; i++) {
        if (char == numbers[i]) {
            return true;
        }
    }
    return false;
}

const getPlayerPiece = char => {
    for (let turn = 0; turn < 2; turn++) {
        for (let i = 0; i < NOTATION_PIECES[turn].length; i++) {
            if (char == NOTATION_PIECES[turn][i]) return [i + 1, turn];
        }
    }
    return [0, 0];
}

const setBoard = boardstr => board => {
    let boardTxt = boardfile();
    boardTxt.Add(boardstr);

    let countBlanks = 0;
    let buffer = "";
    let piece = [0, 0];
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            if (countBlanks > 0) {
                countBlanks--;
                continue;
            }

            buffer = boardTxt.Read();
            if (buffer.length == 2) {
                piece = getPlayerPiece(buffer[1]);
                board.tab[i][j][2] = 1;
            } else {
                if (charIsNumber(buffer)) {
                    countBlanks = Number(buffer);
                    j--;
                    continue
                }
                if (buffer == "/") {
                    j--;
                    continue;
                }

                piece = getPlayerPiece(buffer);
                board.tab[i][j][2] = 0;
            }
            board.tab[i][j][0] = piece[0];
            board.tab[i][j][1] = piece[1];
        }
    }
    
    buffer = boardTxt.Read();
    if (buffer == " ") buffer = boardTxt.Read();
    board.turn = (buffer == "w") ? 0 : 1; 
    boardTxt.Read();

    let mate = 0;
    buffer = boardTxt.Read();
    if (charIsNumber(buffer)) {
        mate = Number(buffer);
        buffer = boardTxt.Read();
        if (buffer == undefined) {
            board.mate = (mate == 0) ? 0 : (mate * 2 - 1);
            return ;
        }
        piece = getPlayerPiece(buffer);
        board.hand[piece[1]][0] = 1;
        board.hand[piece[1]][piece[0]] = mate;

        buffer = boardTxt.Read();
    }
    for (let i = 0; buffer != " "; i++) {
        let qt = 1;
        if (charIsNumber(buffer)) {
            qt = Number(buffer);
            buffer = boardTxt.Read();
        }
        piece = getPlayerPiece(buffer);
        board.hand[piece[1]][0] = 1;
        board.hand[piece[1]][piece[0]] = qt;

        buffer = boardTxt.Read();
    } 
    
    buffer = boardTxt.Read();
    if (buffer == undefined) {
        board.mate = -1;
        return ;
    }
    mate = Number(buffer);
    board.mate = (mate == 0) ? 0 : (mate * 2 - 1);
}

const run = boardstr => {
    let board = clean_board();

    if (boardstr.length > 0) {
        setBoard(boardstr)(board);
    }

    FillBoard(board);
    FillHand(board);
    setMate(board.turn, board.mate);
}

let boardstr = "4k/P+B3/3+Bp/4s/KRr2 b 2Gs 1";

//+B1bG1/3Sk/p4/RK+r2/G3+p b S 4
//4k/+Sg2b/S1p2/+R3K/g1bR1 b P 4
//4k/P+B3/3+Bp/4s/KRr2 b 2Gs 1
//B1bG1/3Sk/p4/RK+r2/G3+p b 5

run(boardstr);

const onlyAllowedChars = char => {
    const allowedChar = [...("1234567890" + NOTATION_PIECES[0] + NOTATION_PIECES[1] + "bw+/ ")];
    const checkfunc = (result, element) => result || (char == element);
    return allowedChar.reduce(checkfunc, false);
}

const verifyInputStr = str => {
    if (str == "0") return [];

    const clean_str = [...str].filter(onlyAllowedChars);
    if (clean_str.length > 0) {
        boardstr = clean_str;
    }
    return boardstr
}

const getInputStr = element => {
    element.preventDefault();
    const str = element.currentTarget.Input.value;
    run(verifyInputStr(str));
}
document.getElementById("input").addEventListener("submit", getInputStr);
