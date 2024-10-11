const strIsNumber = str => !isNaN(Number(str));

const ChrInStr = char => str => {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == char) num++;
    }
    return num;
}

const CheckAllowedChars = char => allowedChars => {
    for (let i = 0; i < allowedChars.length; i++) {
        if (allowedChars[i] == char) return true;
    }
    return false;
}

const OnlyAllowedChars = chr => CheckAllowedChars(chr)(DEFAULT_ALLOWED_CHARS); 

//returns the specif error as a string
const IsValidSfen = sfen => {
    let test_sfen = boardfile();

    test_sfen.Add(sfen);

    if (sfen.length < (2 * BOARD_NUM - 1 + 2 + 2 + 2)) return "Not enough info";

    if (ChrInStr(' ')(sfen) != 3) return "Invalid field count";
    const fields_sfen = sfen.split(' ');
    
    //test board field
    if (ChrInStr('/')(sfen) != (BOARD_NUM - 1)) return "Not enough rows";
    const correct_board = [...fields_sfen[0]].filter(chr => CheckAllowedChars(chr)([...(DEFAULT_ALLOWED_CHARS + DEFAULT_ALLOWED_NUM_STR + "/+")]));
    if (correct_board.length != fields_sfen[0].length) return "Invalid chars in board field";
    //promotion does not affect piece count

    //test player field
    if (fields_sfen[1] != "w" && fields_sfen[1] != "b") return "Invalid player field";
    
    //test hand field
    const correct_hand  = [...fields_sfen[2]].filter(chr => CheckAllowedChars(chr)([...(DEFAULT_ALLOWED_CHARS + "123456789" + "0")]));
    if (fields_sfen[2] != "-" && (correct_hand.length != fields_sfen[2].length)) return "Invalid chars in hand";
    
    //test mate field
    if (!strIsNumber(fields_sfen[3])) return "Mate field invalid";
    
    return "";
}