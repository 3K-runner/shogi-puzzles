const BOARD_NUM = 5;

const PIECES = (num => {
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

const DEFAULT_POSITION = (num => {
    switch (num) {
    case 5: return "rbsgk/4p/5/P4/KGSBR b - 0";
    case 9: return "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 0";
    default: return "0";
    }
})(BOARD_NUM);

const MADE_PUZZLES = (num => {
    switch (num) {
    case 5:  return [
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
    case 9:  return [
    ""
    ];
    default: return [];
    }
})(BOARD_NUM);

const DEFAULT_ALLOWED_CHARS   = (NOTATION_PIECES[0] + NOTATION_PIECES[1]);
const DEFAULT_ALLOWED_NUM_STR = (num => {
    switch (num) {
    case 5: return "12345";
    case 9: return "123456789";
    default: return "";
    }
})(BOARD_NUM);