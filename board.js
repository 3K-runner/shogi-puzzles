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

const SOT_NUM = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const NumToSOT = num => {
    let str = "";
    while (num > 0) {
        str = SOT_NUM[num%10] + str;
        num = Math.floor(num / 10);
    }
    return str;
};

const FillHand = boardToUse => {
    for (let i = 0; i < 2; i++) {
        let handstr = "";
        if (boardToUse.hand[i][0] != 0) {
            for (let j = 1; j < pieces.length - 1; j++) {
                const numhand = boardToUse.hand[i][j];
                if (numhand == 0) continue;
                handstr = handstr + NumToSOT(numhand) + pieces[j][0] + " ";
            }
        }

        document.getElementById(handId(i)).textContent = handstr;
    }
}

const setMate = (turn, mate) => {
    let mateMessage = "No mate";
    if (mate > 0) {
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

const charIsNumber = char => !isNaN(Number(char));

const getPlayerPiece = (char, pro=0) => {
    for (let turn = 0; turn < 2; turn++) {
        for (let i = 0; i < NOTATION_PIECES[turn].length; i++) {
            if (char == NOTATION_PIECES[turn][i]) return [i + 1, turn, pro];
        }
    }
    return [0, 0, 0];
}

const setBoard = boardstr => board => {
    let boardTxt = boardfile();
    boardTxt.Add(boardstr);

    let buffer = "";
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {

            buffer = boardTxt.Read();
            if (buffer == "/") buffer = boardTxt.Read();
            if (charIsNumber(buffer)) {
                j += Number(buffer) - 1;
                continue
            } 

            board.tab[i][j] = buffer.length > 1 
            ? getPlayerPiece(buffer[1], 1)
            : getPlayerPiece(buffer);
        }
    }
    
    boardTxt.Read();
    board.turn = (boardTxt.Read() == "w") ? 0 : 1; 
    boardTxt.Read();

    buffer = boardTxt.Read();
    if (buffer != "-") {
        for (let i = 0; buffer != " "; i++) {
            let qt = 1;
            if (charIsNumber(buffer)) {
                qt = Number(buffer);
                buffer = boardTxt.Read();
            }
            let piece = getPlayerPiece(buffer);
            board.hand[piece[1]][0] = 1;
            board.hand[piece[1]][piece[0]] = qt;
    
            buffer = boardTxt.Read();
        } 
    } else boardTxt.Read();

    buffer = boardTxt.Read();
    if (buffer == undefined) {
        board.mate = 0;
        return ;
    }
    let mate = Number(buffer);
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

//Puzzles for 5x5 shogi (mini shogi)
const MADE_PUZZLES = [
    "4k/P+B3/3+Bp/4s/KRr2 b 2Gs 1",
    "+B1bG1/3Sk/p4/RK+r2/G3+p b S 4",
    "4k/+Sg2b/S1p2/+R3K/g1bR1 b P 4",
    "4k/P+B3/3+Bp/4s/KRr2 b 2Gs 1",
    "B1bG1/3Sk/p4/RK+r2/G3+p b - 5",
    "1b2k/4p/pB3/1Kr2/1G3 b sSGR 5",
    "1Gbk1/2g1s/p1S2/5/1K2R b PBR 4",
    "3kb/3P1/1s1G1/2g1K/5 w psb2r 5",
    "3p1/4k/BgssG/5/K3+p w b2r 4",
    "1rggk/2R2/1B2p/P1K2/1+sS1b w - 4"
];

let boardstr = MADE_PUZZLES[Math.floor(Math.random() * (MADE_PUZZLES.length - 1))];

run(boardstr);

const onlyAllowedChars = char => {
    const allowedChar = [...("1234567890" + NOTATION_PIECES[0] + NOTATION_PIECES[1] + "bw+/- ")];
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
