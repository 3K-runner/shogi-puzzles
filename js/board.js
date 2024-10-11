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
        for (let j = 0; j < PIECES.length - 1; j++) {
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
            
            const turn_or_pro = (piece[0] == (PIECES.length - 1)) ? 1 : 2;
            tile.textContent = PIECES[piece[0]][piece[turn_or_pro]];
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
            for (let j = 1; j < PIECES.length - 1; j++) {
                const numhand = boardToUse.hand[i][j];
                if (numhand == 0) continue;
                handstr = handstr + NumToSOT(numhand) + PIECES[j][0] + " ";
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

//----------------------------------

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

        //todo: read numbers with more than one digit

        return resp;
    }
});

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
            if (strIsNumber(buffer)) {
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
            if (strIsNumber(buffer)) {
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

let boardstr = MADE_PUZZLES[Math.floor(Math.random() * (MADE_PUZZLES.length - 1))];

run(boardstr);

let input_error = "";
const getInputStr = element => {
    element.preventDefault();
    const tag = element.currentTarget.Input;
    const str = tag.value;

    if (str == "0") { run(DEFAULT_POSITION); return; }

    const error_message = IsValidSfen(str);
    const is_sfen_valid = (error_message == "");

    if (!is_sfen_valid) console.log("Error on input: " + error_message);

    tag.style.color = is_sfen_valid ? "#00AA00" : "#AA0000";
    setTimeout(() => { tag.style.color = "#000000"}, 1000)
    
    if (!is_sfen_valid) return;

    run(str);
}
document.getElementById("input").addEventListener("submit", getInputStr);
