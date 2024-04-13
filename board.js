const Kanji = num => {
    switch (num) {
    case 9:  return [" ", "歩", "香", "桂", "銀", "金", "角", "飛", "王"];
    case 5:  return [" ", "歩", "銀", "金", "角", "飛", "王"];
    default: return [];
    };
};

const proKanji = num => {
    switch (num) {
    case 9:  return [" ", "と", "杏", "圭", "全", "金", "馬", "竜", "王"];
    case 5:  return [" ", "と", "全", "金", "馬", "竜", "王"];
    default: return [];
    };
};

const pieces = [Kanji(BOARD_NUM), proKanji(BOARD_NUM)];

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
            
            tile.textContent = pieces[piece[2]][piece[0]];
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
            for  (let j = 1; j < pieces[0].length - 1; j++) {
                let numhand = boardToUse.hand[i][j];
                if (numhand == 0) continue;
                handstr = handstr + numhand.toString() + pieces[0][j] + " ";
            }
        }

        document.getElementById(handId(i)).textContent = handstr;
    }
}

const setMate = (turn, mate) => {
    const player = (turn == 0) ? "Sente" : "Gote";
    const mateMessage = "Mate in " + mate.toString() + ": " + player + " to win";
    document.getElementById("mate").textContent = mateMessage;
}

const boardfile = () => ({
    file: "",
    count: 0,

    Add(str) {
        this.file = str;
    },

    Read() {
        const resp = this.file[this.count];
        this.count++;
        return Number(resp);
    }
});

const setBoard = boardstr => board => {
    let boardTxt = boardfile();
    boardTxt.Add(boardstr);

    let buff = 0;
    for (let i = 0; i < 2; i++) {
        if (boardTxt.Read() == 0) continue;
        board.hand[i][0] = 1;
        for (let j = 1; j < pieces[0].length - 1; j++) {
            board.hand[i][j] = boardTxt.Read();
        }
    } 
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            buff = boardTxt.Read();
            if (buff == 0) continue;

            board.tab[i][j][0] = buff
            board.tab[i][j][1] = boardTxt.Read();
            board.tab[i][j][2] = boardTxt.Read();
        }
    }
    board.turn = boardTxt.Read();
    const mate = boardTxt.Read();
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

let boardstr = "101000200200000060011041100000041110000002006105105000011";

//01010004110400310000021060010000005106105010031000010114
//01100000000600211300004002100100005110006103000400510014
//101000200200000060011041100000041110000002006105105000011

//shortest plausible str: 00000000000000000000000000000

run(boardstr);

const onlyAllowedChars = char => {
    const allowedChar = [..."1234567890"];
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

//B1bG1/3Sk/p4/RK+r2/G3+p_b_-_1
