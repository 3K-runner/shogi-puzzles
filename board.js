const PIECE_LIST = "pieces" + BOARD_NUM.toString();

const Kanji = listname => {
    switch (listname) {
    case "pieces9": return [" ", "歩", "香", "桂", "銀", "金", "角", "飛", "王"]; break;
    case "pieces5": return [" ", "歩", "銀", "金", "角", "飛", "王"]; break;
    default: return []; break;
    };
};

const proPieces = listname => {
    switch (listname) {
    case "pieces9": return [" ", "と", "杏", "圭", "全", "金", "馬", "竜", "王"]; break;
    case "pieces5": return [" ", "と", "全", "金", "馬", "竜", "王"]; break;
    default: return []; break;
    };
};

const pieces = Kanji(PIECE_LIST);
const propieces = proPieces(PIECE_LIST);

var std_tab_var = [];
for (let i = 0; i < BOARD_NUM; i++) {
    std_tab_var[i] = [];
    for (let j = 0; j < BOARD_NUM; j++) {
        std_tab_var[i][j] = [0, 0, 0];
    }
}
const std_tab = std_tab_var;

var std_hand_var = [];
for (let i = 0; i < 2; i++) {
    std_hand_var[i] = [];
    for (let j = 0; j < pieces.length - 1; j++) {
        std_hand_var[i][j] = 0;
    }
}
const std_hand = std_hand_var;

const clean_board = ({
    tab: std_tab,
    hand: std_hand,
    turn: 0,
    mate: 0,
});

//----------------------------------

const FillBoard = boardToUse => {
    for (let i = 0; i < BOARD_NUM; i++) {
        for (let j = 0; j < BOARD_NUM; j++) {
            var piece = boardToUse.tab[i][j][0];
            var tile = document.getElementById(tileId(i, j) + "t");
            if (piece == 0) continue;
               
            if ((boardToUse.tab[i][j][1] == 0)) {
                tile.style.transform = "rotate(180deg)";  
            }
            if (boardToUse.tab[i][j][2] == 0) {
                tile.textContent = pieces[piece];
                tile.style.color = "#000000";
            } else {
                tile.textContent = propieces[piece];
                tile.style.color = "#FF0000";
            }
        }
    }
}

const handId = turn => "hand" + turn.toString();

const FillHand = boardToUse =>{
    for (let i = 0; i < 2; i++) {
        var handstr = "";
        if (boardToUse.hand[i][0] == 0) continue;
        for  (let j = 1; j < pieces.length - 1; j++) {
            var numhand = boardToUse.hand[i][j];
            if (numhand == 0) continue;
            handstr = handstr + numhand.toString() + pieces[j] + " ";
        }
        if (handstr.length == 0) continue;

        document.getElementById(handId(i)).textContent = handstr;
    }
}

const setMate = (turn, mate) => {
    const player = (turn == 0) ? "Sente" : "Gote";
    const mateMessage = "Mate in " + mate.toString() + ": " + player + " to win";
    document.getElementById("mate").textContent = mateMessage;
}

const boardfile = ({
    file: "",
    count: 0,

    Add(str) {
        this.file = str;
    },

    Read() {
        let resp = this.file[this.count];
        this.count = this.count + 1;
        return Number(resp);
    }
});

const setBoard = boardstr => board => {
    var boardTxt = boardfile;
    boardTxt.Add(boardstr);

    var buff = 0;
    for (let i = 0; i < 2; i++) {
        if (boardTxt.Read() == 0) continue;
        board.hand[i][0] = 1;
        for (let j = 1; j < pieces.length - 1; j++) {
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
    var board = clean_board;

    if (boardstr.length > 0) {
        setBoard(boardstr)(board);
    }

    FillBoard(board);
    FillHand(board);
    setMate(board.turn, board.mate);
}

const boardstr = "101000200200000060011041100000041110000002006105105000011";

//01010004110400310000021060010000005106105010031000010114
//01100000000600211300004002100100005110006103000400510014
//101000200200000060011041100000041110000002006105105000011

run(boardstr);

//B1bG1/3Sk/p4/RK+r2/G3+p_b_-_1